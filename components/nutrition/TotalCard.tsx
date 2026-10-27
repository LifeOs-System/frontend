import { Flame, Beef, Wheat, Droplets } from "lucide-react";

interface TotalCardProps {
    totals: {
        calories: number;
        proteinGrams: number;
        carbsGrams: number;
        fatGrams: number;
    };
}

export function TotalCard({ totals }: TotalCardProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white/50">Total de la comida</p>
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
                    value={`${Math.round(totals.proteinGrams)} g`}
                />
                <NutritionStat
                    icon={<Wheat className="h-4 w-4" />}
                    label="Carbohidratos"
                    value={`${Math.round(totals.carbsGrams)} g`}
                />
                <NutritionStat
                    icon={<Droplets className="h-4 w-4" />}
                    label="Grasas"
                    value={`${Math.round(totals.fatGrams)} g`}
                />
            </div>
        </div>
    );
}

function NutritionStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="mb-1 flex items-center gap-1.5 text-white/50">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <p className="text-sm font-semibold text-white">{value}</p>
        </div>
    );
}