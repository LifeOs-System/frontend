import { TrendingUp } from "lucide-react";
import type { AnalysisPattern } from "@/app/(app)/habits/ia-30-days-summary/prompts";

interface PatternsSectionProps {
    patterns: AnalysisPattern[];
}

export function PatternsSection({ patterns }: PatternsSectionProps) {
    if (patterns.length === 0) return null;

    return (
        <section className="rounded-3xl border border-white/[0.05] bg-white/[0.01] p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={14} className="text-white/70" />
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                    Patrones detectados
                </p>
            </div>
            <div className="space-y-4">
                {patterns.map((p) => (
                    <div
                        key={p.name}
                        className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 py-3 border-b border-white/[0.04] last:border-0"
                    >
                        <p className="text-sm font-medium text-white md:w-72 shrink-0">{p.name}</p>
                        <div className="flex items-center gap-3 flex-1">
                            <span className="text-lg font-bold text-white tabular-nums drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
                                {p.compliance}%
                            </span>
                            <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden max-w-xs">
                                <div
                                    className="h-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.5)]"
                                    style={{ width: `${p.compliance}%` }}
                                />
                            </div>
                        </div>
                        <p className="text-[11px] text-white/50">
                            muestra: {p.sample} · {p.span}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}