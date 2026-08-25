import { useMutation } from "@tanstack/react-query";
import {LastWeekResponse} from "@/lib/habits/habitSchema";


async function evaluateWeek(data: LastWeekResponse): Promise<string> {
    const res = await fetch("/api/ai/evaluate-week", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("No se pudo generar la evaluación");
    }

    const json = await res.json();
    return json.evaluation as string;
}

export function useAiEvaluation() {
    return useMutation({
        mutationFn: evaluateWeek,
    });
}