"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import HabitCard from "./HabitCard";
import HabitDetailDialog from "./HabitDetailDialog";
import { notify } from "@/components/Toast";
import type { Habit } from "@/lib/habits/habitSchema";
import CreateHabitDialog from "@/components/CreateHabitDialog";
import {useHabits} from "@/lib/habits/useHabits";
import {HabitStatus} from "@/types/habits";

export default function HabitsView() {
    const { data: habits, isLoading, isError, error } = useHabits();
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const openDetail = (habit: Habit) => {
        setSelectedHabit(habit);
        setDetailOpen(true);
    };

    // ── TODO: conectar al backend cuando corresponda ──
    const handleEdit = (_habit: Habit) => {
        notify.info({
            title: "Edición de hábitos",
            description: "Esta funcionalidad llegará próximamente.",
        });
    };

    const handleChangeStatus = (_habit: Habit, _newStatus: HabitStatus) => {
        notify.info({
            title: "Cambio de estado",
            description: "Esta funcionalidad llegará próximamente.",
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                <p className="text-[13px] text-white/40">Cargando hábitos...</p>
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

    // Filtrar Deleted: no se muestran en la lista principal
    const visibleHabits = (habits ?? []).filter((h) => h.status !== "Deleted");

    if (visibleHabits.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white/30" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <h3 className="text-[16px] font-semibold text-white/80">No tienes hábitos aún</h3>
                    <p className="text-[13px] text-white/40 text-center max-w-[300px]">
                        Crea tu primer hábito para empezar a construir tu rutina.
                    </p>
                </div>
                <CreateHabitDialog />
            </div>
        );
    }

    const activeHabits = visibleHabits.filter((h) => h.status === "Active");
    const avgRate = Math.round(
        activeHabits.length
            ? activeHabits.reduce((acc, h) => acc + h.completionRate, 0) / activeHabits.length
            : 0
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-end justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-[20px] font-semibold text-white tracking-tight">
                        Mis Hábitos
                    </h2>
                    <p className="text-[13px] text-white/40">
                        {visibleHabits.length} {visibleHabits.length === 1 ? "hábito" : "hábitos"} ·{" "}
                        <span className="text-white/60 font-medium">{avgRate}%</span> cumplimiento promedio
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {visibleHabits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} onSelect={openDetail} />
                ))}
            </div>

            <HabitDetailDialog
                habit={selectedHabit}
                open={detailOpen}
                onOpenChange={setDetailOpen}
                onEdit={handleEdit}
                onChangeStatus={handleChangeStatus}
            />
        </div>
    );
}