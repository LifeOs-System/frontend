"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";
import {
    type Area,
    type DayOfWeek,
    type HabitType,
} from "@/types/habits";
import { AREA_LABELS, AREAS, DAY_LABELS, DAYS, HABIT_TYPE_LABELS, HABIT_TYPES } from "@/utils/labels";
import { useCreateHabit } from "@/lib/habits/useHabits";
import { type CreateHabitDto } from "@/lib/habits/habitSchema";

export default function CreateHabitDialog() {
    const [name, setName] = useState("");
    const [area, setArea] = useState<Area>("Health");
    const [type, setType] = useState<HabitType>("Binary");
    const [goal, setGoal] = useState("");
    const [unit, setUnit] = useState("");
    const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    ]);
    const [isOpen, setIsOpen] = useState(false);

    // Hook de React Query
    const createMutation = useCreateHabit();

    const toggleDay = (day: DayOfWeek) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const resetForm = () => {
        setName("");
        setArea("Health");
        setType("Binary");
        setGoal("");
        setUnit("");
        setSelectedDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // DTO alineado al wire del backend
        const dto: CreateHabitDto = {
            name,
            area,
            type,
            target: type !== "Binary" ? Number(goal) : null,
            unit: type !== "Binary" ? unit : null,
            days: selectedDays,
        };

        // Ejecutar mutación con callbacks
        createMutation.mutate(dto, {
            onSuccess: () => {
                // Limpiar formulario y cerrar dialog
                resetForm();
                setIsOpen(false);
            },
        });
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            {/* ─── TRIGGER BUTTON ─── */}
            <Dialog.Trigger asChild>
                <Button icon={<Plus strokeWidth={2} />}>
                    Agregar Hábito
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />

                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[520px] translate-x-[-50%] translate-y-[-50%] gap-6 border border-white/[0.08] bg-[#0a0a0c]/95 backdrop-blur-xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-3xl outline-none">

                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                    {/* Header */}
                    <div className="flex flex-col gap-1.5">
                        <Dialog.Title className="text-[20px] font-semibold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                            Nuevo Hábito
                        </Dialog.Title>
                        <Dialog.Description className="text-[13px] text-white/40">
                            Configura los detalles de tu nueva rutina.
                        </Dialog.Description>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Nombre */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Nombre</label>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Leer, Correr, Meditar..."
                                required
                            />
                        </div>

                        {/* ─── ÁREA (Píldoras) ─── */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Área</label>
                            <div className="flex flex-wrap gap-2">
                                {AREAS.map((a) => {
                                    const isSelected = area === a;
                                    return (
                                        <button
                                            key={a}
                                            type="button"
                                            onClick={() => setArea(a)}
                                            className={`px-4 py-2 rounded-lg text-[12px] font-medium transition-all duration-200 border
                                                ${isSelected
                                                ? "bg-white/[0.06] border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)_inset]"
                                                : "bg-white/[0.01] border-white/[0.05] text-white/40 hover:bg-white/[0.04] hover:text-white/70 hover:border-white/10"
                                            }`}
                                        >
                                            {AREA_LABELS[a]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ─── TIPO (Tarjetas) ─── */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Tipo</label>
                            <div className="grid grid-cols-3 gap-3">
                                {HABIT_TYPES.map((t) => {
                                    const isSelected = type === t;
                                    const labels = HABIT_TYPE_LABELS[t];
                                    return (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setType(t)}
                                            className={`flex flex-col items-center justify-center gap-1 py-4 rounded-xl border transition-all duration-200
                                                ${isSelected
                                                ? "bg-white/[0.04] border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.03)_inset]"
                                                : "bg-white/[0.01] border-white/[0.05] hover:bg-white/[0.03] hover:border-white/10"
                                            }`}
                                        >
                                            <span className={`text-[13px] font-semibold transition-colors ${isSelected ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" : "text-white/70"}`}>
                                                {labels.label}
                                            </span>
                                            <span className={`text-[11px] transition-colors ${isSelected ? "text-white/50" : "text-white/30"}`}>
                                                {labels.subtitle}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ─── Objetivo y Unidad ─── */}
                        {type !== "Binary" && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Objetivo</label>
                                    <Input
                                        type="number"
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        placeholder="Ej: 30"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Unidad</label>
                                    <Input
                                        type="text"
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        placeholder={type === "Time" ? "min, hrs" : "veces, págs"}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* ─── Días de la semana ─── */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Frecuencia Semanal</label>
                            <div className="flex justify-between gap-2">
                                {DAYS.map((day) => {
                                    const isSelected = selectedDays.includes(day);
                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(day)}
                                            className={`flex-1 flex items-center justify-center h-10 rounded-lg text-[13px] font-medium transition-all duration-200 border
                                                ${isSelected
                                                ? "bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)_inset]"
                                                : "bg-white/[0.01] border-white/[0.03] text-white/30 hover:bg-white/[0.04] hover:text-white/60"
                                            }`}
                                        >
                                            {DAY_LABELS[day]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ─── Footer Actions ─── */}
                        <div className="flex items-center justify-end gap-3 mt-2 pt-5 border-t border-white/[0.05]">
                            <Dialog.Close asChild>
                                <Button variant="outline">
                                    Cancelar
                                </Button>
                            </Dialog.Close>
                            <Button
                                type="submit"
                                variant="default"
                                isLoading={createMutation.isPending}
                            >
                                Crear Hábito
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}