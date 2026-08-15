"use client";

import { Calendar, Target, TrendingUp } from "lucide-react";
import { cn } from "@/utils/utils";
import type { Habit } from "@/lib/habits/habitSchema";
import { AREA_LABELS, HABIT_TYPE_LABELS, DAYS, DAY_LABELS } from "@/utils/labels";
import { formatShortDate } from "@/utils/util-date-dashboard";

export function getProgressStyle(rate: number): string {
    if (rate >= 80) return "bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.35)]";
    if (rate >= 60) return "bg-white/70";
    if (rate >= 40) return "bg-white/50";
    return "bg-white/30";
}

interface HabitCardProps {
    habit: Habit;
    onSelect: (habit: Habit) => void;
}

export default function HabitCard({ habit, onSelect }: HabitCardProps) {
    const {
        name, area, type, target, unit, days,
        startDate, completionRate, completedDays, totalDays, status,
    } = habit;

    const isNotActive = status !== "Active";

    return (
        <button
            type="button"
            onClick={() => onSelect(habit)}
            className={cn(
                "group relative flex flex-col gap-4 p-6 rounded-2xl h-full w-full text-left",
                "bg-white/[0.02] border border-white/[0.06]",
                "hover:bg-white/[0.04] hover:border-white/[0.12]",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20",
                "transition-all duration-300 cursor-pointer",
                isNotActive && "opacity-55 hover:opacity-80"
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
                        "px-3 py-1.5 rounded-lg text-[11px] font-medium",
                        "bg-white/[0.04] border border-white/[0.08] text-white/60"
                    )}>
                        {HABIT_TYPE_LABELS[type].label}
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

            <div className="flex flex-col gap-2.5 pt-4 mt-auto border-t border-white/[0.04]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[12px] text-white/40">
                        <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>Cumplimiento</span>
                    </div>
                    <span className="text-[15px] font-semibold text-white/90">
                        {completionRate}%
                    </span>
                </div>

                <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                        className={cn("h-full rounded-full transition-all duration-500", getProgressStyle(completionRate))}
                        style={{ width: `${completionRate}%` }}
                    />
                </div>

                <div className="flex items-center justify-between text-[11px] text-white/30">
                    <span>{completedDays} de {totalDays} días</span>
                    <span>Desde {formatShortDate(startDate)}</span>
                </div>
            </div>
        </button>
    );
}