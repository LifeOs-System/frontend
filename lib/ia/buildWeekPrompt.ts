// lib/ai/buildWeekPrompt.ts


import {HabitDaySummary, HabitWeekSummary, LastWeekResponse} from "@/lib/habits/habitSchema";

function describeDay(day: HabitDaySummary, type: string): string {
    if (!day.hasRecord) return "—";
    if (type === "Binary") return day.isCompleted ? "✓" : "✗";
    return String(day.value ?? 0);
}

function describeHabit(habit: HabitWeekSummary): string {
    const days = habit.days.map((d) => describeDay(d, habit.type)).join(" ");

    const extra =
        habit.type === "Binary"
            ? `${habit.completedDays}/${habit.totalDays} días`
            : `${habit.weekTotalValue}/${habit.weekTotalTarget} ${habit.unit ?? ""}`;

    return `- ${habit.name} (${habit.type}): ${extra} · ${habit.weekCompletionPercentage}% | semana: [${days}]`;
}

export function buildWeekPrompt(data: LastWeekResponse): string {
    const habitsDetail = data.habits.map(describeHabit).join("\n");

    return `Analiza el resumen semanal de hábitos del usuario y escribe una evaluación de máximo 200 palabras con este formato exacto:

**Resumen general**: una frase sobre el cumplimiento global.
**Lo mejor**: destaca el hábito estrella y por qué.
**A mejorar**: menciona el hábito en riesgo y el día más débil.
**Tendencia**: interpreta la comparación con la semana pasada.
**Consejo**: una recomendación práctica y específica para la próxima semana.

Datos de la semana (${data.startDate} a ${data.endDate}):
- Cumplimiento global: ${data.overallCompletionPercentage}%
- Total de hábitos: ${data.totalHabits}
- Hábito estrella: ${data.starHabit?.habitName ?? "ninguno"} (${data.starHabit?.completedDays ?? 0}/${data.starHabit?.totalDays ?? 0} días)
- Hábito en riesgo: ${data.atRiskHabit?.habitName ?? "ninguno"} (${data.atRiskHabit?.completedDays ?? 0}/${data.atRiskHabit?.totalDays ?? 0} días)
- Día más débil: ${data.weakestDay?.dayName ?? "ninguno"} (${data.weakestDay?.completionPercentage ?? 0}% cumplido)
- Vs semana pasada: ${data.weekComparison.previousWeekPercentage}% → ${data.weekComparison.currentWeekPercentage}% (${data.weekComparison.percentageDifference >= 0 ? "+" : ""}${data.weekComparison.percentageDifference}%)

Detalle por hábito (S D L M M J V):
${habitsDetail}

Los "—" son días sin registro o no programados. Sé breve, cercano y concreto.`;
}