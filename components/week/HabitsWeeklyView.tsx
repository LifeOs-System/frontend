"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertCircle, X } from "lucide-react";
import { useLastWeek } from "@/hooks/useLastWeek";
import { useAiEvaluation } from "@/hooks/useAiEvaluation";
import { HabitRow } from "./HabitRow";
import { WeekSummaryCard } from "./WeekSummaryCard";
import { formatWeekRange, getWeekNumber } from "@/utils/formatWeekRange";

const DAY_LABELS: Record<string, string> = {
    Sunday: "D",
    Monday: "L",
    Tuesday: "M",
    Wednesday: "M",
    Thursday: "J",
    Friday: "V",
    Saturday: "S",
};

export function HabitsWeeklyView() {
    const { data, isLoading, isError, error, refetch } = useLastWeek();
    const aiEvaluation = useAiEvaluation();
    const [showEvaluation, setShowEvaluation] = useState(false);

    const handleAiEvaluation = () => {
        if (!data) return;
        setShowEvaluation(true);
        aiEvaluation.mutate(data);
    };

    // ── Estados ──
    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 p-6 text-center">
                <AlertCircle className="h-6 w-6 text-red-400" />
                <p className="text-sm text-neutral-400">
                    No se pudo cargar el resumen semanal.
                </p>
                <button
                    onClick={() => refetch()}
                    className="rounded-full border border-neutral-700 bg-neutral-900 px-4 py-1.5 text-xs text-white hover:bg-neutral-800"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const weekNumber = getWeekNumber(data.endDate);

    return (
        <div className="flex flex-col gap-8 p-6 md:p-10">
            {/* ── Header ── */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <span className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-[11px] font-medium tracking-wide text-neutral-400">
                        SEMANA {weekNumber} / 52
                    </span>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
                        Mis Hábitos
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        {formatWeekRange(data)}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleAiEvaluation}
                        disabled={aiEvaluation.isPending}
                        className="mr-2 flex h-9 items-center gap-2 rounded-full border border-neutral-500 bg-neutral-900 px-4 text-sm font-semibold text-white shadow-[0_0_12px_rgba(255,255,255,0.15)] transition-all hover:bg-neutral-800 hover:shadow-[0_0_18px_rgba(255,255,255,0.3)] disabled:opacity-60"
                    >
                        {aiEvaluation.isPending ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <Sparkles
                                size={15}
                                className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]"
                            />
                        )}
                        {aiEvaluation.isPending ? "Evaluando..." : "Evalúame"}
                    </button>
                </div>
            </div>

            {/* ── Summary cards ── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <WeekSummaryCard
                    label="Hábito estrella"
                    value={data.starHabit?.habitName ?? "—"}
                    hint={
                        data.starHabit
                            ? `${data.starHabit.completedDays} de ${data.starHabit.totalDays} días`
                            : "Sin datos"
                    }
                />
                <WeekSummaryCard
                    label="Hábito en riesgo"
                    value={data.atRiskHabit?.habitName ?? "—"}
                    hint={
                        data.atRiskHabit
                            ? `${data.atRiskHabit.completedDays} de ${data.atRiskHabit.totalDays} días`
                            : "Sin datos"
                    }
                />
                <WeekSummaryCard
                    label="Punto débil"
                    value={data.weakestDay?.dayName ?? "—"}
                    hint={
                        data.weakestDay
                            ? `${data.weakestDay.completionPercentage}% cumplido`
                            : "Sin datos"
                    }
                />
                <WeekSummaryCard
                    label="Vs. semana pasada"
                    value={formatWeekComparison(
                        data.weekComparison.percentageDifference
                    )}
                    hint={`${data.weekComparison.previousWeekPercentage}% → ${data.weekComparison.currentWeekPercentage}%`}
                />
            </div>

            {/* ── Tabla semanal ── */}
            <div className="overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/40">
                {/* Encabezado de días */}
                <div className="grid grid-cols-[220px_repeat(7,1fr)] items-center gap-2 border-b border-neutral-800/80 px-5 py-4">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
                        Hábito
                    </div>
                    {data.days.map((day) => (
                        <div
                            key={day.date}
                            className="flex flex-col items-center gap-1"
                        >
                            <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                                {day.dayLetter}
                            </span>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-neutral-400">
                                {day.dayNumber}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Filas de hábitos */}
                <div className="divide-y divide-neutral-800/60">
                    {data.habits.map((habit) => (
                        <HabitRow
                            key={habit.habitId}
                            habit={habit}
                            days={data.days}
                        />
                    ))}
                </div>
            </div>

            {/* ── Modal de evaluación IA ── */}
            {showEvaluation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-white" />
                                <h2 className="text-sm font-bold text-white">
                                    Evaluación de tu semana
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowEvaluation(false)}
                                className="rounded-full p-1 text-neutral-500 hover:bg-neutral-800 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="mt-4 max-h-[60vh] overflow-y-auto">
                            {aiEvaluation.isPending && (
                                <div className="flex items-center gap-2 py-8 text-sm text-neutral-400">
                                    <Loader2 size={16} className="animate-spin" />
                                    Analizando tus hábitos...
                                </div>
                            )}

                            {aiEvaluation.isError && (
                                <div className="flex flex-col items-center gap-3 py-8 text-center">
                                    <AlertCircle size={18} className="text-red-400" />
                                    <p className="text-sm text-neutral-400">
                                        {aiEvaluation.error?.message ??
                                            "No se pudo generar la evaluación."}
                                    </p>
                                    <button
                                        onClick={() => data && aiEvaluation.mutate(data)}
                                        className="rounded-full border border-neutral-700 px-4 py-1.5 text-xs text-white hover:bg-neutral-800"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            )}

                            {aiEvaluation.isSuccess && (
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
                                    {aiEvaluation.data}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function formatWeekComparison(diff: number): string {
    if (diff === 0) return "0%";
    const sign = diff > 0 ? "+" : "";
    return `${sign}${diff}%`;
}