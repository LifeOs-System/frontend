"use client";

import type { ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import {ProfilePhoto} from "@/app/(app)/profile/setup/types";


type Props = {
    photos: ProfilePhoto[];
    onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onRemovePhoto: (id: string) => void;
};

export default function ProgressPhotosStep({
                                               photos,
                                               onPhotoChange,
                                               onRemovePhoto,
                                           }: Props) {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-medium">
                    Fotos de progreso
                </h2>

                <p className="mt-1 text-sm leading-6 text-white/40">
                    Añade fotos para documentar tu evolución física.
                    Este paso también es opcional.
                </p>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center transition hover:border-white/30 hover:bg-white/[0.04]">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <ImagePlus className="size-5 text-white/70" />
                </div>

                <span className="text-sm font-medium text-white">
                    Seleccionar imágenes
                </span>

                <span className="mt-2 text-xs text-white/40">
                    PNG, JPG o WEBP · Máximo 10 MB por imagen
                </span>

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={onPhotoChange}
                />
            </label>

            {photos.length > 0 && (
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm text-white/70">
                            Imágenes seleccionadas
                        </p>

                        <span className="text-xs text-white/40">
                            {photos.length}/10
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                            >
                                <img
                                    src={photo.preview}
                                    alt="Vista previa de la foto de progreso"
                                    className="aspect-[4/3] w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() => onRemovePhoto(photo.id)}
                                    aria-label="Eliminar imagen"
                                    className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-lg border border-white/10 bg-black/70 text-white transition hover:bg-black"
                                >
                                    <X className="size-4" />
                                </button>

                                <p className="truncate px-3 py-2 text-xs text-white/50">
                                    {photo.file.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-sm text-white/70">
                    Tu perfil está casi listo.
                </p>

                <p className="mt-1 text-xs leading-5 text-white/40">
                    Al continuar, enviaremos tu información, las medidas
                    corporales que hayas completado y las imágenes seleccionadas.
                </p>
            </div>
        </div>
    );
}