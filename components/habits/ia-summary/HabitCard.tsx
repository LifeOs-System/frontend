import { Target } from "lucide-react";
import type { HabitAnalysis } from "@/app/(app)/habits/ia-30-days-summary/prompts";
import { TYPE_LABEL } from "./utils";

interface HabitCardProps {
    habit: HabitAnalysis;
}

export function HabitCard({ habit }: HabitCardProps) {
    return (
        <div className="w-full shrink-0 snap-start snap-always rounded-3xl border border-white/[0.05] bg-white/[0.01] p-8 md:p-10 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-xl font-semibold text-white">{habit.name}</p>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[9px] uppercase tracking-wider text-white/50">
                    {TYPE_LABEL[habit.type]}
                </span>
            </div>

            {/* Resumen destacado */}
            <div className="mb-8 rounded-2xl border-l-2 border-white/30 bg-white/[0.02] px-5 py-4">
                <p className="text-[14px] leading-relaxed text-white/85 italic">
                    {habit.summary}
                </p>
            </div>

            {/* Objetivo en línea */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/[0.05]">
                <Target size={14} className="text-white/50 shrink-0" />
                <div className="flex items-baseline gap-2">
                    <span className="text-[15px] font-semibold text-white/90">
                        {habit.indicators.goal}
                    </span>
                    <span className="text-[12px] text-white/40">
                        · {habit.indicators.scheduled} días programados
                    </span>
                </div>
            </div>

            {/* Análisis en párrafo fluido */}
            <div className="space-y-3">
                {habit.findings.map((f, i) => (
                    <p key={i} className="text-[14px] leading-relaxed text-white/70">
                        {f.text}
                    </p>
                ))}
            </div>
        </div>
    );
}