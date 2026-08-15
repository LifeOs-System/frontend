// lib/utils.ts
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")  // ← normaliza múltiples espacios/saltos de línea a un solo espacio
        .trim();
}