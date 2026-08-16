import { Check, X } from "lucide-react";
import {HabitWeekSummary, WeekDayHeader} from "@/lib/habits/habitSchema";


const KIND_LABELS = {
    Binary: "Binario",
    Time: "Tiempo",
    Quantity: "Cantidad",
} as const;

interface HabitRowProps {
    habit: HabitWeekSummary;
    days: WeekDayHeader[];
}

export function HabitRow({ habit, days }: HabitRowProps) {
    const weeklyValue = habit.weekTotalValue ?? 0;
    const weeklyGoal = habit.weekTotalTarget ?? 0;

    return (
        <div className="grid grid-cols-[220px_repeat(7,1fr)] items-center gap-2 px-5 py-4 transition-colors hover:bg-neutral-900/40">
            {/* ── Info ─ */}
            <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-white">
                        {habit.name}
                    </p>
                    <span className="shrink-0 rounded-full border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-neutral-500">
                        {KIND_LABELS[habit.type]}
                    </span>
                </div>

                {habit.type === "Binary" ? (
                    <p className="mt-1 text-[11px] text-neutral-500">
                        {habit.completedDays} de {habit.totalDays} días ·{" "}
                        <span className="font-semibold text-neutral-300">
                            {habit.weekCompletionPercentage}%
                        </span>
                    </p>
                ) : (
                    <p className="mt-1 text-[11px] text-neutral-500">
                        {weeklyValue}{" "}
                        {habit.unit} / {weeklyGoal}{" "}
                        {habit.unit} ·{" "}
                        <span className="font-semibold text-neutral-300">
                            {habit.weekCompletionPercentage}%
                        </span>
                    </p>
                )}
            </div>

            {/* ── Celdas ── */}
            {days.map((day) => {
                const cell = habit.days.find((d) => d.date === day.date);

                // No hay registro → "—"
                if (!cell || !cell.hasRecord) {
                    return (
                        <div key={day.date} className="flex justify-center">
                            <div className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/60 text-[10px] font-semibold text-neutral-700">
                                —
                            </div>
                        </div>
                    );
                }

                // ── Binario ──
                if (habit.type === "Binary") {
                    const done = cell.isCompleted ?? false;
                    return (
                        <div key={day.date} className="flex justify-center">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                                    done
                                        ? "border-neutral-500 bg-neutral-900"
                                        : "border-neutral-800 bg-neutral-900/60"
                                }`}
                            >
                                {done ? (
                                    <Check
                                        size={15}
                                        strokeWidth={3}
                                        className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]"
                                    />
                                ) : (
                                    <X
                                        size={12}
                                        strokeWidth={3}
                                        className="text-neutral-700"
                                    />
                                )}
                            </div>
                        </div>
                    );
                }

                // ── Medible (Time / Quantity) ──
                const value = cell.value ?? 0;
                const met = cell.metDailyTarget;

                let cellStyle = "border-neutral-800 text-neutral-600";
                let glow = "";
                if (met) {
                    cellStyle = "border-neutral-500 text-white";
                    glow = "drop-shadow-[0_0_5px_rgba(255,255,255,0.9)] ";
                } else if (value > 0) {
                    cellStyle = "border-neutral-600 text-neutral-300";
                }

                return (
                    <div key={day.date} className="flex justify-center">
                        <div
                            className={`flex h-8 min-w-8 items-center justify-center rounded-lg border bg-neutral-900/60 px-1.5 text-[10px] font-semibold transition-all ${cellStyle} ${glow}`}
                            title={`${value} ${habit.unit ?? ""} / meta ${habit.dailyTarget ?? 0} ${habit.unit ?? ""}`}
                        >
                            {value === 0 ? "—" : formatValue(value)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function formatValue(value: number): string {
    if (value >= 1000) return `${Math.round(value / 1000)}k`;
    if (Number.isInteger(value)) return value.toString();
    return value.toFixed(1);
}