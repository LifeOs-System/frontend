"use client";

import { useState } from "react";
import { Sparkles, Save, Loader2 } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { TotalCard } from "./TotalCard";
import { FoodCard } from "./FoodCard";
import { MealType, MEAL_TYPE_OPTIONS } from "./types";

interface NutritionFood {
    name: string;
    quantity: number;
    unit: string;
    estimatedGrams: number;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    preparation: string;
    confidence: "low" | "medium" | "high";
}

interface NutritionResult {
    foods: NutritionFood[];
    totals: {
        calories: number;
        proteinGrams: number;
        carbsGrams: number;
        fatGrams: number;
    };
    overallConfidence: "low" | "medium" | "high";
}

interface NutritionResultsProps {
    nutrition: NutritionResult;
    onSave: (mealType: MealType) => void;
    isSaving?: boolean; // ⭐ Nueva prop opcional
}

export function NutritionResults({
                                     nutrition,
                                     onSave,
                                     isSaving = false
                                 }: NutritionResultsProps) {
    // Por defecto seleccionamos "Almuerzo" (3)
    const [selectedMealType, setSelectedMealType] = useState<MealType>(3);

    return (
        <section>
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-white/80" />
                    <h2 className="text-lg font-semibold text-white">Resultado</h2>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* ⭐ Select personalizado de Life OS */}
                    <Select
                        options={MEAL_TYPE_OPTIONS}
                        value={selectedMealType}
                        onChange={setSelectedMealType}
                        className="w-full sm:w-56"
                        disabled={isSaving} // Deshabilitar mientras guarda
                    />

                    {/* Botón Guardar */}
                    <button
                        type="button"
                        onClick={() => onSave(selectedMealType)}
                        disabled={isSaving}
                        className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Guardar
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Total */}
            <TotalCard totals={nutrition.totals} />

            {/* Foods */}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
                {nutrition.foods.map((food, index) => (
                    <FoodCard key={`${food.name}-${index}`} food={food} />
                ))}
            </div>

            {/* Overall confidence */}
            <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="text-sm text-white/50">Confianza general</span>
                <ConfidenceBadge confidence={nutrition.overallConfidence} />
            </div>
        </section>
    );
}

function ConfidenceBadge({ confidence }: { confidence: "low" | "medium" | "high" }) {
    const labels = { low: "Baja", medium: "Media", high: "Alta" };
    const colors = {
        low: "bg-red-500/10 text-red-400 border-red-500/20",
        medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        high: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };

    return (
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${colors[confidence]}`}>
            {labels[confidence]}
        </span>
    );
}