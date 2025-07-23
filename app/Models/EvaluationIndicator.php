<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvaluationIndicator extends Model
{
    protected $fillable = [
        'evaluation_category_id',
        'name',
        'description',
        'require_numeric_value',
        'require_text_value',
        'require_note',
        'require_recommendation',
        'sort_order',
    ];

    protected $casts = [
        'require_numeric_value' => 'boolean',
        'require_text_value' => 'boolean',
        'require_note' => 'boolean',
        'require_recommendation' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(EvaluationCategory::class, 'evaluation_category_id');
    }
}
