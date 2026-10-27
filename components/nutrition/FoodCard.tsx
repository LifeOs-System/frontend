import { Beef, Wheat, Droplets } from "lucide-react";

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

interface FoodCardProps {
    food: NutritionFood;
}

export function FoodCard({ food }: FoodCardProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-semibold text-white">{food.name}</h3>
                    <p className="mt-1 text-sm text-white/50">
                        {formatQuantity(food.quantity, food.unit)} · {Math.round(food.estimatedGrams)} g
                    </p>
                </div>
                <ConfidenceBadge confidence={food.confidence} />
            </div>

            <div className="mb-4 rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Calorías</span>
                    <span className="font-semibold text-white">{Math.round(food.calories)} kcal</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <MacroItem label="Proteína" value={food.proteinGrams} />
                <MacroItem label="Carbohidratos" value={food.carbsGrams} />
                <MacroItem label="Grasas" value={food.fatGrams} />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs text-white/40">Preparación</span>
                <span className="text-sm font-medium capitalize text-white/70">{food.preparation}</span>
            </div>
        </div>
    );
}

function MacroItem({ label, value }: { label: string; value: number }) {
    return (
        <div>
            <p className="text-xs text-white/40">{label}</p>
            <p className="mt-1 text-sm font-semibold text-white/80">{Math.round(value)} g</p>
        </div>
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

function formatQuantity(quantity: number, unit: string) {
    const roundedQuantity = Number.isInteger(quantity) ? quantity : Number(quantity.toFixed(2));
    return `${roundedQuantity} ${unit}`;
}