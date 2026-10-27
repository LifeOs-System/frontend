import { Apple, X } from "lucide-react";

interface NutritionHeaderProps {
    hasData: boolean;
    onClear: () => void;
}

export function NutritionHeader({ hasData, onClear }: NutritionHeaderProps) {
    return (
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
                    Analiza una comida usando una fotografía y una descripción.
                </p>
            </div>

            {hasData && (
                <button
                    type="button"
                    onClick={onClear}
                    className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white/90"
                >
                    <X className="h-4 w-4" />
                    Limpiar
                </button>
            )}
        </div>
    );
}