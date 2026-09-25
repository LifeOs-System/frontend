"use client";

import { useState } from "react";
import { BookOpen, Check, Circle, Plus, Loader2 } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/Button";
import { useBooks, useCreateBook } from "@/lib/books/useBook";
import { Book } from "@/lib/books/types";
import BookDetailDialog from "@/components/library/BookDetailDialog";
import CreateBookDialog from "@/components/library/CreateBookDialog";


// ─── Helper para estilos visuales de la estantería ───────────────────────────
const getBookVisuals = (index: number) => {
    const heights = [480, 500, 520, 540, 560, 460, 490];
    const widths = [84, 90, 96, 100, 104, 110];
    const tones = ["t1", "t2", "t3", "t4"] as const;

    return {
        height: heights[index % heights.length],
        width: widths[index % widths.length],
        tone: tones[index % tones.length]
    };
};

const PENDING_TONES: Record<string, string> = {
    t1: "bg-neutral-800 border-neutral-700 text-neutral-300",
    t2: "bg-neutral-900 border-neutral-800 text-neutral-400",
    t3: "bg-neutral-700 border-neutral-600 text-neutral-200",
    t4: "bg-[#111111] border-neutral-800 text-neutral-500",
};

const COMPLETED_TONE = "bg-white border-white text-black shadow-[0_0_28px_rgba(255,255,255,0.35)]";

// ─── Componente Principal ────────────────────────────────────────────────────
export function LibraryView() {
    const { data: books = [], isLoading } = useBooks();
    const createBookMutation = useCreateBook();

    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        setIsDetailOpen(true);
    };

    const completedCount = books.filter((b) => b.isRead).length;
    const progressPercent = books.length > 0 ? (completedCount / books.length) * 100 : 0;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                <p className="text-[13px] text-white/40">Cargando biblioteca...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-full max-w-full flex-col gap-8 overflow-x-hidden p-6 md:p-8">
            {/* ── Header ── */}
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    <BookOpen size={22} className="text-white/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Biblioteca</h1>
                <p className="mt-2 text-sm text-white/50 max-w-md mx-auto">
                    Tu estantería de aprendizaje. Toca un lomo para ver los detalles y el resumen.
                </p>

                <div className="mt-6 flex justify-center">
                    <Button
                        variant="default"
                        icon={<Plus className="w-4 h-4" />}
                        onClick={() => setIsCreateOpen(true)}
                    >
                        Agregar Libro
                    </Button>
                </div>

                {books.length > 0 && (
                    <div className="mx-auto mt-6 max-w-sm">
                        <div className="flex items-center justify-between text-[11px] text-white/50 mb-2">
                            <span className="uppercase tracking-widest">Progreso de lectura</span>
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
                )}
            </div>

            {/* ── Estantería ── */}
            <div className="w-full max-w-full px-6 md:px-10">
                <div className="shelf-scroll overflow-x-auto overflow-y-hidden">
                    <div className="w-max pt-6 pb-4">
                        <div className="flex items-end gap-3 pb-1">
                            {books.map((book, index) => {
                                const visuals = getBookVisuals(index);
                                return (
                                    <button
                                        key={book.id}
                                        onClick={() => handleBookClick(book)}
                                        title={`${book.title} por ${book.author}`}
                                        style={{ height: visuals.height, width: visuals.width }}
                                        className={cn(
                                            "relative flex shrink-0 flex-col items-center justify-between rounded-t-lg rounded-b-[4px] border py-6 transition-all duration-300 hover:-translate-y-5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.7)] cursor-pointer",
                                            book.isRead ? COMPLETED_TONE : PENDING_TONES[visuals.tone]
                                        )}
                                    >
                                        <span className="h-px w-10 bg-current opacity-30" />
                                        <span className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2">
                                            <span className="[writing-mode:vertical-rl] rotate-180 truncate text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.15em]">
                                                {book.title}
                                            </span>
                                        </span>
                                        <span className="flex flex-col items-center gap-2">
                                            {book.isRead ? (
                                                <Check size={18} strokeWidth={3} className="text-black" />
                                            ) : (
                                                <Circle size={13} className="text-white/30" />
                                            )}
                                        </span>
                                        <span className="h-px w-10 bg-current opacity-30" />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tabla de la estantería */}
                        <div className="h-3 rounded-full bg-white/[0.12] shadow-[0_8px_20px_rgba(0,0,0,0.6)]" />
                        <div className="mx-auto h-10 rounded-b-xl bg-gradient-to-b from-white/[0.05] to-transparent" />
                    </div>
                </div>
            </div>

            {/* ── Dialogs Importados ── */}
            <BookDetailDialog
                book={selectedBook}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
            />
            <CreateBookDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                mutation={createBookMutation}
            />
        </div>
    );
}