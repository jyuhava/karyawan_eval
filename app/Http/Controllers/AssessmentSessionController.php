<?php

namespace App\Http\Controllers;

use App\Models\AssessmentDocumentation;
use App\Models\AssessmentResult;
use App\Models\AssessmentSession;
use App\Models\Employee;
use App\Models\EvaluationInstrument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AssessmentSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = AssessmentSession::with(['employee', 'evaluationInstrument', 'assessor']);

        // Filter berdasarkan role
        if ($user->role === 'employee') {
            // Employee hanya bisa melihat assessment session yang dia buat (sebagai assessor)
            // dan harus ketua divisi
            $employee = $user->employee;
            if (!$employee || !$employee->is_division_head) {
                abort(403, 'Hanya ketua divisi yang dapat mengakses halaman ini.');
            }
            
            $query->where('assessor_id', $user->id)
                  ->whereHas('employee', function ($q) use ($employee) {
                      $q->where('division_id', $employee->division_id);
                  });
        }

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('employee', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('evaluationInstrument', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhere('subject', 'like', "%{$search}%")
                ->orWhere('material', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status') && $request->get('status') !== 'all') {
            $query->where('status', $request->get('status'));
        }

        $assessmentSessions = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('AssessmentSessions/Index', [
            'assessmentSessions' => $assessmentSessions,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        
        // Get employees based on user role
        if ($user->role === 'admin') {
            $employees = Employee::with('division')->where('status', 'active')->get();
            $evaluationInstruments = EvaluationInstrument::where('status', 'active')->get();
        } else {
            // Employee (ketua divisi) hanya bisa menilai karyawan di divisinya
            $employee = $user->employee;
            if (!$employee || !$employee->is_division_head) {
                abort(403, 'Hanya ketua divisi yang dapat membuat assessment session.');
            }
            
            $employees = Employee::with('division')
                ->where('division_id', $employee->division_id)
                ->where('status', 'active')
                ->where('id', '!=', $employee->id) // Exclude diri sendiri
                ->get();
                
            $evaluationInstruments = EvaluationInstrument::where('status', 'active')
                ->where(function ($q) use ($employee) {
                    $q->whereNull('division_id')
                      ->orWhere('division_id', $employee->division_id);
                })
                ->get();
        }

        return Inertia::render('AssessmentSessions/Create', [
            'employees' => $employees,
            'evaluationInstruments' => $evaluationInstruments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        

        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'evaluation_instrument_id' => 'required|exists:evaluation_instruments,id',
            'is_education' => 'boolean',
            'subject' => 'required_if:is_education,true|nullable|string|max:255',
            'material' => 'required_if:is_education,true|nullable|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'description' => 'nullable|string',
        ]);

        \Log::info('Validation passed');

        $assessmentSession = AssessmentSession::create([
            'employee_id' => $request->employee_id,
            'evaluation_instrument_id' => $request->evaluation_instrument_id,
            'assessor_id' => Auth::id(),
            'is_education' => $request->boolean('is_education'),
            'subject' => $request->is_education ? $request->subject : null,
            'material' => $request->is_education ? $request->material : null,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'description' => $request->description,
            'status' => 'draft',
        ]);


        return redirect()->route('assessment-sessions.show', $assessmentSession)
            ->with('success', 'Assessment Session berhasil dibuat!');
    }

    /**
     * Display the specified resource.
     */
    public function show(AssessmentSession $assessmentSession)
    {
        $user = Auth::user();
        
        // Check authorization
        if ($user->role === 'employee') {
            if ($assessmentSession->assessor_id !== $user->id) {
                abort(403, 'Anda tidak memiliki akses ke assessment session ini.');
            }
        }

        $assessmentSession->load([
            'employee.division',
            'evaluationInstrument.categories.indicators',
            'assessor',
            'results.evaluationIndicator',
            'documentations'
        ]);

        return Inertia::render('AssessmentSessions/Show', [
            'assessmentSession' => $assessmentSession,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AssessmentSession $assessmentSession)
    {
        $user = Auth::user();
        
        // Check authorization
        if ($user->role === 'employee') {
            if ($assessmentSession->assessor_id !== $user->id) {
                abort(403, 'Anda tidak memiliki akses ke assessment session ini.');
            }
        }

        // Only allow editing if status is draft
        if ($assessmentSession->status !== 'draft') {
            return redirect()->route('assessment-sessions.show', $assessmentSession)
                ->with('error', 'Hanya assessment session dengan status draft yang dapat diedit.');
        }

        // Get employees and evaluation instruments based on user role
        if ($user->role === 'admin') {
            $employees = Employee::with('division')->where('status', 'active')->get();
            $evaluationInstruments = EvaluationInstrument::where('status', 'active')->get();
        } else {
            $employee = $user->employee;
            $employees = Employee::with('division')
                ->where('division_id', $employee->division_id)
                ->where('status', 'active')
                ->where('id', '!=', $employee->id)
                ->get();
                
            $evaluationInstruments = EvaluationInstrument::where('status', 'active')
                ->where(function ($q) use ($employee) {
                    $q->whereNull('division_id')
                      ->orWhere('division_id', $employee->division_id);
                })
                ->get();
        }

        return Inertia::render('AssessmentSessions/Edit', [
            'assessmentSession' => $assessmentSession,
            'employees' => $employees,
            'evaluationInstruments' => $evaluationInstruments,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AssessmentSession $assessmentSession)
    {
        $user = Auth::user();
        
        // Check authorization
        if ($user->role === 'employee') {
            if ($assessmentSession->assessor_id !== $user->id) {
                abort(403, 'Anda tidak memiliki akses ke assessment session ini.');
            }
        }

        // Only allow editing if status is draft
        if ($assessmentSession->status !== 'draft') {
            return redirect()->route('assessment-sessions.show', $assessmentSession)
                ->with('error', 'Hanya assessment session dengan status draft yang dapat diedit.');
        }

        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'evaluation_instrument_id' => 'required|exists:evaluation_instruments,id',
            'is_education' => 'boolean',
            'subject' => 'required_if:is_education,true|nullable|string|max:255',
            'material' => 'required_if:is_education,true|nullable|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'description' => 'nullable|string',
        ]);

        $assessmentSession->update([
            'employee_id' => $request->employee_id,
            'evaluation_instrument_id' => $request->evaluation_instrument_id,
            'is_education' => $request->boolean('is_education'),
            'subject' => $request->is_education ? $request->subject : null,
            'material' => $request->is_education ? $request->material : null,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'description' => $request->description,
        ]);

        return redirect()->route('assessment-sessions.show', $assessmentSession)
            ->with('success', 'Assessment Session berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AssessmentSession $assessmentSession)
    {
        $user = Auth::user();
        
        // Check authorization
        if ($user->role === 'employee') {
            if ($assessmentSession->assessor_id !== $user->id) {
                abort(403, 'Anda tidak memiliki akses ke assessment session ini.');
            }
        }

        // Only allow deletion if status is draft
        if ($assessmentSession->status !== 'draft') {
            return redirect()->route('assessment-sessions.index')
                ->with('error', 'Hanya assessment session dengan status draft yang dapat dihapus.');
        }

        // Delete associated files
        foreach ($assessmentSession->documentations as $doc) {
            Storage::delete($doc->file_path);
        }

        $assessmentSession->delete();

        return redirect()->route('assessment-sessions.index')
            ->with('success', 'Assessment Session berhasil dihapus!');
    }

    /**
     * Save assessment results
     */
    public function saveResults(Request $request, AssessmentSession $assessmentSession)
    {
        $user = Auth::user();
        
        // Check authorization
        if ($user->role === 'employee') {
            if ($assessmentSession->assessor_id !== $user->id) {
                abort(403, 'Anda tidak memiliki akses ke assessment session ini.');
            }
        }

        $request->validate([
            'results' => 'required|array',
            'results.*.evaluation_indicator_id' => 'required|exists:evaluation_indicators,id',
            'results.*.numeric_value' => 'nullable|numeric',
            'results.*.text_value' => 'nullable|string',
            'results.*.note' => 'nullable|string',
            'results.*.recommendation' => 'nullable|string',
        ]);

        foreach ($request->results as $resultData) {
            AssessmentResult::updateOrCreate(
                [
                    'assessment_session_id' => $assessmentSession->id,
                    'evaluation_indicator_id' => $resultData['evaluation_indicator_id'],
                ],
                [
                    'numeric_value' => $resultData['numeric_value'] ?? null,
                    'text_value' => $resultData['text_value'] ?? null,
                    'note' => $resultData['note'] ?? null,
                    'recommendation' => $resultData['recommendation'] ?? null,
                ]
            );
        }

        return redirect()->back()->with('success', 'Hasil penilaian berhasil disimpan!');
    }

    /**
     * Publish assessment session
     */
    public function publish(AssessmentSession $assessmentSession)
    {
        $user = Auth::user();
        
        // Check authorization
        if ($user->role === 'employee') {
            if ($assessmentSession->assessor_id !== $user->id) {
                abort(403, 'Anda tidak memiliki akses ke assessment session ini.');
            }
        }

        $assessmentSession->update(['status' => 'published']);

        return redirect()->back()->with('success', 'Assessment Session berhasil dipublish!');
    }

    /**
     * Unpublish assessment session
     */
    public function unpublish(AssessmentSession $assessmentSession)
    {
        $user = Auth::user();
        
        // Check authorization
        if ($user->role === 'employee') {
            if ($assessmentSession->assessor_id !== $user->id) {
                abort(403, 'Anda tidak memiliki akses ke assessment session ini.');
            }
        }

        $assessmentSession->update(['status' => 'draft']);

        return redirect()->back()->with('success', 'Assessment Session berhasil di-unpublish!');
    }

    /**
     * Upload documentation
     */
    public function uploadDocumentation(Request $request, AssessmentSession $assessmentSession)
    {
        $user = Auth::user();
        
        // Check authorization
        if ($user->role === 'employee') {
            if ($assessmentSession->assessor_id !== $user->id) {
                abort(403, 'Anda tidak memiliki akses ke assessment session ini.');
            }
        }

        $request->validate([
            'files' => 'required|array',
            'files.*' => 'required|file|mimes:jpeg,png,jpg,gif,pdf|max:5120', // 5MB max
            'descriptions' => 'array',
            'descriptions.*' => 'nullable|string|max:255',
        ]);

        $uploadedFiles = [];

        foreach ($request->file('files') as $index => $file) {
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->store('assessment-documentations', 'public');

            $documentation = AssessmentDocumentation::create([
                'assessment_session_id' => $assessmentSession->id,
                'file_name' => $fileName,
                'file_path' => $filePath,
                'file_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
                'description' => $request->descriptions[$index] ?? null,
            ]);

            $uploadedFiles[] = $documentation;
        }

        return redirect()->back()->with('success', count($uploadedFiles) . ' file dokumentasi berhasil diupload!');
    }

    /**
     * Delete documentation
     */
    public function deleteDocumentation(AssessmentDocumentation $documentation)
    {
        $user = Auth::user();
        
        // Check authorization
        if ($user->role === 'employee') {
            if ($documentation->assessmentSession->assessor_id !== $user->id) {
                abort(403, 'Anda tidak memiliki akses ke dokumentasi ini.');
            }
        }

        Storage::delete($documentation->file_path);
        $documentation->delete();

        return redirect()->back()->with('success', 'Dokumentasi berhasil dihapus!');
    }
}
