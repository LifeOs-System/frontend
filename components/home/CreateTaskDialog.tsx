"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { notify } from "@/components/Toast";

interface CreateTaskDialogProps {
    onCreate: (task: { name: string; date: string }) => void;
}

function getTodayISO(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const d = now.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function CreateTaskDialog({ onCreate }: CreateTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [date, setDate] = useState(getTodayISO());
    const [error, setError] = useState<string | null>(null);

    // Cerrar con Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            setError("Escribe un nombre para la tarea.");
            return;
        }
        if (!date) {
            setError("Selecciona una fecha.");
            return;
        }

        onCreate({ name: name.trim(), date });
        notify.success({
            title: "Tarea creada",
            description: `"${name.trim()}" agregada a tu lista.`,
        });

        setName("");
        setDate(getTodayISO());
        setError(null);
        setOpen(false);
    };

    return (
        <>
            {/* Botón trigger */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-[13px] font-medium text-white/80 transition-all hover:bg-white/[0.06] hover:text-white"
            >
                <Plus size={15} />
                Agregar Tarea
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Panel */}
                    <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-6 shadow-[0_0_40px_rgba(255,255,255,0.06)]">
                        {/* Header */}
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-white tracking-tight">
                                    Nueva tarea
                                </h2>
                                <p className="mt-1 text-[12px] text-white/40">
                                    Agrega un recordatorio con su fecha límite.
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-all hover:bg-white/[0.06] hover:text-white"
                                aria-label="Cerrar"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Campos */}
                        <div className="space-y-4">
                            {/* Nombre */}
                            <div>
                                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setError(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSubmit();
                                    }}
                                    placeholder="Ej: Hablar con el equipo de UI"
                                    autoFocus
                                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-white/20 focus:bg-white/[0.04]"
                                />
                            </div>

                            {/* Fecha */}
                            <div>
                                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        setError(null);
                                    }}
                                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-white/20 focus:bg-white/[0.04] [color-scheme:dark]"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <p className="text-[12px] text-white/60 border border-white/[0.08] bg-white/[0.03] rounded-lg px-3 py-2">
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Acciones */}
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                onClick={handleClose}
                                className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-[13px] font-medium text-white/60 transition-all hover:bg-white/[0.06] hover:text-white"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="rounded-xl bg-white px-4 py-2 text-[13px] font-semibold text-black transition-all hover:bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                            >
                                Crear tarea
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}