"use client";

import { useEffect, useState } from "react";
import { analyzeNutrition } from "@/app/actions/analyzeNutrition";
import { NutritionHeader } from "@/components/nutrition/NutritionHeader";
import { NutritionInput } from "@/components/nutrition/NutritionInput";
import { NutritionResults } from "@/components/nutrition/NutritionResults";

// ⭐ Imports del nuevo módulo de registros de comida
import { useCreateFoodRecord } from "@/lib/foodRecords/useFoodRecords";
import type { MealType } from "@/lib/foodRecords/types";

type NutritionFood = {
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
};

type NutritionResult = {
    foods: NutritionFood[];
    totals: {
        calories: number;
        proteinGrams: number;
        carbsGrams: number;
        fatGrams: number;
    };
    overallConfidence: "low" | "medium" | "high";
};

const NUTRITION_CACHE_KEY = "nutrition-analysis";
const NUTRITION_CACHE_TTL = 30 * 60 * 1000;

type NutritionCache = {
    nutrition: NutritionResult;
    inputText: string;
    imagePreview: string | null;
    timestamp: number;
};

export default function NutritionPage() {
    const [inputText, setInputText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [nutrition, setNutrition] = useState<NutritionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ⭐ Inicializamos el hook de mutación
    const createFoodRecord = useCreateFoodRecord();

    useEffect(() => {
        try {
            const cached = sessionStorage.getItem(NUTRITION_CACHE_KEY);
            if (!cached) return;

            const parsed: NutritionCache = JSON.parse(cached);
            const isExpired = Date.now() - parsed.timestamp > NUTRITION_CACHE_TTL;

            if (isExpired) {
                sessionStorage.removeItem(NUTRITION_CACHE_KEY);
                return;
            }

            setNutrition(parsed.nutrition);
            setInputText(parsed.inputText || "");
            setImagePreview(parsed.imagePreview || null);
        } catch (error) {
            console.error("No se pudo restaurar el análisis nutricional:", error);
            sessionStorage.removeItem(NUTRITION_CACHE_KEY);
        }
    }, []);

    const handleImageChange = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Selecciona una imagen válida.");
            return;
        }

        setError(null);
        setImage(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const handleRemoveImage = () => {
        setImage(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleAnalyze = async () => {
        if (!inputText.trim() && !image) {
            setError("Agrega una imagen o describe la comida.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            let imageBase64: string | undefined;
            if (image) {
                imageBase64 = await fileToBase64(image);
            }

            const result = await analyzeNutrition(inputText, imageBase64);

            if (!result.success) {
                setError(result.error);
                return;
            }

            setNutrition(result.nutrition);

            const cache: NutritionCache = {
                nutrition: result.nutrition,
                inputText,
                imagePreview,
                timestamp: Date.now(),
            };

            sessionStorage.setItem(NUTRITION_CACHE_KEY, JSON.stringify(cache));
        } catch (error) {
            console.error(error);
            setError("No se pudo analizar la comida. Inténtalo nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setNutrition(null);
        setInputText("");
        setImage(null);
        setImagePreview(null);
        setError(null);
        sessionStorage.removeItem(NUTRITION_CACHE_KEY);
    };

    // ⭐ Función actualizada para guardar, recibe el MealType seleccionado
    const handleSaveResult = (mealType: MealType) => {
        if (!nutrition) return;

        // Ejecutamos la mutación. Serializamos el array a string porque el backend lo espera así.
        createFoodRecord.mutate({
            mealType,
            foodsJson: JSON.stringify(nutrition.foods),
        });
    };

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-8">
            <NutritionHeader
                hasData={!!nutrition || !!imagePreview || !!inputText}
                onClear={handleClear}
            />

            <NutritionInput
                inputText={inputText}
                imagePreview={imagePreview}
                loading={loading}
                error={error}
                onTextChange={setInputText}
                onImageChange={handleImageChange}
                onRemoveImage={handleRemoveImage}
                onAnalyze={handleAnalyze}
            />

            {nutrition && (
                <NutritionResults
                    nutrition={nutrition}
                    onSave={handleSaveResult}
                    isSaving={createFoodRecord.isPending} // ⭐ Pasamos el estado de carga al componente
                />
            )}
        </main>
    );
}