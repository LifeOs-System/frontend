"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/Button";
import { useCreateBook } from "@/lib/books/useBook";
import { CreateBookRequest } from "@/lib/books/types";

interface CreateBookDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mutation: ReturnType<typeof useCreateBook>;
}

export default function CreateBookDialog({ open, onOpenChange, mutation }: CreateBookDialogProps) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isRead, setIsRead] = useState(false);
    const [readDate, setReadDate] = useState("");
    const [rating, setRating] = useState("");
    const [summaryMarkdown, setSummaryMarkdown] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const dto: CreateBookRequest = {
            title,
            author,
            isRead,
            readDate: isRead && readDate ? readDate : null,
            rating: rating ? Number(rating) : null,
            summaryMarkdown: summaryMarkdown.trim() || null,
        };

        mutation.mutate(dto, {
            onSuccess: () => {
                setTitle("");
                setAuthor("");
                setIsRead(false);
                setReadDate("");
                setRating("");
                setSummaryMarkdown("");
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
                <Dialog.Content className={cn(
                    "fixed left-[50%] top-[50%] z-50 w-full max-w-[520px] -translate-x-1/2 -translate-y-1/2",
                    "rounded-3xl border border-white/[0.08] bg-[#0a0a0c]/95 backdrop-blur-xl p-8",
                    "shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] outline-none",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "max-h-[90vh] overflow-y-auto"
                )}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex flex-col gap-1.5">
                            <Dialog.Title className="text-[20px] font-semibold text-white tracking-tight">
                                Agregar Nuevo Libro
                            </Dialog.Title>
                            <Dialog.Description className="text-[13px] text-white/40">
                                Añade un libro a tu estantería de aprendizaje.
                            </Dialog.Description>
                        </div>
                        <Dialog.Close asChild>
                            <button className="rounded-lg p-1.5 text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors outline-none">
                                <X className="w-5 h-5" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Título *</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                                placeholder="Ej: Hábitos Atómicos"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Autor *</label>
                            <input
                                type="text"
                                required
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                                placeholder="Ej: James Clear"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Estado</label>
                                <button
                                    type="button"
                                    onClick={() => setIsRead(!isRead)}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2.5 text-[14px] font-medium transition-all",
                                        isRead
                                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                                            : "bg-white/[0.03] border-white/[0.08] text-white/60"
                                    )}
                                >
                                    {isRead ? "✓ Leído" : "Pendiente"}
                                </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Fecha de lectura</label>
                                <input
                                    type="date"
                                    disabled={!isRead}
                                    value={readDate}
                                    onChange={(e) => setReadDate(e.target.value)}
                                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white disabled:opacity-40 disabled:cursor-not-allowed focus:border-white/20 focus:outline-none [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Calificación (1-5)</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none"
                                placeholder="Opcional"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Resumen / Notas (Markdown)</label>
                            <textarea
                                value={summaryMarkdown}
                                onChange={(e) => setSummaryMarkdown(e.target.value)}
                                rows={6}
                                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                                placeholder="# Idea principal&#10;&#10;- Punto clave 1&#10;- Punto clave 2&#10;&#10;**Conclusión:** Excelente libro."
                            />
                            <p className="text-[10px] text-white/30">
                                * Soporta sintaxis Markdown: # Títulos, **negritas**, - listas, etc.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-white/[0.05]">
                            <Dialog.Close asChild>
                                <Button variant="outline" type="button">Cancelar</Button>
                            </Dialog.Close>
                            <Button
                                type="submit"
                                variant="default"
                                isLoading={mutation.isPending}
                            >
                                Guardar Libro
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}