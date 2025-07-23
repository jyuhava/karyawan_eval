<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Division;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Employee::with('user');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('employee_number', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        $employees = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::where('status', 'active')
            ->select('id', 'name')
            ->get();

        $divisions = Division::where('status', 'active')
            ->select('id', 'name')
            ->get();

        return Inertia::render('Employees/Create', [
            'departments' => $departments,
            'divisions' => $divisions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:employees,email|unique:users,email',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'hire_date' => 'nullable|date',
            'salary' => 'nullable|numeric|min:0',
            'department_id' => 'nullable|exists:departments,id',
            'division_id' => 'nullable|exists:divisions,id',
            'is_division_head' => 'boolean',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Generate employee number
        $employeeNumber = Employee::generateEmployeeNumber();

        // Handle profile photo upload
        $profilePhotoPath = null;
        if ($request->hasFile('profile_photo')) {
            $profilePhotoPath = $request->file('profile_photo')->store('employee-photos', 'public');
        }

        // Create user account
        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
            'password' => Hash::make('password123'), // Default password
            'role' => 'employee',
        ]);

        // Create employee record
        Employee::create([
            'employee_number' => $employeeNumber,
            'email' => $request->email,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone' => $request->phone,
            'address' => $request->address,
            'birth_date' => $request->birth_date,
            'gender' => $request->gender,
            'hire_date' => $request->hire_date ?? now(),
            'salary' => $request->salary,
            'department_id' => $request->department_id,
            'division_id' => $request->division_id,
            'is_division_head' => $request->boolean('is_division_head'),
            'profile_photo' => $profilePhotoPath,
            'user_id' => $user->id,
        ]);

        return redirect()->route('employees.index')
            ->with('success', 'Karyawan berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        $employee->load('user');
        
        return Inertia::render('Employees/Show', [
            'employee' => $employee
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        $departments = Department::where('status', 'active')
            ->select('id', 'name')
            ->get();

        $divisions = Division::where('status', 'active')
            ->select('id', 'name')
            ->get();

        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
            'departments' => $departments,
            'divisions' => $divisions
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        $request->validate([
            'email' => 'required|email|unique:employees,email,' . $employee->id . '|unique:users,email,' . $employee->user_id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'hire_date' => 'nullable|date',
            'salary' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,inactive,terminated',
            'department_id' => 'nullable|exists:departments,id',
            'division_id' => 'nullable|exists:divisions,id',
            'is_division_head' => 'boolean',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle profile photo upload
        $profilePhotoPath = $employee->profile_photo;
        if ($request->hasFile('profile_photo')) {
            // Delete old photo
            if ($employee->profile_photo) {
                Storage::disk('public')->delete($employee->profile_photo);
            }
            $profilePhotoPath = $request->file('profile_photo')->store('employee-photos', 'public');
        }

        // Update user account
        $employee->user->update([
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
        ]);

        // Update employee record
        $employee->update([
            'email' => $request->email,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone' => $request->phone,
            'address' => $request->address,
            'birth_date' => $request->birth_date,
            'gender' => $request->gender,
            'hire_date' => $request->hire_date,
            'salary' => $request->salary,
            'status' => $request->status,
            'department_id' => $request->department_id,
            'division_id' => $request->division_id,
            'is_division_head' => $request->boolean('is_division_head'),
            'profile_photo' => $profilePhotoPath,
        ]);

        return redirect()->route('employees.index')
            ->with('success', 'Data karyawan berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        // Delete profile photo
        if ($employee->profile_photo) {
            Storage::disk('public')->delete($employee->profile_photo);
        }

        // Delete user account (will cascade delete employee due to foreign key)
        $employee->user->delete();

        return redirect()->route('employees.index')
            ->with('success', 'Karyawan berhasil dihapus!');
    }
}
