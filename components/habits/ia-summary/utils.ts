import type { OutputHabitType } from "@/app/(app)/habits/ia-30-days-summary/prompts";

export const TYPE_LABEL: Record<OutputHabitType, string> = {
    binary: "Binario",
    quantity: "Cantidad",
    time: "Tiempo",
};

export function fmtDate(iso: string): string {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
    });
}