import { CalendarDays, AlertTriangle, Database } from "lucide-react";
import type { AnalysisCoverage, AnalysisPeriod } from "@/app/(app)/habits/ia-30-days-summary/prompts";
import { fmtDate } from "./utils";

interface CoverageStripProps {
    period: AnalysisPeriod;
    coverage: AnalysisCoverage;
}

export function CoverageStrip({ period, coverage }: CoverageStripProps) {
    return (
        <section className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 rounded-2xl border border-white/[0.05] bg-white/[0.01] px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <Database size={16} className="text-white/50 shrink-0" />
                <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                        {coverage.recordedDays}
                    </span>
                    <span className="text-[12px] text-white/40">
                        de {period.totalDays} días con algún dato
                    </span>
                </div>
            </div>

            <div className="hidden md:block h-6 w-px bg-white/[0.06]" />

            <div className="flex items-center gap-3">
                <CalendarDays size={16} className="text-white/50 shrink-0" />
                <span className="text-[13px] font-medium text-white/80">
                    {fmtDate(period.from)} — {fmtDate(period.to)}
                </span>
            </div>

            {coverage.missingDays.length > 0 && (
                <>
                    <div className="hidden md:block h-6 w-px bg-white/[0.06]" />
                    <div className="flex items-center gap-3">
                        <AlertTriangle size={16} className="text-white/50 shrink-0" />
                        <span className="text-[12px] text-white/50">
                            Sin dato:{" "}
                            <span className="text-white/80 font-medium">
                                {coverage.missingDays.map(fmtDate).join(", ")}
                            </span>
                        </span>
                    </div>
                </>
            )}
        </section>
    );
}