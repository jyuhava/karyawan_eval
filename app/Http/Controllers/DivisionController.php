<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Division;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DivisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Division::with(['manager', 'parent', 'department'])->withCount('employees');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('manager', function ($q) use ($search) {
                      $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('parent', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('department', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Status filter
        if ($request->filled('status') && $request->get('status') !== 'all') {
            $query->where('status', $request->get('status'));
        }

        // View type (tree or table)
        $viewType = $request->get('view', 'table');

        if ($viewType === 'tree') {
            // For tree view, get root divisions with all descendants
            $divisions = Division::with(['manager', 'department', 'children.manager', 'children.department', 'children.children.manager'])
                ->whereNull('parent_id')
                ->get();
        } else {
            // For table view, use pagination
            $divisions = $query->paginate(10)->withQueryString();
        }

        return Inertia::render('Divisions/Index', [
            'divisions' => $divisions,
            'filters' => $request->only(['search', 'status', 'view']),
            'viewType' => $viewType,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $employees = Employee::where('status', 'active')
            ->select('id', 'first_name', 'last_name')
            ->get();

        $parentDivisions = Division::where('status', 'active')
            ->select('id', 'name')
            ->get();

        $departments = Department::where('status', 'active')
            ->select('id', 'name')
            ->get();

        return Inertia::render('Divisions/Create', [
            'employees' => $employees,
            'parentDivisions' => $parentDivisions,
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:divisions,name',
            'description' => 'nullable|string',
            'manager_id' => 'nullable|exists:employees,id',
            'parent_id' => 'nullable|exists:divisions,id',
            'department_id' => 'nullable|exists:departments,id',
            'status' => 'required|in:active,inactive',
        ]);

        // Prevent circular reference
        if ($request->parent_id) {
            $parent = Division::find($request->parent_id);
            if ($parent && $this->wouldCreateCircularReference($parent, null)) {
                return back()->withErrors(['parent_id' => 'Pemilihan parent akan membuat circular reference.']);
            }
        }

        Division::create([
            'name' => $request->name,
            'description' => $request->description,
            'manager_id' => $request->manager_id,
            'parent_id' => $request->parent_id,
            'department_id' => $request->department_id,
            'status' => $request->status,
        ]);

        return redirect()->route('divisions.index')
            ->with('success', 'Divisi berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Division $division)
    {
        $division->load(['manager', 'parent', 'department', 'children.manager', 'employees']);

        return Inertia::render('Divisions/Show', [
            'division' => $division,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Division $division)
    {
        $employees = Employee::where('status', 'active')
            ->select('id', 'first_name', 'last_name')
            ->get();

        $parentDivisions = Division::where('status', 'active')
            ->where('id', '!=', $division->id)
            ->select('id', 'name')
            ->get();

        $departments = Department::where('status', 'active')
            ->select('id', 'name')
            ->get();

        return Inertia::render('Divisions/Edit', [
            'division' => $division,
            'employees' => $employees,
            'parentDivisions' => $parentDivisions,
            'departments' => $departments,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Division $division)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:divisions,name,' . $division->id,
            'description' => 'nullable|string',
            'manager_id' => 'nullable|exists:employees,id',
            'parent_id' => 'nullable|exists:divisions,id',
            'department_id' => 'nullable|exists:departments,id',
            'status' => 'required|in:active,inactive',
        ]);

        // Prevent circular reference
        if ($request->parent_id && $request->parent_id != $division->parent_id) {
            $parent = Division::find($request->parent_id);
            if ($parent && $this->wouldCreateCircularReference($parent, $division->id)) {
                return back()->withErrors(['parent_id' => 'Pemilihan parent akan membuat circular reference.']);
            }
        }

        $division->update([
            'name' => $request->name,
            'description' => $request->description,
            'manager_id' => $request->manager_id,
            'parent_id' => $request->parent_id,
            'department_id' => $request->department_id,
            'status' => $request->status,
        ]);

        return redirect()->route('divisions.index')
            ->with('success', 'Divisi berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Division $division)
    {
        // Check if division has children
        if ($division->children()->count() > 0) {
            return back()->withErrors(['error' => 'Tidak dapat menghapus divisi yang memiliki sub-divisi.']);
        }

        // Check if division has employees
        if ($division->employees()->count() > 0) {
            return back()->withErrors(['error' => 'Tidak dapat menghapus divisi yang memiliki karyawan.']);
        }

        $division->delete();

        return redirect()->route('divisions.index')
            ->with('success', 'Divisi berhasil dihapus!');
    }

    /**
     * Check if setting a parent would create a circular reference
     */
    private function wouldCreateCircularReference(Division $potentialParent, $currentDivisionId = null): bool
    {
        if ($currentDivisionId && $potentialParent->id === $currentDivisionId) {
            return true;
        }

        $parent = $potentialParent->parent;
        while ($parent) {
            if ($currentDivisionId && $parent->id === $currentDivisionId) {
                return true;
            }
            $parent = $parent->parent;
        }

        return false;
    }
}
