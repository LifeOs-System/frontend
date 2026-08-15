"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BarChart3, PauseCircle, Pencil, PlayCircle, Trash2, TrendingUp, X } from "lucide-react";
import { cn } from "@/utils/utils";
import type { Habit } from "@/lib/habits/habitSchema";
import { AREA_LABELS, DAYS, DAY_LABELS, HABIT_TYPE_LABELS, HABIT_STATUS_LABELS } from "@/utils/labels";
import { formatShortDate } from "@/utils/util-date-dashboard";
import { getProgressStyle } from "./HabitCard";
import { Button } from "../Button";
import {HabitStatus} from "@/types/habits";

interface HabitDetailDialogProps {
    habit: Habit | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (habit: Habit) => void;
    onChangeStatus: (habit: Habit, newStatus: HabitStatus) => void;
}

export default function HabitDetailDialog({
                                              habit, open, onOpenChange, onEdit, onChangeStatus,
                                          }: HabitDetailDialogProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (!open) setConfirmDelete(false);
    }, [open]);

    if (!habit) return null;

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />

                <Dialog.Content className={cn(
                    "fixed left-[50%] top-[50%] z-50 w-full max-w-[460px]",
                    "-translate-x-1/2 -translate-y-1/2",
                    "rounded-3xl border border-white/[0.08] bg-[#0a0a0c]/95 backdrop-blur-xl p-8",
                    "shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] outline-none",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                )}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1.5 min-w-0">
                            <Dialog.Title className="text-[20px] font-semibold text-white tracking-tight truncate">
                                {habit.name}
                            </Dialog.Title>
                            <Dialog.Description className="text-[13px] text-white/40">
                                {AREA_LABELS[habit.area]} · {HABIT_TYPE_LABELS[habit.type].label}
                            </Dialog.Description>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <span className={cn(
                                "px-2.5 py-1 rounded-lg text-[10px] font-medium border uppercase tracking-wider",
                                habit.status === "Active"
                                    ? "bg-white/[0.06] border-white/15 text-white/80"
                                    : "bg-white/[0.02] border-white/[0.06] text-white/30"
                            )}>
                                {HABIT_STATUS_LABELS[habit.status]}
                            </span>
                            <Dialog.Close asChild>
                                <button className="rounded-lg p-1.5 text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white/20">
                                    <X className="w-4 h-4" />
                                </button>
                            </Dialog.Close>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[12px] text-white/40">
                                <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
                                <span>Cumplimiento</span>
                            </div>
                            <span className="text-[18px] font-semibold text-white/90">
                                {habit.completionRate}%
                            </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                            <div
                                className={cn("h-full rounded-full", getProgressStyle(habit.completionRate))}
                                style={{ width: `${habit.completionRate}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[11px] text-white/30">
                            <span>{habit.completedDays} de {habit.totalDays} días</span>
                            <span>Desde {formatShortDate(habit.startDate)}</span>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-wider text-white/30">Objetivo</span>
                            <span className="text-[13px] font-medium text-white/80">
                                {habit.type !== "Binary" && habit.target != null
                                    ? `${habit.target} ${habit.unit}`
                                    : "—"}
                            </span>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-wider text-white/30">Días</span>
                            <div className="flex gap-1">
                                {DAYS.map((d) => (
                                    <span
                                        key={d}
                                        className={cn(
                                            "w-5 h-5 rounded flex items-center justify-center text-[10px] font-medium border",
                                            habit.days.includes(d)
                                                ? "bg-white/10 text-white/80 border-white/20"
                                                : "bg-white/[0.02] text-white/20 border-white/[0.04]"
                                        )}
                                    >
                                        {DAY_LABELS[d]}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] py-6">
                        <BarChart3 className="w-5 h-5 text-white/25" strokeWidth={1.8} />
                        <p className="text-[12px] text-white/40">Más estadísticas</p>
                        <span className="text-[10px] uppercase tracking-wider text-white/25">Aún en desarrollo</span>
                    </div>

                    {confirmDelete ? (
                        <div className="mt-6 flex flex-col gap-3 pt-5 border-t border-white/[0.05]">
                            <p className="text-[13px] text-white/60">
                                ¿Eliminar <span className="text-white font-medium">"{habit.name}"</span> definitivamente?
                            </p>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => onChangeStatus(habit, "Deleted")}>
                                    Sí, eliminar
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(false)}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 flex items-center gap-3 pt-5 border-t border-white/[0.05]">
                            <Button variant="outline" className="flex-1" icon={<Pencil className="w-4 h-4" />} onClick={() => onEdit(habit)}>
                                Editar
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                icon={habit.status === "Active" ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                                onClick={() => onChangeStatus(habit, habit.status === "Active" ? "Paused" : "Active")}
                            >
                                {habit.status === "Active" ? "Pausar" : "Reanudar"}
                            </Button>
                            <Button variant="outline" className="flex-1" icon={<Trash2 className="w-4 h-4" />} onClick={() => setConfirmDelete(true)}>
                                Eliminar
                            </Button>
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}