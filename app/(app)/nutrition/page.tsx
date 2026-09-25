"use client";

import { useEffect, useRef, useState } from "react";
import {
    Apple,
    Loader2,
    Sparkles,
    AlertCircle,
    ImagePlus,
    X,
    Flame,
    Beef,
    Wheat,
    Droplets,
} from "lucide-react";

import { analyzeNutrition } from "@/app/actions/analyzeNutrition";

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

    const [nutrition, setNutrition] =
        useState<NutritionResult | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        try {
            const cached = sessionStorage.getItem(
                NUTRITION_CACHE_KEY
            );

            if (!cached) {
                return;
            }

            const parsed: NutritionCache = JSON.parse(cached);

            const isExpired =
                Date.now() - parsed.timestamp >
                NUTRITION_CACHE_TTL;

            if (isExpired) {
                sessionStorage.removeItem(
                    NUTRITION_CACHE_KEY
                );

                return;
            }

            setNutrition(parsed.nutrition);
            setInputText(parsed.inputText || "");
            setImagePreview(parsed.imagePreview || null);
        } catch (error) {
            console.error(
                "No se pudo restaurar el análisis nutricional:",
                error
            );

            sessionStorage.removeItem(
                NUTRITION_CACHE_KEY
            );
        }
    }, []);

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

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

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const fileToBase64 = (
        file: File
    ): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result as string);
            };

            reader.onerror = reject;

            reader.readAsDataURL(file);
        });
    };

    const handleAnalyze = async () => {
        if (!inputText.trim() && !image) {
            setError(
                "Agrega una imagen o describe la comida."
            );

            return;
        }

        try {
            setLoading(true);
            setError(null);

            let imageBase64: string | undefined;

            if (image) {
                imageBase64 = await fileToBase64(image);
            }

            const result = await analyzeNutrition(
                inputText,
                imageBase64
            );

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

            sessionStorage.setItem(
                NUTRITION_CACHE_KEY,
                JSON.stringify(cache)
            );
        } catch (error) {
            console.error(error);

            setError(
                "No se pudo analizar la comida. Inténtalo nuevamente."
            );
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

        sessionStorage.removeItem(
            NUTRITION_CACHE_KEY
        );

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10">
                            <Apple className="h-5 w-5 text-white/80" />
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            Análisis nutricional
                        </h1>
                    </div>

                    <p className="text-sm text-white/40">
                        Analiza una comida usando una fotografía
                        y una descripción.
                    </p>
                </div>

                {(nutrition ||
                    imagePreview ||
                    inputText) && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white/90"
                    >
                        <X className="h-4 w-4" />
                        Limpiar
                    </button>
                )}
            </div>

            {/* Input */}
            <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="grid gap-5 md:grid-cols-[1fr_280px]">
                    {/* Text */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/80">
                            Describe la comida
                        </label>

                        <textarea
                            value={inputText}
                            onChange={(event) =>
                                setInputText(
                                    event.target.value
                                )
                            }
                            placeholder="Ejemplo: arroz blanco, pechuga de pollo, aguacate y plátano frito..."
                            className="min-h-[180px] w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.05]"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/80">
                            Fotografía
                        </label>

                        {imagePreview ? (
                            <div className="relative overflow-hidden rounded-xl border border-white/10">
                                <img
                                    src={imagePreview}
                                    alt="Comida"
                                    className="h-[180px] w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={
                                        handleRemoveImage
                                    }
                                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                className="flex h-[180px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/[0.02] text-white/40 transition hover:border-white/30 hover:bg-white/[0.04] hover:text-white/60"
                            >
                                <ImagePlus className="mb-2 h-8 w-8" />

                                <span className="text-sm font-medium">
                                    Añadir fotografía
                                </span>

                                <span className="mt-1 text-xs text-white/30">
                                    JPG, PNG o WEBP
                                </span>
                            </button>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                        <span>{error}</span>
                    </div>
                )}

                {/* Analyze */}
                <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Analizando...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4" />
                            Analizar comida
                        </>
                    )}
                </button>
            </section>

            {/* Results */}
            {nutrition && (
                <section>
                    <div className="mb-5 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-white/80" />

                        <h2 className="text-lg font-semibold text-white">
                            Resultado
                        </h2>
                    </div>

                    {/* Total */}
                    <TotalCard totals={nutrition.totals} />

                    {/* Foods */}
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {nutrition.foods.map(
                            (food, index) => (
                                <FoodCard
                                    key={`${food.name}-${index}`}
                                    food={food}
                                />
                            )
                        )}
                    </div>

                    {/* Overall confidence */}
                    <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <span className="text-sm text-white/50">
                            Confianza general
                        </span>

                        <ConfidenceBadge
                            confidence={
                                nutrition.overallConfidence
                            }
                        />
                    </div>
                </section>
            )}
        </main>
    );
}

function TotalCard({
                       totals,
                   }: {
    totals: NutritionResult["totals"];
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white/50">
                        Total de la comida
                    </p>

                    <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                        {Math.round(totals.calories)} kcal
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] border border-white/10">
                    <Flame className="h-5 w-5 text-white/80" />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <NutritionStat
                    icon={<Beef className="h-4 w-4" />}
                    label="Proteína"
                    value={`${Math.round(
                        totals.proteinGrams
                    )} g`}
                />

                <NutritionStat
                    icon={<Wheat className="h-4 w-4" />}
                    label="Carbohidratos"
                    value={`${Math.round(
                        totals.carbsGrams
                    )} g`}
                />

                <NutritionStat
                    icon={<Droplets className="h-4 w-4" />}
                    label="Grasas"
                    value={`${Math.round(
                        totals.fatGrams
                    )} g`}
                />
            </div>
        </div>
    );
}

function FoodCard({
                      food,
                  }: {
    food: NutritionFood;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-semibold text-white">
                        {food.name}
                    </h3>

                    <p className="mt-1 text-sm text-white/50">
                        {formatQuantity(
                            food.quantity,
                            food.unit
                        )}{" "}
                        · {Math.round(food.estimatedGrams)} g
                    </p>
                </div>

                <ConfidenceBadge
                    confidence={food.confidence}
                />
            </div>

            <div className="mb-4 rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">
                        Calorías
                    </span>

                    <span className="font-semibold text-white">
                        {Math.round(food.calories)} kcal
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <MacroItem
                    label="Proteína"
                    value={food.proteinGrams}
                />

                <MacroItem
                    label="Carbohidratos"
                    value={food.carbsGrams}
                />

                <MacroItem
                    label="Grasas"
                    value={food.fatGrams}
                />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs text-white/40">
                    Preparación
                </span>

                <span className="text-sm font-medium capitalize text-white/70">
                    {food.preparation}
                </span>
            </div>
        </div>
    );
}

function NutritionStat({
                           icon,
                           label,
                           value,
                       }: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="mb-1 flex items-center gap-1.5 text-white/50">
                {icon}

                <span className="text-xs">
                    {label}
                </span>
            </div>

            <p className="text-sm font-semibold text-white">
                {value}
            </p>
        </div>
    );
}

function MacroItem({
                       label,
                       value,
                   }: {
    label: string;
    value: number;
}) {
    return (
        <div>
            <p className="text-xs text-white/40">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-white/80">
                {Math.round(value)} g
            </p>
        </div>
    );
}

function ConfidenceBadge({
                             confidence,
                         }: {
    confidence: NutritionFood["confidence"];
}) {
    const labels = {
        low: "Baja",
        medium: "Media",
        high: "Alta",
    };

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

function formatQuantity(
    quantity: number,
    unit: string
) {
    const roundedQuantity =
        Number.isInteger(quantity)
            ? quantity
            : Number(quantity.toFixed(2));

    return `${roundedQuantity} ${unit}`;
}