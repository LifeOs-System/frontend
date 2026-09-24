// components/AddRecordDialog.tsx
"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Target, X } from "lucide-react";
import { cn } from "@/utils/utils";
import { AREA_LABELS } from "@/utils/labels";
import { Button } from "../Button";
import {TodayHabit} from "@/lib/habits/types";


interface AddRecordDialogProps {
    habit: TodayHabit | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRecord: (habit: TodayHabit, total: number) => void;
}

export default function AddRecordDialog({
                                            habit, open, onOpenChange, onRecord,
                                        }: AddRecordDialogProps) {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Reset al abrir
    useEffect(() => {
        if (open) {
            setValue("");
            setError(null);
        }
    }, [open, habit]);

    if (!habit) return null;

    // ─── Cálculos ─────────────────────────────────────────────────────────────
    const current = habit.value ?? 0;          // lo que ya tenía hoy
    const add = value === "" ? 0 : Number(value);   // lo que va a agregar
    const isValidAdd = value !== "" && !isNaN(add) && add > 0;
    const total = current + add;                    // lo que se envía al backend
    const percent = habit.target != null && habit.target > 0
        ? Math.min(100, Math.round((total / habit.target) * 100))
        : 0;
    const targetReached = habit.target != null && total >= habit.target;

    const addAmount = (amount: number) => {
        const currentInput = value === "" || isNaN(Number(value)) ? 0 : Number(value);
        setValue(String(Math.max(0, currentInput + amount)));
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (value === "" || isNaN(add)) {
            setError("Ingresa un número");
            return;
        }
        if (add <= 0) {
            setError("Debe ser mayor a 0");
            return;
        }

        // Enviamos el TOTAL (lo que tenía + lo nuevo)
        onRecord(habit, total);
        onOpenChange(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />

                <Dialog.Content className={cn(
                    "fixed left-[50%] top-[50%] z-50 w-full max-w-[400px]",
                    "-translate-x-1/2 -translate-y-1/2",
                    "rounded-3xl border border-white/[0.08] bg-[#0a0a0c]/95 backdrop-blur-xl p-8",
                    "shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] outline-none",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                )}>
                    {/* Glow superior */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                    {/* ── Header ─ */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1.5 min-w-0">
                            <Dialog.Title className="text-[20px] font-semibold text-white tracking-tight truncate">
                                Registrar actividad
                            </Dialog.Title>
                            <Dialog.Description className="text-[13px] text-white/40">
                                {habit.name} · {AREA_LABELS[habit.area]}
                            </Dialog.Description>
                        </div>
                        <Dialog.Close asChild>
                            <button className="rounded-lg p-1.5 text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white/20">
                                <X className="w-4 h-4" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">

                        {/* ── Lo que ya tenía hoy ── */}
                        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                            <span className="text-[12px] text-white/50">Hoy llevas</span>
                            <span className="text-[14px] font-semibold text-white/85">
                                {current} {habit.unit}
                            </span>
                        </div>

                        {/* ── Input: cuánto más ── */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">
                                ¿Cuánto más hiciste?
                            </label>

                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    autoFocus
                                    value={value}
                                    onChange={(e) => {
                                        setValue(e.target.value);
                                        setError(null);
                                    }}
                                    placeholder="0"
                                    className={cn(
                                        "w-full bg-white/[0.02] border rounded-xl px-4 py-3 pr-16",
                                        "text-[18px] font-semibold text-white placeholder:text-white/15",
                                        "outline-none transition-all",
                                        error
                                            ? "border-white/30"
                                            : "border-white/[0.06] focus:border-white/20 focus:bg-white/[0.04]"
                                    )}
                                />
                                {habit.unit && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-white/40 font-medium pointer-events-none">
                                        {habit.unit}
                                    </span>
                                )}
                            </div>

                            {error && (
                                <p className="text-[11px] text-white/60">{error}</p>
                            )}
                        </div>

                        {/* ── Atajos de suma rápida ── */}
                        <div className="flex gap-2">
                            {[5, 10, 15].map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    onClick={() => addAmount(amount)}
                                    className={cn(
                                        "flex-1 py-2 rounded-lg text-[12px] font-medium border transition-all duration-200",
                                        "bg-white/[0.01] border-white/[0.05] text-white/40",
                                        "hover:bg-white/[0.05] hover:text-white/80 hover:border-white/15"
                                    )}
                                >
                                    +{amount}
                                </button>
                            ))}
                        </div>

                        {/* ── Vista previa del cálculo ── */}
                        {isValidAdd && habit.target != null && (
                            <div className="flex flex-col gap-2.5 px-4 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] animate-in fade-in slide-in-from-top-1 duration-200">
                                {/* Cálculo: 10 + 40 = 50 */}
                                <div className="flex items-center justify-between text-[13px]">
                                    <span className="text-white/50">
                                        {current} <span className="text-white/30">+</span>{" "}
                                        <span className="text-white/80 font-medium">{add}</span>
                                    </span>
                                    <span className="text-white/90 font-semibold">
                                        = {total} {habit.unit}
                                    </span>
                                </div>

                                {/* Barra + % del objetivo */}
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all duration-300",
                                                percent >= 100
                                                    ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                                    : "bg-white/60"
                                            )}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                    <span className="text-[12px] font-medium text-white/70 tabular-nums shrink-0">
                                        {percent}% de {habit.target}
                                    </span>
                                </div>

                                {/* Objetivo cumplido */}
                                {targetReached && (
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" strokeWidth={2.5} />
                                        <span className="text-[12px] font-medium text-white/90">
                                            ¡Objetivo cumplido!
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Footer ─ */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.05]">
                            <Dialog.Close asChild>
                                <Button variant="outline">Cancelar</Button>
                            </Dialog.Close>
                            <Button type="submit" variant="default" disabled={!isValidAdd}>
                                Registrar
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}