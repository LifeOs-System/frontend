// components/TodayHabitCard.tsx
"use client";

import { Check, Plus, Target, Edit3 } from "lucide-react";
import { cn } from "@/utils/utils";
import { AREA_LABELS } from "@/utils/labels";
import type { TodayHabit } from "@/lib/habits/habitSchema";
import { Button } from "../Button";

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
    const isCompleted = habit.completedToday;

    // Progreso hacia el objetivo (solo Time/Quantity)
    const progress = !isBinary && habit.target && habit.todayValue != null
        ? Math.min(100, (habit.todayValue / habit.target) * 100)
        : 0;

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
            {/* ── Zona izquierda: icono check (unificado) ── */}
            <div className="shrink-0">
                <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center",
                    "transition-all duration-300",
                    isCompleted
                        ? "bg-white/15 border border-white/25 text-white shadow-[0_0_14px_rgba(255,255,255,0.2)]"
                        : "bg-white/[0.03] border border-white/[0.08] text-white/25"
                )}>
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
                {/* Línea 1: nombre + área */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <h3 className={cn(
                        "text-[17px] font-semibold tracking-tight truncate transition-all",
                        isCompleted ? "text-white/70" : "text-white/90"
                    )}>
                        {habit.name}
                    </h3>

                    {/* Pill de área */}
                    <span className={cn(
                        "shrink-0 px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider border",
                        isCompleted
                            ? "bg-white/[0.02] border-white/[0.06] text-white/35"
                            : "bg-white/[0.03] border-white/[0.08] text-white/50"
                    )}>
                        {AREA_LABELS[habit.area]}
                    </span>
                </div>

                {/* Línea 2: objetivo (solo Time/Quantity) */}
                {!isBinary && habit.target !== null && habit.unit && (
                    <div className="flex items-center gap-2 text-[12px] text-white/45">
                        <Target className="w-3.5 h-3.5" />
                        <span>
                            Meta: <span className="text-white/75 font-medium">{habit.target} {habit.unit}</span>
                        </span>
                    </div>
                )}

                {/* ── Barra de progreso (solo no-binarios) ── */}
                {!isBinary && habit.target != null && (
                    <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
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
                            {habit.todayValue ?? 0}/{habit.target}
                        </span>
                    </div>
                )}

                {/* ── Binario completado: mensaje sutil ── */}
                {isBinary && isCompleted && (
                    <p className="text-[12px] text-white/45 italic">
                        Completado hoy ✓
                    </p>
                )}
            </div>

            {/* ── Zona derecha: botón de acción (ancho fijo) ── */}
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