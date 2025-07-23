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
        Schema::create('assessment_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_session_id')->constrained()->onDelete('cascade');
            $table->foreignId('evaluation_indicator_id')->constrained()->onDelete('cascade');
            $table->decimal('numeric_value', 8, 2)->nullable(); // untuk nilai angka
            $table->string('text_value')->nullable(); // untuk nilai teks
            $table->text('note')->nullable(); // untuk catatan
            $table->text('recommendation')->nullable(); // untuk rekomendasi
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_results');
    }
};
