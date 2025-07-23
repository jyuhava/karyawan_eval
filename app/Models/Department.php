<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = [
        'name',
        'description',
        'director_id',
        'status',
    ];

    public function director(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'director_id');
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    public function divisions(): HasMany
    {
        return $this->hasMany(Division::class);
    }
}
