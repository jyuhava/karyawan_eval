<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Division extends Model
{
    protected $fillable = [
        'name',
        'description',
        'manager_id',
        'parent_id',
        'department_id',
        'status',
    ];

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Division::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Division::class, 'parent_id');
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    // Get all descendants (children, grandchildren, etc.)
    public function descendants(): HasMany
    {
        return $this->children()->with('descendants');
    }

    // Get all ancestors (parent, grandparent, etc.)
    public function ancestors()
    {
        $ancestors = collect();
        $parent = $this->parent;
        
        while ($parent) {
            $ancestors->push($parent);
            $parent = $parent->parent;
        }
        
        return $ancestors;
    }

    // Get the full path (e.g., "Parent > Child > Current")
    public function getFullPathAttribute(): string
    {
        $ancestors = $this->ancestors()->reverse();
        $path = $ancestors->pluck('name')->toArray();
        $path[] = $this->name;
        
        return implode(' > ', $path);
    }

    // Get level/depth in hierarchy
    public function getLevelAttribute(): int
    {
        return $this->ancestors()->count();
    }
}
