"use client";

import { useRouter } from "next/navigation"; // ⭐ agregado
import { Plus, Loader2, Sparkles } from "lucide-react";
import HabitCard from "./HabitCard";
import CreateHabitDialog from "@/components/CreateHabitDialog";
import { useHabits } from "@/lib/habits/useHabits";

export default function HabitsView() {
    const router = useRouter(); // ⭐ agregado
    const { data: habits, isLoading, isError, error } = useHabits();

    // ⭐ ahora navega a la página de análisis
    const handleViewSummary = () => {
        router.push("/habits/ia-30-days-summary");
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

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start sm:items-end justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                    <h2 className="text-[20px] font-semibold text-white tracking-tight">
                        Mis Hábitos
                    </h2>
                    <p className="text-[13px] text-white/40">
                        {visibleHabits.length} {visibleHabits.length === 1 ? "hábito" : "hábitos"}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleViewSummary}
                    className="flex h-9 items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 text-[13px] font-medium text-white/90 shadow-[0_0_12px_rgba(255,255,255,0.08)] transition-all hover:bg-white/[0.08] hover:border-white/25 hover:shadow-[0_0_18px_rgba(255,255,255,0.15)]"
                >
                    <Sparkles
                        size={14}
                        className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]"
                    />
                    Ver resumen últimos 30 días
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {visibleHabits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} />
                ))}
            </div>
        </div>
    );
}