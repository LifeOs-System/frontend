import { Sparkles } from "lucide-react";
import type { AnalysisRecommendation } from "@/app/(app)/habits/ia-30-days-summary/prompts";

interface RecommendationsSectionProps {
    recommendations: AnalysisRecommendation[];
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
    if (recommendations.length === 0) return null;

    return (
        <section className="rounded-3xl border border-white/[0.05] bg-white/[0.01] p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles size={14} className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]" />
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Recomendaciones</p>
            </div>
            <ol className="space-y-5">
                {recommendations.map((r, i) => (
                    <li key={i} className="flex gap-4">
                        <span className="shrink-0 text-lg font-bold text-white/30 tabular-nums">{i + 1}.</span>
                        <div className="flex flex-col gap-1.5">
                            <p className="text-[12px] text-white/50">
                                <span className="uppercase tracking-widest text-[9px] text-white/40">Evidencia · </span>
                                {r.evidence}
                            </p>
                            <p className="text-[13px] text-white/85 font-medium leading-relaxed">{r.action}</p>
                            <p className="text-[12px] text-white/50">
                                <span className="uppercase tracking-widest text-[9px] text-white/40">Por qué · </span>
                                {r.why}
                            </p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}