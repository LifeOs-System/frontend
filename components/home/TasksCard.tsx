"use client";

import { useState } from "react";
import { Trash2, Check, ClipboardList } from "lucide-react";
import { CreateTaskDialog } from "@/components/home/CreateTaskDialog";

interface Task {
    id: string;
    text: string;
    date: string; // ISO yyyy-mm-dd
    completed: boolean;
}

function getTodayISO(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const d = now.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function formatTaskDate(iso: string): string {
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

function isOverdue(task: Task): boolean {
    return !task.completed && task.date < getTodayISO();
}

const INITIAL_TASKS: Task[] = [
    { id: "t1", text: "Buscar queso", date: getTodayISO(), completed: false },
    { id: "t2", text: "Hablar con el equipo de UI", date: getTodayISO(), completed: false },
    { id: "t3", text: "Comprar pan", date: getTodayISO(), completed: true },
    { id: "t4", text: "Revisar diseños de la semana", date: getTodayISO(), completed: false },
];

export function TasksCard() {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

    const completedCount = tasks.filter((t) => t.completed).length;
    const progressPercent =
        tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    const addTask = ({ name, date }: { name: string; date: string }) => {
        setTasks((prev) => [
            ...prev,
            { id: `t${Date.now()}`, text: name, date, completed: false },
        ]);
    };

    const toggleTask = (id: string) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
    };

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    // Ordenar: pendientes primero, por fecha
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.date.localeCompare(b.date);
    });

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
                <div className="flex items-center gap-3">
                    <span className="text-[11px] text-white/50 tabular-nums">
                        {completedCount}/{tasks.length}
                    </span>
                    <CreateTaskDialog onCreate={addTask} />
                </div>
            </div>

            {/* Barra de progreso */}
            <div className="mb-5 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                <div
                    className="h-full rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Lista */}
            <div className="flex-1 space-y-2 overflow-y-auto">
                {sortedTasks.length === 0 ? (
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
                    sortedTasks.map((task) => (
                        <div
                            key={task.id}
                            className={`group flex items-center gap-3 rounded-xl border p-3 transition-all ${
                                task.completed
                                    ? "border-white/[0.08] bg-white/[0.03]"
                                    : "border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03]"
                            }`}
                        >
                            {/* Checkbox */}
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                                    task.completed
                                        ? "border-white bg-white"
                                        : "border-white/20 hover:border-white/50"
                                }`}
                                aria-label={
                                    task.completed
                                        ? "Marcar como pendiente"
                                        : "Marcar como completada"
                                }
                            >
                                {task.completed && (
                                    <Check size={12} className="text-black" strokeWidth={3} />
                                )}
                            </button>

                            {/* Texto + fecha */}
                            <div className="flex-1 min-w-0">
                                <p
                                    className={`truncate text-sm font-medium transition-all ${
                                        task.completed
                                            ? "text-white/40 line-through"
                                            : "text-white/90"
                                    }`}
                                >
                                    {task.text}
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

                            {/* Eliminar */}
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/30 opacity-0 transition-all hover:bg-white/[0.06] hover:text-white group-hover:opacity-100"
                                aria-label="Eliminar tarea"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}