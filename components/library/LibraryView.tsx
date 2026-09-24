"use client";

import { useState } from "react";
import { BookOpen, Check, Circle } from "lucide-react";

interface ShelfBook {
    id: string;
    title: string;
    spine?: string; // texto corto para el lomo (opcional)
    completed: boolean;
    height: number;
    width: number;
    tone: "t1" | "t2" | "t3" | "t4";
}

const INITIAL_BOOKS: ShelfBook[] = [
    // ── Completados ──
    { id: "b1",  title: "Padre Rico Padre Pobre",                          completed: true,  height: 500, width: 104, tone: "t1" },
    { id: "b2",  title: "Los Secretos de la Mente Millonaria",             completed: true, height: 550, width: 96, tone: "t2" },
    { id: "b3",  title: "Hábitos Atómicos",                                completed: true,  height: 520, width: 100, tone: "t3" },
    { id: "b4",  title: "Piense y Hágase Rico",                            completed: true,  height: 480, width: 92,  tone: "t4" },
    { id: "b5",  title: "La Psicología del Dinero",                        completed: true, height: 505, width: 104, tone: "t2" },
    { id: "b6",  title: "The Lean Startup",                                completed: true, height: 440, width: 84,  tone: "t3" },
    { id: "b7",  title: "The Obstacle Is the Way",                         completed: false, height: 470, width: 92,  tone: "t1" },
    { id: "b8",  title: "Thinking, Fast and Slow",                         completed: false, height: 495, width: 100, tone: "t4" },
    { id: "b9",  title: "Ganar amigos e influir sobre las personas",       completed: false, height: 620, width: 110, tone: "t2" },
    { id: "b10", title: "Man's Search for Meaning",                        completed: false, height: 540, width: 108, tone: "t3" },
    { id: "b11", title: "Good Strategy Bad Strategy",                      completed: false, height: 500, width: 100, tone: "t1" },
    { id: "b12", title: "Influence",                                       completed: false, height: 430, width: 82,  tone: "t4" },
    { id: "b13", title: "Mindset",                                         completed: false, height: 445, width: 84,  tone: "t2" },
    { id: "b14", title: "High Output Management",                          completed: false, height: 490, width: 96,  tone: "t3" },
    { id: "b15", title: "Principles",                                      completed: false, height: 460, width: 90,  tone: "t1" },
    { id: "b16", title: "Can't Hurt Me",                                   completed: false, height: 475, width: 94,  tone: "t4" },
    { id: "b17", title: "The Effective Executive",                         completed: false, height: 485, width: 96,  tone: "t2" },
    { id: "b18", title: "The Laws of Human Nature",                        completed: false, height: 530, width: 106, tone: "t3" },
];

const PENDING_TONES: Record<ShelfBook["tone"], string> = {
    t1: "bg-neutral-800 border-neutral-700 text-neutral-300",
    t2: "bg-neutral-900 border-neutral-800 text-neutral-400",
    t3: "bg-neutral-700 border-neutral-600 text-neutral-200",
    t4: "bg-[#111111] border-neutral-800 text-neutral-500",
};

const COMPLETED_TONE =
    "bg-white border-white text-black shadow-[0_0_28px_rgba(255,255,255,0.35)]";

export function LibraryView() {
    const [books, setBooks] = useState<ShelfBook[]>(INITIAL_BOOKS);

    const completedCount = books.filter((b) => b.completed).length;
    const progressPercent = (completedCount / books.length) * 100;

    const toggleBook = (id: string) => {
        setBooks((prev) =>
            prev.map((b) => (b.id === id ? { ...b, completed: !b.completed } : b))
        );
    };

    return (
        // ⭐ overflow-x-hidden en la raíz: la página NUNCA scrollea horizontal
        <div className="flex min-h-full max-w-full flex-col gap-8 overflow-x-hidden p-6 md:p-8">
            {/* ── Header ── */}
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    <BookOpen size={22} className="text-white/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Biblioteca
                </h1>
                <p className="mt-2 text-sm text-white/50 max-w-md mx-auto">
                    Tu estantería de aprendizaje. Desliza horizontalmente para
                    recorrerla y toca un lomo para marcarlo como completado.
                </p>

                <div className="mx-auto mt-6 max-w-sm">
                    <div className="flex items-center justify-between text-[11px] text-white/50 mb-2">
                        <span className="uppercase tracking-widest">Progreso</span>
                        <span className="tabular-nums text-white/80 font-semibold">
                            {completedCount} / {books.length}
                        </span>
                    </div>
                    <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                            className="h-full rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Estantería: el ÚNICO scroller horizontal ── */}
            {/* ── Estantería: scroller contenido dentro de la sección ── */}
            <div className="w-full max-w-full px-6 md:px-10">
                <div className="shelf-scroll overflow-x-auto overflow-y-hidden">
                    <div className="w-max pt-6 pb-4">
                        {/* Libros */}
                        <div className="flex items-end gap-3 pb-1">
                            {books.map((book, index) => (
                                <button
                                    key={book.id}
                                    onClick={() => toggleBook(book.id)}
                                    title={`${book.title} · ${book.completed ? "Completado" : "Pendiente"}`}
                                    style={{ height: book.height, width: book.width }}
                                    className={`relative flex shrink-0 flex-col items-center justify-between rounded-t-lg rounded-b-[4px] border py-6 transition-all duration-300 hover:-translate-y-5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.7)] ${
                                        book.completed ? COMPLETED_TONE : PENDING_TONES[book.tone]
                                    }`}
                                >
                                    <span className="h-px w-10 bg-current opacity-30" />

                                    <span className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                            <span className="[writing-mode:vertical-rl] rotate-180 truncate text-[15px] font-semibold uppercase tracking-[0.25em]">
                                {book.title}
                            </span>
                        </span>

                                    <span className="flex flex-col items-center gap-2">
                            {book.completed ? (
                                <Check size={18} strokeWidth={3} className="text-black" />
                            ) : (
                                <Circle size={13} className="text-white/30" />
                            )}
                                        <span className="text-xs font-medium tabular-nums opacity-60">
                                {index + 1}
                            </span>
                        </span>

                                    <span className="h-px w-10 bg-current opacity-30" />
                                </button>
                            ))}
                        </div>

                        {/* Tabla de la estantería */}
                        <div className="h-3 rounded-full bg-white/[0.12] shadow-[0_8px_20px_rgba(0,0,0,0.6)]" />
                        <div className="mx-auto h-10 rounded-b-xl bg-gradient-to-b from-white/[0.05] to-transparent" />
                    </div>
                </div>
            </div>
        </div>
    );
}