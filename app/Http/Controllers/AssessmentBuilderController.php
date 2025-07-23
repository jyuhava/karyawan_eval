<?php

namespace App\Http\Controllers;

use App\Models\EvaluationCategory;
use App\Models\EvaluationIndicator;
use App\Models\EvaluationInstrument;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssessmentBuilderController extends Controller
{
    /**
     * Display the assessment builder for a specific instrument
     */
    public function index(EvaluationInstrument $evaluationInstrument)
    {
        $evaluationInstrument->load(['categories.indicators', 'division']);

        return Inertia::render('AssessmentBuilder/Index', [
            'evaluationInstrument' => $evaluationInstrument,
        ]);
    }

    /**
     * Store a new category
     */
    public function storeCategory(Request $request, EvaluationInstrument $evaluationInstrument)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $maxSortOrder = $evaluationInstrument->categories()->max('sort_order') ?? 0;

        $category = $evaluationInstrument->categories()->create([
            'name' => $request->name,
            'description' => $request->description,
            'sort_order' => $maxSortOrder + 1,
        ]);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan!');
    }

    /**
     * Update a category
     */
    public function updateCategory(Request $request, EvaluationCategory $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->back()->with('success', 'Kategori berhasil diperbarui!');
    }

    /**
     * Delete a category
     */
    public function destroyCategory(EvaluationCategory $category)
    {
        $category->delete();

        return redirect()->back()->with('success', 'Kategori berhasil dihapus!');
    }

    /**
     * Store a new indicator
     */
    public function storeIndicator(Request $request, EvaluationInstrument $evaluationInstrument, EvaluationCategory $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'require_numeric_value' => 'boolean',
            'require_text_value' => 'boolean',
            'require_note' => 'boolean',
            'require_recommendation' => 'boolean',
        ]);

        $maxSortOrder = $category->indicators()->max('sort_order') ?? 0;

        $indicator = $category->indicators()->create([
            'name' => $request->name,
            'description' => $request->description,
            'require_numeric_value' => $request->boolean('require_numeric_value'),
            'require_text_value' => $request->boolean('require_text_value'),
            'require_note' => $request->boolean('require_note'),
            'require_recommendation' => $request->boolean('require_recommendation'),
            'sort_order' => $maxSortOrder + 1,
        ]);

        return redirect()->back()->with('success', 'Indikator berhasil ditambahkan!');
    }

    /**
     * Update an indicator
     */
    public function updateIndicator(Request $request, EvaluationIndicator $indicator)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'require_numeric_value' => 'boolean',
            'require_text_value' => 'boolean',
            'require_note' => 'boolean',
            'require_recommendation' => 'boolean',
        ]);

        $indicator->update([
            'name' => $request->name,
            'description' => $request->description,
            'require_numeric_value' => $request->boolean('require_numeric_value'),
            'require_text_value' => $request->boolean('require_text_value'),
            'require_note' => $request->boolean('require_note'),
            'require_recommendation' => $request->boolean('require_recommendation'),
        ]);

        return redirect()->back()->with('success', 'Indikator berhasil diperbarui!');
    }

    /**
     * Delete an indicator
     */
    public function destroyIndicator(EvaluationIndicator $indicator)
    {
        $indicator->delete();

        return redirect()->back()->with('success', 'Indikator berhasil dihapus!');
    }

    /**
     * Update category sort order
     */
    public function updateCategoryOrder(Request $request, EvaluationInstrument $evaluationInstrument)
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:evaluation_categories,id',
            'categories.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->categories as $categoryData) {
            EvaluationCategory::where('id', $categoryData['id'])
                ->where('evaluation_instrument_id', $evaluationInstrument->id)
                ->update(['sort_order' => $categoryData['sort_order']]);
        }

        return redirect()->back()->with('success', 'Urutan kategori berhasil diperbarui!');
    }

    /**
     * Update indicator sort order
     */
    public function updateIndicatorOrder(Request $request, EvaluationCategory $category)
    {
        $request->validate([
            'indicators' => 'required|array',
            'indicators.*.id' => 'required|exists:evaluation_indicators,id',
            'indicators.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->indicators as $indicatorData) {
            EvaluationIndicator::where('id', $indicatorData['id'])
                ->where('evaluation_category_id', $category->id)
                ->update(['sort_order' => $indicatorData['sort_order']]);
        }

        return redirect()->back()->with('success', 'Urutan indikator berhasil diperbarui!');
    }
}
