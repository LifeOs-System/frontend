"use client";

import { Calendar, Target, Repeat } from "lucide-react";
import { cn } from "@/utils/utils";
import { AREA_LABELS, HABIT_TYPE_LABELS, DAYS, DAY_LABELS } from "@/utils/labels";
import type { Habit } from "@/lib/habits/types";

// Helper para formatear la frecuencia
function formatFrequency(frequency: string | null, occurrences: number | null): string {
    if (!frequency || occurrences == null) return "Sin programación";

    const freqLabel = frequency === "Weekly" ? "semana" : "mes";
    return `${occurrences} ${occurrences === 1 ? "vez" : "veces"} x ${freqLabel}`;
}

interface HabitCardProps {
    habit: Habit;
}

// Se mantiene exportada por si otros componentes (como el antiguo Dialog) la necesitan
export function getProgressStyle(rate: number): string {
    if (rate >= 80) return "bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.35)]";
    if (rate >= 60) return "bg-white/70";
    if (rate >= 40) return "bg-white/50";
    return "bg-white/30";
}

export default function HabitCard({ habit }: HabitCardProps) {
    const {
        name, area, type, target, unit, days,
        status, frequency, occurrences,
    } = habit;

    const isNotActive = status !== "Active";
    const hasSpecificDays = days && days.length > 0;

    return (
        <div
            className={cn(
                "group relative flex flex-col gap-4 p-6 rounded-2xl h-full w-full text-left",
                "bg-white/[0.02] border border-white/[0.06]",
                "transition-all duration-300",
                isNotActive && "opacity-55"
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-[17px] font-semibold text-white/90 tracking-tight truncate">
                        {name}
                    </h3>
                    <span className="text-[12px] font-medium text-white/40 uppercase tracking-wider">
                        {AREA_LABELS[area]}
                    </span>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className={cn(
                        "px-3 py-1.5 rounded-lg text-[11px] font-medium text-right",
                        "bg-white/[0.04] border border-white/[0.08] text-white/60"
                    )}>
                        <div>{HABIT_TYPE_LABELS[type].label}</div>
                    </div>
                    {status === "Paused" && (
                        <div className="px-2.5 py-0.5 rounded-lg text-[10px] font-medium uppercase tracking-wider bg-white/[0.02] border border-white/[0.06] text-white/35">
                            Pausado
                        </div>
                    )}
                </div>
            </div>

            {type !== "Binary" && target !== null && unit && (
                <div className="flex items-center gap-2 text-[13px] text-white/50">
                    <Target className="w-4 h-4" strokeWidth={2} />
                    <span>
                        <span className="text-white/80 font-medium">{target}</span> {unit}
                    </span>
                </div>
            )}

            {hasSpecificDays ? (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/30 shrink-0" strokeWidth={2} />
                    <div className="flex gap-1">
                        {DAYS.map((day) => {
                            const isActiveDay = days.includes(day);
                            return (
                                <div
                                    key={day}
                                    className={cn(
                                        "w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-medium border transition-colors",
                                        isActiveDay
                                            ? "bg-white/10 text-white/80 border-white/20"
                                            : "bg-white/[0.02] text-white/20 border-white/[0.04]"
                                    )}
                                >
                                    {DAY_LABELS[day]}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-[13px] text-white/50">
                    <Repeat className="w-4 h-4 text-white/30 shrink-0" strokeWidth={2} />
                    <span className="text-white/80 font-medium">
                        {formatFrequency(frequency, occurrences)}
                    </span>
                </div>
            )}
        </div>
    );
}