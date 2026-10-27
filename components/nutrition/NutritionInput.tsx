import { useState, useRef } from "react";
import { AlertCircle, ImagePlus, X, Sparkles, Loader2 } from "lucide-react";

interface NutritionInputProps {
    inputText: string;
    imagePreview: string | null;
    loading: boolean;
    error: string | null;
    onTextChange: (text: string) => void;
    onImageChange: (file: File) => void;
    onRemoveImage: () => void;
    onAnalyze: () => void;
}

export function NutritionInput({
                                   inputText,
                                   imagePreview,
                                   loading,
                                   error,
                                   onTextChange,
                                   onImageChange,
                                   onRemoveImage,
                                   onAnalyze,
                               }: NutritionInputProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            onImageChange(file);
        }
    };

    return (
        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="grid gap-5 md:grid-cols-[1fr_280px]">
                {/* Text */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">
                        Describe la comida
                    </label>

                    <textarea
                        value={inputText}
                        onChange={(e) => onTextChange(e.target.value)}
                        placeholder="Ejemplo: arroz blanco, pechuga de pollo, aguacate y plátano frito..."
                        className="min-h-[180px] w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.05]"
                    />
                </div>

                {/* Image */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">
                        Fotografía
                    </label>

                    {imagePreview ? (
                        <div className="relative overflow-hidden rounded-xl border border-white/10">
                            <img
                                src={imagePreview}
                                alt="Comida"
                                className="h-[180px] w-full object-cover"
                            />

                            <button
                                type="button"
                                onClick={onRemoveImage}
                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex h-[180px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/[0.02] text-white/40 transition hover:border-white/30 hover:bg-white/[0.04] hover:text-white/60"
                        >
                            <ImagePlus className="mb-2 h-8 w-8" />
                            <span className="text-sm font-medium">Añadir fotografía</span>
                            <span className="mt-1 text-xs text-white/30">JPG, PNG o WEBP</span>
                        </button>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Analyze */}
            <button
                type="button"
                onClick={onAnalyze}
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analizando...
                    </>
                ) : (
                    <>
                        <Sparkles className="h-4 w-4" />
                        Analizar comida
                    </>
                )}
            </button>
        </section>
    );
}