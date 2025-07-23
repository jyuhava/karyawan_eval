<?php

namespace App\Http\Controllers;

use App\Models\Division;
use App\Models\EvaluationInstrument;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EvaluationInstrumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = EvaluationInstrument::with('division');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('division', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Status filter
        if ($request->filled('status') && $request->get('status') !== 'all') {
            $query->where('status', $request->get('status'));
        }

        $evaluationInstruments = $query->paginate(10)->withQueryString();

        return Inertia::render('EvaluationInstruments/Index', [
            'evaluationInstruments' => $evaluationInstruments,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $divisions = Division::where('status', 'active')
            ->select('id', 'name')
            ->get();

        return Inertia::render('EvaluationInstruments/Create', [
            'divisions' => $divisions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:evaluation_instruments,name',
            'description' => 'nullable|string',
            'division_id' => 'nullable|exists:divisions,id',
            'status' => 'required|in:active,inactive',
        ]);

        EvaluationInstrument::create([
            'name' => $request->name,
            'description' => $request->description,
            'division_id' => $request->division_id,
            'status' => $request->status,
        ]);

        return redirect()->route('evaluation-instruments.index')
            ->with('success', 'Instrumen Evaluasi berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(EvaluationInstrument $evaluationInstrument)
    {
        $evaluationInstrument->load(['division', 'categories.indicators']);

        return Inertia::render('EvaluationInstruments/Show', [
            'evaluationInstrument' => $evaluationInstrument,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EvaluationInstrument $evaluationInstrument)
    {
        $divisions = Division::where('status', 'active')
            ->select('id', 'name')
            ->get();

        return Inertia::render('EvaluationInstruments/Edit', [
            'evaluationInstrument' => $evaluationInstrument,
            'divisions' => $divisions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EvaluationInstrument $evaluationInstrument)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:evaluation_instruments,name,' . $evaluationInstrument->id,
            'description' => 'nullable|string',
            'division_id' => 'nullable|exists:divisions,id',
            'status' => 'required|in:active,inactive',
        ]);

        $evaluationInstrument->update([
            'name' => $request->name,
            'description' => $request->description,
            'division_id' => $request->division_id,
            'status' => $request->status,
        ]);

        return redirect()->route('evaluation-instruments.index')
            ->with('success', 'Instrumen Evaluasi berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EvaluationInstrument $evaluationInstrument)
    {
        $evaluationInstrument->delete();

        return redirect()->route('evaluation-instruments.index')
            ->with('success', 'Instrumen Evaluasi berhasil dihapus!');
    }
}
