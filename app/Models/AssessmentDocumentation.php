<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentDocumentation extends Model
{
    protected $fillable = [
        'assessment_session_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
        'description',
    ];

    public function assessmentSession(): BelongsTo
    {
        return $this->belongsTo(AssessmentSession::class);
    }

    public function getFileSizeHumanAttribute()
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
}
