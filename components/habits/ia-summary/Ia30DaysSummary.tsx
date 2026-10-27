"use client";

import type { HabitAnalysisOutput } from "@/app/(app)/habits/ia-30-days-summary/prompts";
import { SummaryHeader } from "./SummaryHeader";
import { CoverageStrip } from "./CoverageStrip";
import { HabitCarousel } from "./HabitCarousel";
import { PatternsSection } from "./PatternsSection";
import { RecommendationsSection } from "./RecommendationsSection";

interface Ia30DaysSummaryProps {
    analysis: HabitAnalysisOutput;
    onBack: () => void;
}

export function Ia30DaysSummary({ analysis, onBack }: Ia30DaysSummaryProps) {
    const { period, coverage, habits, patterns, recommendations } = analysis;

    return (
        <div className="flex flex-col gap-10 p-6 md:p-10 max-w-[1400px] mx-auto w-full">
            <SummaryHeader totalDays={period.totalDays} onBack={onBack} />
            <CoverageStrip period={period} coverage={coverage} />
            <HabitCarousel habits={habits} />
            <PatternsSection patterns={patterns} />
            <RecommendationsSection recommendations={recommendations} />

            <p className="text-center text-[11px] text-white/30">
                Generado a partir de tus registros de los últimos {period.totalDays} días
            </p>
        </div>
    );
}