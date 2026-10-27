"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { useLast30DaysHabits } from "@/lib/habits/useHabits";
import {useAI} from "@/hooks/use-ai";
import {
    buildHabitAnalysisUserMessage,
    HABIT_ANALYSIS_SYSTEM_PROMPT,
    HabitAnalysisInput,
    HabitAnalysisOutput, parseHabitAnalysisResponse
} from "@/app/(app)/habits/ia-30-days-summary/prompts";
import {Ia30DaysSummary} from "@/components/habits/ia-summary/Ia30DaysSummary";


export default function Ia30DaysSummaryPage() {
    const router = useRouter();
    const { data: input, isLoading: habitsLoading } = useLast30DaysHabits();
    const { execute, error: aiError, loading: aiLoading } = useAI();

    const [analysis, setAnalysis] = useState<HabitAnalysisOutput | null>(null);
    const [parseError, setParseError] = useState<string | null>(null);
    const hasRun = useRef(false);

    const runAnalysis = useCallback(
        async (payload: HabitAnalysisInput) => {
            setParseError(null);

            const prompt = `${HABIT_ANALYSIS_SYSTEM_PROMPT}\n\n# Datos del usuario (JSON)\n${buildHabitAnalysisUserMessage(payload)}`;

            const result = await execute(prompt);
            if (!result.success) return;

            try {
                setAnalysis(parseHabitAnalysisResponse(result.text));
            } catch (e) {
                setParseError(
                    e instanceof Error
                        ? e.message
                        : "La respuesta de la IA no es válida."
                );
            }
        },
        [execute]
    );

    // Dispara el análisis una sola vez cuando los datos están listos
    useEffect(() => {
        if (habitsLoading || !input || hasRun.current) return;
        hasRun.current = true;
        runAnalysis(input);
    }, [input, habitsLoading, runAnalysis]);

    const retry = () => {
        hasRun.current = false;
        if (input) runAnalysis(input);
    };

    const isLoading = habitsLoading || aiLoading;
    const errorMessage = aiError ?? parseError;

    // ── Carga ──
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                <p className="text-[13px] text-white/40">
                    Analizando tus últimos 30 días...
                </p>
            </div>
        );
    }

    // ── Error ──
    if (errorMessage || !analysis) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]">
                    <AlertTriangle className="w-6 h-6 text-white/50" />
                </div>
                <p className="text-[14px] text-white/70">
                    No se pudo generar el análisis
                </p>
                <p className="text-[12px] text-white/40 max-w-sm text-center">
                    {errorMessage ?? "Respuesta vacía de la IA."}
                </p>
                <button
                    onClick={retry}
                    className="mt-2 flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-[13px] text-white/80 transition-all hover:bg-white/[0.08]"
                >
                    <RefreshCw size={14} />
                    Reintentar
                </button>
            </div>
        );
    }

    // ── Éxito ──
    return (
        <Ia30DaysSummary
            analysis={analysis}
            onBack={() => router.push("/habits")}
        />
    );
}