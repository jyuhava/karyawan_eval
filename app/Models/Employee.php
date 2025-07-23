<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    protected $fillable = [
        'employee_number',
        'email',
        'first_name',
        'last_name',
        'phone',
        'address',
        'birth_date',
        'gender',
        'hire_date',
        'salary',
        'status',
        'profile_photo',
        'user_id',
        'department_id',
        'division_id',
        'is_division_head',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'hire_date' => 'date',
        'salary' => 'decimal:2',
        'is_division_head' => 'boolean',
    ];

    protected $appends = [
        'full_name',
        'profile_photo_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function directedDepartments()
    {
        return $this->hasMany(Department::class, 'director_id');
    }

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    public function managedDivisions()
    {
        return $this->hasMany(Division::class, 'manager_id');
    }

    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getProfilePhotoUrlAttribute(): ?string
    {
        return $this->profile_photo 
            ? asset('storage/' . $this->profile_photo)
            : null;
    }

    public static function generateEmployeeNumber(): string
    {
        $year = date('Y');
        $lastEmployee = self::whereYear('created_at', $year)
            ->orderBy('employee_number', 'desc')
            ->first();

        if ($lastEmployee) {
            $lastNumber = (int) substr($lastEmployee->employee_number, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $year . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }
}
