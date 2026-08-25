"use client";

import { Check, ClipboardList, Loader2 } from "lucide-react";
import { CreateTaskDialog } from "@/components/home/CreateTaskDialog";
import { useDeleteTodo, useTodos } from "@/lib/todos-task/useTodos";

function getTodayISO(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const d = now.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function formatTaskDate(iso: string | null): string {
    if (!iso) return "Sin fecha";

    const today = new Date();
    const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const date = new Date(`${iso}T00:00:00`);
    const diff = Math.round(
        (date.getTime() - startOfToday.getTime()) / 86400000
    );

    if (diff === 0) return "Hoy";
    if (diff === 1) return "Mañana";
    if (diff === -1) return "Ayer";
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function isOverdue(task: { date: string | null }): boolean {
    if (!task.date) return false;
    return task.date < getTodayISO();
}

export function TasksCard() {
    const { data: tasks = [], isLoading, isError } = useTodos();
    const deleteTodo = useDeleteTodo();
    const todayISO = getTodayISO();

    if (isLoading) {
        return (
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.05] bg-white/[0.01] p-8 backdrop-blur-sm">
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white/40" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.05] bg-white/[0.01] p-8 backdrop-blur-sm">
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                    <p className="text-sm text-white/50">Error al cargar las tareas</p>
                    <p className="text-[11px] text-white/30">Intenta recargar la página</p>
                </div>
            </div>
        );
    }

    // 1. Separar tareas en "Actuales" (vencidas, hoy o sin fecha) y "Futuras"
    const currentTasks = tasks.filter((t) => !t.date || t.date <= todayISO);
    const futureTasks = tasks.filter((t) => t.date && t.date > todayISO);

    // 2. Ordenar tareas actuales: con fecha primero (de más antigua a hoy), luego las sin fecha
    const sortedCurrentTasks = [...currentTasks].sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;  // a (sin fecha) va después
        if (!b.date) return -1; // b (sin fecha) va después
        return a.date.localeCompare(b.date);
    });

    // 3. Ordenar tareas futuras: de la más cercana a la más lejana
    const sortedFutureTasks = [...futureTasks].sort((a, b) => {
        return a.date!.localeCompare(b.date!);
    });

    const hasNoTasks = sortedCurrentTasks.length === 0 && sortedFutureTasks.length === 0;

    return (
        <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.05] bg-white/[0.01] p-8 backdrop-blur-sm">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
                        Tareas
                    </p>
                </div>
                <CreateTaskDialog />
            </div>

            {/* Lista con scroll */}
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {hasNoTasks ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                            <ClipboardList size={20} className="text-white/40" />
                        </div>
                        <p className="text-sm text-white/50">Sin tareas</p>
                        <p className="text-[11px] text-white/30">
                            Usa "Agregar Tarea" para crear un recordatorio
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Sección: Tareas Actuales (Vencidas, Hoy, Sin fecha) */}
                        {sortedCurrentTasks.map((task) => (
                            <div
                                key={task.id}
                                className="group flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.01] p-3 transition-all hover:bg-white/[0.03]"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium text-white/90">
                                        {task.name}
                                    </p>
                                    <p
                                        className={`mt-0.5 text-[10px] uppercase tracking-wider ${
                                            isOverdue(task)
                                                ? "text-white font-semibold"
                                                : "text-white/40"
                                        }`}
                                    >
                                        {formatTaskDate(task.date)}
                                        {isOverdue(task) && " · vencida"}
                                    </p>
                                </div>

                                {/* Botón Check que llama a Eliminar */}
                                <button
                                    onClick={() => deleteTodo.mutate(task.id)}
                                    disabled={deleteTodo.isPending}
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/30 opacity-0 transition-all hover:bg-white/[0.06] hover:text-white group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Eliminar tarea"
                                >
                                    <Check size={16} strokeWidth={2.5} />
                                </button>
                            </div>
                        ))}

                        {/* Sección: Tareas Futuras (Separador visual) */}
                        {sortedFutureTasks.length > 0 && (
                            <>
                                <div className="my-4 flex items-center gap-3">
                                    <div className="h-px flex-1 bg-white/[0.08]" />
                                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                                        Próximos días
                                    </p>
                                    <div className="h-px flex-1 bg-white/[0.08]" />
                                </div>

                                {sortedFutureTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="group flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.01] p-3 transition-all hover:bg-white/[0.03]"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-medium text-white/90">
                                                {task.name}
                                            </p>
                                            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/40">
                                                {formatTaskDate(task.date)}
                                            </p>
                                        </div>

                                        {/* Botón Check que llama a Eliminar */}
                                        <button
                                            onClick={() => deleteTodo.mutate(task.id)}
                                            disabled={deleteTodo.isPending}
                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/30 opacity-0 transition-all hover:bg-white/[0.06] hover:text-white group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Eliminar tarea"
                                        >
                                            <Check size={16} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}