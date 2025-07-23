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
        Schema::create('evaluation_indicators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('require_numeric_value')->default(false);
            $table->boolean('require_text_value')->default(false);
            $table->boolean('require_note')->default(false);
            $table->boolean('require_recommendation')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluation_indicators');
    }
};
