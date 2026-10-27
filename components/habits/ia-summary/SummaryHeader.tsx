import { ArrowLeft, Sparkles } from "lucide-react";

interface SummaryHeaderProps {
    totalDays: number;
    onBack: () => void;
}

export function SummaryHeader({ totalDays, onBack }: SummaryHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-[13px] text-white/60 hover:text-white transition-colors"
            >
                <ArrowLeft size={16} />
                Volver a mis hábitos
            </button>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/60 uppercase tracking-[0.2em]">
                <Sparkles size={12} className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]" />
                Análisis IA · {totalDays} días
            </span>
        </div>
    );
}