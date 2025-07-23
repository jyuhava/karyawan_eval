<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentResult extends Model
{
    protected $fillable = [
        'assessment_session_id',
        'evaluation_indicator_id',
        'numeric_value',
        'text_value',
        'note',
        'recommendation',
    ];

    protected $casts = [
        'numeric_value' => 'decimal:2',
    ];

    public function assessmentSession(): BelongsTo
    {
        return $this->belongsTo(AssessmentSession::class);
    }

    public function evaluationIndicator(): BelongsTo
    {
        return $this->belongsTo(EvaluationIndicator::class);
    }
}
