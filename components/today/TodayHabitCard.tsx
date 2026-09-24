"use client";

import { Check, Plus, Target, TrendingUp } from "lucide-react";
import { cn } from "@/utils/utils";
import { AREA_LABELS } from "@/utils/labels";
import { Button } from "../Button";
import { TodayHabit } from "@/lib/habits/types";

interface TodayHabitCardProps {
    habit: TodayHabit;
    onToggle?: (habit: TodayHabit) => void;
    onAddRecord?: (habit: TodayHabit) => void;
}

export default function TodayHabitCard({
                                           habit,
                                           onToggle,
                                           onAddRecord,
                                       }: TodayHabitCardProps) {
    const isBinary = habit.type === "Binary";
    const isCompleted = habit.isCompleted ?? false;

    // ✅ CONDICIÓN MÁS ROBUSTA: Verifica que frequency exista Y que occurrences sea > 0
    const isFrequencyHabit = habit.frequency !== null && (habit.occurrences ?? 0) > 0;

    const progress = !isBinary && !isFrequencyHabit && habit.target && habit.value != null
        ? Math.min(100, (habit.value / habit.target) * 100)
        : 0;

    const freqProgress = isFrequencyHabit
        ? Math.min(100, ((habit.completedOccurrences ?? 0) / (habit.occurrences || 1)) * 100)
        : 0;

    const periodLabel = habit.frequency === "Monthly" ? "este mes" : "esta semana";

    return (
        <div
            className={cn(
                "group relative flex items-center gap-5 p-5 rounded-2xl",
                "border transition-all duration-300",
                isCompleted
                    ? "border-white/15 bg-white/[0.035]"
                    : "border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.025] hover:border-white/[0.1]"
            )}
        >
            {/* ── Zona izquierda: icono check ── */}
            <div className="shrink-0">
                <div
                    className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center cursor-pointer",
                        "transition-all duration-300",
                        isCompleted
                            ? "bg-white/15 border border-white/25 text-white shadow-[0_0_14px_rgba(255,255,255,0.2)]"
                            : "bg-white/[0.03] border border-white/[0.08] text-white/25 hover:bg-white/[0.06] hover:text-white/40"
                    )}
                    onClick={() => isBinary && onToggle?.(habit)}
                >
                    <Check
                        className={cn(
                            "w-6 h-6 transition-all duration-300",
                            isCompleted ? "opacity-100" : "opacity-60"
                        )}
                        strokeWidth={3}
                    />
                </div>
            </div>

            {/* ── Zona central: info del hábito ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                    <h3 className={cn(
                        "text-[17px] font-semibold tracking-tight truncate transition-all",
                        isCompleted ? "text-white/70" : "text-white/90"
                    )}>
                        {habit.name}
                    </h3>

                    <span className={cn(
                        "shrink-0 px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider border",
                        isCompleted
                            ? "bg-white/[0.02] border-white/[0.06] text-white/35"
                            : "bg-white/[0.03] border-white/[0.08] text-white/50"
                    )}>
                        {AREA_LABELS[habit.area]}
                    </span>
                </div>

                {/* ── Lógica condicional: Frecuencia vs Time/Quantity ── */}
                {isFrequencyHabit ? (
                    // ✅ VISTA PARA HÁBITOS DE FRECUENCIA (Semanal/Mensual)
                    <div className="flex flex-col gap-1.5 mt-1">
                        <div className="flex items-center gap-2 text-[12px] text-white/45">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>
                                Progreso {periodLabel}: <span className="text-white/75 font-medium">{habit.completedOccurrences ?? 0} de {habit.occurrences} veces</span>
                            </span>
                        </div>
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-700 ease-out",
                                    freqProgress >= 100
                                        ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                        : freqProgress >= 50
                                            ? "bg-white/70"
                                            : "bg-white/40"
                                )}
                                style={{ width: `${freqProgress}%` }}
                            />
                        </div>
                    </div>
                ) : !isBinary && habit.target !== null && habit.unit ? (
                    // ✅ VISTA PARA HÁBITOS DE TIEMPO / CANTIDAD
                    <div className="flex flex-col gap-1.5 mt-1">
                        <div className="flex items-center gap-2 text-[12px] text-white/45">
                            <Target className="w-3.5 h-3.5" />
                            <span>
                                Meta: <span className="text-white/75 font-medium">{habit.target} {habit.unit}</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-700 ease-out",
                                        progress >= 100
                                            ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                            : progress >= 50
                                                ? "bg-white/70"
                                                : "bg-white/40"
                                    )}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className={cn(
                                "text-[11px] font-medium tabular-nums shrink-0",
                                progress >= 100 ? "text-white/80" : "text-white/40"
                            )}>
                                {habit.value ?? 0} / {habit.target}
                            </span>
                        </div>
                    </div>
                ) : (
                    // ✅ VISTA PARA BINARIOS (Mensaje sutil)
                    isCompleted && (
                        <p className="text-[12px] text-white/45 italic mt-1">
                            Completado hoy ✓
                        </p>
                    )
                )}
            </div>

            {/* ── Zona derecha: botón de acción ── */}
            <div className="shrink-0 w-[120px]">
                {isBinary ? (
                    <Button
                        variant={isCompleted ? "default" : "outline"}
                        size="default"
                        className="w-full justify-center"
                        icon={isCompleted ? <Check className="w-4 h-4" /> : undefined}
                        onClick={() => onToggle?.(habit)}
                    >
                        {isCompleted ? "Hecho" : "Marcar"}
                    </Button>
                ) : (
                    <Button
                        variant={isCompleted ? "default" : "outline"}
                        size="default"
                        className="w-full justify-center"
                        icon={<Plus className="w-4 h-4" />}
                        onClick={() => onAddRecord?.(habit)}
                    >
                        {isCompleted ? "Agregar" : "Registrar"}
                    </Button>
                )}
            </div>
        </div>
    );
}