<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EvaluationInstrument extends Model
{
    protected $fillable = [
        'name',
        'description',
        'division_id',
        'status',
    ];

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(EvaluationCategory::class)->orderBy('sort_order');
    }
}
