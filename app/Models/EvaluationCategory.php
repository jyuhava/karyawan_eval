<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EvaluationCategory extends Model
{
    protected $fillable = [
        'evaluation_instrument_id',
        'name',
        'description',
        'sort_order',
    ];

    public function evaluationInstrument(): BelongsTo
    {
        return $this->belongsTo(EvaluationInstrument::class);
    }

    public function indicators(): HasMany
    {
        return $this->hasMany(EvaluationIndicator::class)->orderBy('sort_order');
    }
}
