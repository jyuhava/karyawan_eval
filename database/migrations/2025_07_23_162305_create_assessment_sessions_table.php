<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assessment_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('evaluation_instrument_id')->constrained()->onDelete('cascade');
            $table->foreignId('assessor_id')->constrained('users')->onDelete('cascade');
            $table->boolean('is_education')->default(false);
            $table->string('subject')->nullable(); // mata pelajaran
            $table->string('material')->nullable(); // materi
            $table->datetime('start_time');
            $table->datetime('end_time');
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'published', 'completed'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_sessions');
    }
};
