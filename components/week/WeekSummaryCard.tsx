interface WeekSummaryCardProps {
    label: string;
    value: string;
    hint: string;
}

export function WeekSummaryCard({ label, value, hint }: WeekSummaryCardProps) {
    return (
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-4">
            <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-500">
                {label}
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-[11px] text-neutral-500">{hint}</p>
            </div>
        </div>
    );
}