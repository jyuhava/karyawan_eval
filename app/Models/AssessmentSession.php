<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssessmentSession extends Model
{
    protected $fillable = [
        'employee_id',
        'evaluation_instrument_id',
        'assessor_id',
        'is_education',
        'subject',
        'material',
        'start_time',
        'end_time',
        'description',
        'status',
    ];

    protected $casts = [
        'is_education' => 'boolean',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function evaluationInstrument(): BelongsTo
    {
        return $this->belongsTo(EvaluationInstrument::class);
    }

    public function assessor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assessor_id');
    }

    public function results(): HasMany
    {
        return $this->hasMany(AssessmentResult::class);
    }

    public function documentations(): HasMany
    {
        return $this->hasMany(AssessmentDocumentation::class);
    }
}
