"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Circle, X, Star, Calendar, Pencil, Save } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/Button";
import { Book } from "@/lib/books/types";
import { useUpdateBook } from "@/lib/books/useBook";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatShortDate } from "@/utils/util-date-dashboard";

interface BookDetailDialogProps {
    book: Book | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function BookDetailDialog({ book, open, onOpenChange }: BookDetailDialogProps) {
    const updateBookMutation = useUpdateBook();

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");

    // ✅ NUEVO: Estado local que refleja el contenido actual (se actualiza al guardar)
    const [currentSummary, setCurrentSummary] = useState<string | null>(null);

    // Sincronizar cuando cambia el libro o se abre el dialog
    useEffect(() => {
        if (book) {
            setEditContent(book.summaryMarkdown || "");
            setCurrentSummary(book.summaryMarkdown); // ✅ Sincronizar estado local
            setIsEditing(false);
        }
    }, [book, open]);

    if (!book) return null;

    const handleSave = () => {
        const newContent = editContent.trim() || null;

        updateBookMutation.mutate(
            {
                id: book.id,
                data: { summaryMarkdown: newContent }
            },
            {
                onSuccess: () => {
                    // ✅ Actualizar el estado local para que el ReactMarkdown renderice el nuevo contenido
                    setCurrentSummary(newContent);
                    setIsEditing(false);
                },
            }
        );
    };

    const handleCancel = () => {
        setEditContent(currentSummary || "");
        setIsEditing(false);
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
                        <div className="flex flex-col gap-1.5 min-w-0">
                            <Dialog.Title className="text-[22px] font-semibold text-white tracking-tight truncate">
                                {book.title}
                            </Dialog.Title>
                            <Dialog.Description className="text-[14px] text-white/50">
                                por {book.author}
                            </Dialog.Description>
                        </div>
                        <Dialog.Close asChild>
                            <button className="rounded-lg p-1.5 text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white/20">
                                <X className="w-5 h-5" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border",
                            book.isRead
                                ? "bg-green-500/10 border-green-500/20 text-green-400"
                                : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                        )}>
                            {book.isRead ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                            {book.isRead ? "Leído" : "Pendiente"}
                        </div>

                        {book.rating != null && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border bg-white/[0.03] border-white/[0.08] text-white/70">
                                <Star className="w-3.5 h-3.5 fill-yellow-500/80 text-yellow-500/80" />
                                {book.rating} / 5
                            </div>
                        )}

                        {book.readDate && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border bg-white/[0.03] border-white/[0.08] text-white/50">
                                <Calendar className="w-3.5 h-3.5" />
                                Leído el {formatShortDate(book.readDate)}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/[0.06] pt-5">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[12px] uppercase tracking-wider text-white/40 font-medium">
                                Resumen / Notas
                            </h4>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                    Editar
                                </button>
                            )}
                        </div>

                        {/* ✅ Modo visualización: Ahora usa currentSummary en lugar de book.summaryMarkdown */}
                        {!isEditing && (
                            <>
                                {currentSummary ? (
                                    <div className="text-[14px] text-white/80 leading-relaxed space-y-3">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ node, ...props }) => <h1 className="text-[18px] font-bold text-white mt-4 mb-2" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-[16px] font-bold text-white mt-3 mb-2" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="text-[15px] font-semibold text-white mt-3 mb-1.5" {...props} />,
                                                p: ({ node, ...props }) => <p className="text-white/70 leading-relaxed" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 text-white/70" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 text-white/70" {...props} />,
                                                li: ({ node, ...props }) => <li className="text-white/70" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                                                em: ({ node, ...props }) => <em className="italic text-white/80" {...props} />,
                                                code: ({ node, ...props }) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-[13px] font-mono text-white/90" {...props} />,
                                                blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-white/20 pl-4 italic text-white/60" {...props} />,
                                            }}
                                        >
                                            {currentSummary}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="text-[13px] text-white/30 italic">No hay resumen disponible para este libro.</p>
                                )}
                            </>
                        )}

                        {/* Modo edición */}
                        {isEditing && (
                            <div className="flex flex-col gap-3">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    rows={8}
                                    autoFocus
                                    className="w-full rounded-lg border border-white/[0.12] bg-white/[0.03] px-3 py-2.5 text-[14px] text-white placeholder:text-white/20 focus:border-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none font-mono text-sm leading-relaxed"
                                    placeholder="# Idea principal&#10;&#10;- Punto clave 1&#10;- Punto clave 2&#10;&#10;**Conclusión:** Excelente libro."
                                />
                                <p className="text-[10px] text-white/30">
                                    Soporta Markdown: # Títulos, **negritas**, - listas, etc.
                                </p>
                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancel}
                                        disabled={updateBookMutation.isPending}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        icon={<Save className="w-3.5 h-3.5" />}
                                        onClick={handleSave}
                                        isLoading={updateBookMutation.isPending}
                                    >
                                        Guardar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}