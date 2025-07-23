<?php

use App\Http\Controllers\AssessmentBuilderController;
use App\Http\Controllers\AssessmentSessionController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EvaluationInstrumentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Employee routes
    Route::resource('employees', EmployeeController::class);
    
    // Department routes
    Route::resource('departments', DepartmentController::class);
    
    // Division routes
    Route::resource('divisions', DivisionController::class);
    
    // Evaluation Instrument routes
    Route::resource('evaluation-instruments', EvaluationInstrumentController::class);
    
    // Assessment Builder routes
    Route::prefix('evaluation-instruments/{evaluationInstrument}/builder')->group(function () {
        Route::get('/', [AssessmentBuilderController::class, 'index'])->name('assessment-builder.index');
        Route::post('/categories', [AssessmentBuilderController::class, 'storeCategory'])->name('assessment-builder.categories.store');
        Route::put('/categories/{category}', [AssessmentBuilderController::class, 'updateCategory'])->name('assessment-builder.categories.update');
        Route::delete('/categories/{category}', [AssessmentBuilderController::class, 'destroyCategory'])->name('assessment-builder.categories.destroy');
        Route::post('/categories/{category}/indicators', [AssessmentBuilderController::class, 'storeIndicator'])->name('assessment-builder.indicators.store');
        Route::put('/indicators/{indicator}', [AssessmentBuilderController::class, 'updateIndicator'])->name('assessment-builder.indicators.update');
        Route::delete('/indicators/{indicator}', [AssessmentBuilderController::class, 'destroyIndicator'])->name('assessment-builder.indicators.destroy');
        Route::put('/categories-order', [AssessmentBuilderController::class, 'updateCategoryOrder'])->name('assessment-builder.categories.order');
        Route::put('/categories/{category}/indicators-order', [AssessmentBuilderController::class, 'updateIndicatorOrder'])->name('assessment-builder.indicators.order');
    });
    
    // Assessment Session routes
    Route::resource('assessment-sessions', AssessmentSessionController::class);
    Route::post('/assessment-sessions/{assessmentSession}/results', [AssessmentSessionController::class, 'saveResults'])->name('assessment-sessions.save-results');
    Route::patch('/assessment-sessions/{assessmentSession}/publish', [AssessmentSessionController::class, 'publish'])->name('assessment-sessions.publish');
    Route::patch('/assessment-sessions/{assessmentSession}/unpublish', [AssessmentSessionController::class, 'unpublish'])->name('assessment-sessions.unpublish');
    Route::post('/assessment-sessions/{assessmentSession}/documentation', [AssessmentSessionController::class, 'uploadDocumentation'])->name('assessment-sessions.upload-documentation');
    Route::delete('/assessment-documentations/{documentation}', [AssessmentSessionController::class, 'deleteDocumentation'])->name('assessment-documentations.destroy');
});

require __DIR__.'/auth.php';
