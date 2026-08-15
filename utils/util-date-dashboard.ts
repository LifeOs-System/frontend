// utils/util-date-dashboard.ts

export interface DashboardDateInfo {
    formattedDate: string;
    dayOfYear: number;
    totalDays: number;
    yearProgress: number;
}

/**
 * Calcula toda la información de fecha necesaria para el Dashboard
 */
export function getDashboardDateInfo(date: Date = new Date()): DashboardDateInfo {
    // Calcular día del año
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Determinar si es año bisiesto
    const isLeapYear =
        (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) ||
        date.getFullYear() % 400 === 0;
    const totalDays = isLeapYear ? 366 : 365;

    // Calcular progreso del año
    const yearProgress = (dayOfYear / totalDays) * 100;

    // Formatear fecha en español
    const dateStr = date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    return {
        formattedDate,
        dayOfYear,
        totalDays,
        yearProgress,
    };
}

const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function formatShortDate(iso: string): string {
    const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
    return `${day} ${MONTHS_ES[month - 1]} ${year}`;
}