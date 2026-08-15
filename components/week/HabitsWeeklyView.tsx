"use client";

import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "../Button";
import {
    HABITS_MOCK,
    WEEKLY_RECORDS_MOCK,
    WEEK_DAYS,
    type DailyRecord,
} from "@/mocks/habits";
import { HabitRow } from "./HabitRow";
import { WeekSummaryCard } from "./WeekSummaryCard";

export function HabitsWeeklyView() {
    const getRecordsByHabit = (habitId: string): DailyRecord[] =>
        WEEKLY_RECORDS_MOCK.filter((r) => r.habitId === habitId);

    // ⚠️ TODO (futuro): conectar con la evaluación de IA
    const handleAiEvaluation = () => {
        console.log("[IA] Evaluación semanal — funcionalidad futura");
    };

    return (
        <div className="flex flex-col gap-8 p-6 md:p-10">
            {/* ── Header ── */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <span className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-[11px] font-medium tracking-wide text-neutral-400">
                        SEMANA 33 / 52
                    </span>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
                        Mis Hábitos
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        9 hábitos · 76% cumplimiento · 8 – 14 ago
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* ⭐ Botón IA (placeholder futuro) */}
                    <button
                        type="button"
                        onClick={handleAiEvaluation}
                        className="mr-2 flex h-9 items-center gap-2 rounded-full border border-neutral-500 bg-neutral-900 px-4 text-sm font-semibold text-white shadow-[0_0_12px_rgba(255,255,255,0.15)] transition-all hover:bg-neutral-800 hover:shadow-[0_0_18px_rgba(255,255,255,0.3)]"
                    >
                        <Sparkles
                            size={15}
                            className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]"
                        />
                        Evalúame
                    </button>
                </div>
            </div>

            {/* ── Summary cards ── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <WeekSummaryCard
                    label="Hábito estrella"
                    value="Magnesio"
                    hint="7 de 7 días"
                />
                <WeekSummaryCard
                    label="Hábito en riesgo"
                    value="Gimnasio"
                    hint="3 de 7 días"
                />
                <WeekSummaryCard
                    label="Punto débil"
                    value="Miércoles"
                    hint="50% cumplido"
                />
                <WeekSummaryCard
                    label="Vs. semana pasada"
                    value="+8%"
                    hint="68% → 76%"
                />
            </div>

            {/* ── Tabla semanal ── */}
            <div className="overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/40">
                <div className="grid grid-cols-[220px_repeat(7,1fr)] items-center gap-2 border-b border-neutral-800/80 px-5 py-4">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
                        Hábito
                    </div>
                    {WEEK_DAYS.map((day) => (
                        <div
                            key={day.date}
                            className="flex flex-col items-center gap-1"
                        >
                            <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                                {day.label}
                            </span>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-neutral-400">
                                {day.dayNum}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="divide-y divide-neutral-800/60">
                    {HABITS_MOCK.map((habit) => (
                        <HabitRow
                            key={habit.id}
                            habit={habit}
                            records={getRecordsByHabit(habit.id)}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
}