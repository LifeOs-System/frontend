"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/utils/utils";
import TodayHabitCard from "./TodayHabitCard";
import AddRecordDialog from "./AddRecordDialog";
import {useCreateHabitRecord, useTodayHabits} from "@/lib/habits/useHabits";
import {TodayHabit} from "@/lib/habits/types";

function adaptHabitToday(habit: any): TodayHabit {
    return {
        id: habit.id,
        name: habit.name,
        type: habit.type,
        target: habit.target ?? null,

        value: habit.value ?? null,
        isCompleted: habit.isCompleted ?? false,

        unit: habit.unit ?? null,
        area: habit.area,

        frequency: habit.frequency ?? null,
        occurrences: habit.occurrences ?? null,
        completedOccurrences: habit.completedOccurrences ?? null,
    };
}

export default function TodayView() {
    const { data: habitsData, isLoading, isError, error } = useTodayHabits();
    const createRecord = useCreateHabitRecord();
    const habits: TodayHabit[] = (habitsData ?? []).map(adaptHabitToday);

    const [recordHabit, setRecordHabit] = useState<TodayHabit | null>(null);
    const [recordOpen, setRecordOpen] = useState(false);

    // ── Toggle (hábitos Binary) ────────────────────────────────────────────────
    const handleToggle = (habit: TodayHabit) => {
        createRecord.mutate({
            habitId: habit.id,
            isCompleted: !habit.isCompleted,
        });
    };

    // ── Abrir dialog de registro (Time/Quantity) ──────────────────────────────
    const handleOpenRecord = (habit: TodayHabit) => {
        setRecordHabit(habit);
        setRecordOpen(true);
    };

    // ── Confirmar registro (Time/Quantity) ────────────────────────────────────
    const handleRecord = (habit: TodayHabit, total: number) => {
        createRecord.mutate(
            { habitId: habit.id, value: total }, // ← ya es la suma (50)
            { onSuccess: () => setRecordOpen(false) }
        );
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                <p className="text-[13px] text-white/40">Cargando hábitos de hoy...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
                <p className="text-[14px] text-white/60">Error al cargar los hábitos</p>
                <p className="text-[12px] text-white/40">
                    {error instanceof Error ? error.message : "Inténtalo de nuevo más tarde."}
                </p>
            </div>
        );
    }

    if (habits.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white/30" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <h3 className="text-[16px] font-semibold text-white/80">No hay hábitos para hoy</h3>
                    <p className="text-[13px] text-white/40 text-center max-w-[300px]">
                        Parece que no programaste ningún hábito para este día. Disfruta tu descanso.
                    </p>
                </div>
            </div>
        );
    }

    const completedCount = habits.filter((h) => h.isCompleted).length;
    const totalCount = habits.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const allCompleted = totalCount > 0 && completedCount === totalCount;

    return (
        <div className="flex flex-col gap-8 max-w-[720px] mx-auto w-full">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] uppercase tracking-wider text-white/35 font-medium">
                            Progreso del día
                        </span>
                        <span className="text-[22px] font-semibold text-white tracking-tight">
                            {completedCount}{" "}
                            <span className="text-white/30 font-normal">de</span>{" "}
                            {totalCount}
                        </span>
                    </div>

                    {allCompleted && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/15">
                            <CheckCircle2 className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" strokeWidth={2} />
                            <span className="text-[12px] font-medium text-white/90">
                                ¡Día completado!
                            </span>
                        </div>
                    )}
                </div>

                <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-500",
                            allCompleted
                                ? "bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                                : progressPercent >= 50
                                    ? "bg-white/70"
                                    : "bg-white/40"
                        )}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-[13px] font-medium text-white/50 uppercase tracking-wider">
                        Hábitos de hoy
                    </h2>
                    <span className="text-[12px] text-white/30">
                        {progressPercent}% completado
                    </span>
                </div>

                {habits.map((habit) => (
                    <TodayHabitCard
                        key={habit.id}
                        habit={habit}
                        onToggle={handleToggle}
                        onAddRecord={handleOpenRecord}
                    />
                ))}
            </div>

            <AddRecordDialog
                habit={recordHabit}
                open={recordOpen}
                onOpenChange={setRecordOpen}
                onRecord={handleRecord}
            />
        </div>
    );
}