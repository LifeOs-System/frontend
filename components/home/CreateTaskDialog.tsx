"use client";

import { useState, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { useCreateTodo } from "@/lib/todos-task/useTodos";
import { CreateToDoTaskDto } from "@/lib/todos-task/todosSchemas";

export function CreateTaskDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    // ✅ 1. Inicializamos como string vacío, no con la fecha de hoy
    const [date, setDate] = useState<string>("");

    const createTodo = useCreateTodo();

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
        setName("");
        setDate(""); // ✅ 2. Reseteamos a vacío, no a la fecha de hoy
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return; // Validación básica de UI

        const payload: CreateToDoTaskDto = {
            name: name.trim(),
            // ✅ 3. Si el string está vacío, enviamos null al backend
            date: date === "" ? null : date,
        };

        createTodo.mutate(payload, {
            onSuccess: () => {
                handleClose();
            },
        });
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
                        <form onSubmit={handleSubmit}>
                            {/* Header */}
                            <div className="mb-6 flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-white tracking-tight">
                                        Nueva tarea
                                    </h2>
                                    <p className="mt-1 text-[12px] text-white/40">
                                        Agrega un recordatorio (la fecha es opcional).
                                    </p>
                                </div>
                                <button
                                    type="button"
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
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ej: Hablar con el equipo de UI"
                                        autoFocus
                                        disabled={createTodo.isPending}
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-white/20 focus:bg-white/[0.04] disabled:opacity-50"
                                    />
                                </div>

                                {/* Fecha */}
                                <div>
                                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
                                        Fecha (Opcional)
                                    </label>
                                    <input
                                        type="date"
                                        // ✅ 4. Vinculamos el valor al estado (si es vacío, el input se muestra en blanco)
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        disabled={createTodo.isPending}
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-white/20 focus:bg-white/[0.04] [color-scheme:dark] disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="mt-6 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={createTodo.isPending}
                                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-[13px] font-medium text-white/60 transition-all hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={createTodo.isPending || !name.trim()}
                                    className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[13px] font-semibold text-black transition-all hover:bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {createTodo.isPending ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Creando...
                                        </>
                                    ) : (
                                        "Crear tarea"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}