import { Check, X } from "lucide-react";
import { WEEK_DAYS, type Habit, type DailyRecord } from "@/mocks/habits";

const KIND_LABELS: Record<Habit["kind"], string> = {
    binary: "Binario",
    quantity: "Cantidad",
    time: "Tiempo",
};

interface HabitRowProps {
    habit: Habit;
    records: DailyRecord[];
}

export function HabitRow({ habit, records }: HabitRowProps) {
    const getRecordForDay = (date: string) =>
        records.find((r) => r.date === date);

    const activeElapsed = WEEK_DAYS.filter((d) =>
        habit.activeDays.includes(d.date)
    );

    const weeklyValue = records.reduce((sum, r) => sum + (r.value ?? 0), 0);
    const weeklyGoal = (habit.dailyGoal ?? 0) * activeElapsed.length;
    const percent =
        habit.kind === "binary"
            ? Math.round(
                (records.filter((r) => r.completed).length /
                    Math.max(1, activeElapsed.length)) *
                100
            )
            : weeklyGoal > 0
                ? Math.min(999, Math.round((weeklyValue / weeklyGoal) * 100))
                : 0;

    return (
        <div className="grid grid-cols-[220px_repeat(7,1fr)] items-center gap-2 px-5 py-4 transition-colors hover:bg-neutral-900/40">
            {/* ── Info ─ */}
            <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-white">
                        {habit.name}
                    </p>
                    <span className="shrink-0 rounded-full border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-neutral-500">
                        {KIND_LABELS[habit.kind]}
                    </span>
                </div>

                {habit.kind === "binary" ? (
                    <p className="mt-1 text-[11px] text-neutral-500">
                        {records.filter((r) => r.completed).length} de{" "}
                        {activeElapsed.length} días ·{" "}
                        <span className="font-semibold text-neutral-300">
                            {percent}%
                        </span>
                    </p>
                ) : (
                    <p className="mt-1 text-[11px] text-neutral-500">
                        {weeklyValue}
                        {habit.unitShort} / {weeklyGoal}
                        {habit.unitShort} ·{" "}
                        <span className="font-semibold text-neutral-300">
                            {percent}%
                        </span>
                    </p>
                )}
            </div>

            {/* ── Celdas ── */}
            {WEEK_DAYS.map((day) => {
                const isActiveDay = habit.activeDays.includes(day.date);
                const record = getRecordForDay(day.date);

                // Día inactivo para este hábito
                if (!isActiveDay) {
                    return (
                        <div key={day.date} className="flex justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-neutral-800" />
                        </div>
                    );
                }

                // ── Binario ──
                if (habit.kind === "binary") {
                    const done = record?.completed ?? false;
                    return (
                        <div key={day.date} className="flex justify-center">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                                    done
                                        ? // ⭐ Check blanco con brillo + borde gris claro
                                        "border-neutral-500 bg-neutral-900"
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

                // ── Medible ──
                const value = record?.value ?? 0;
                const goal = habit.dailyGoal ?? 0;
                const ratio = goal > 0 ? value / goal : 0;

                let cell = "border-neutral-800 text-neutral-600";
                let glow = "";
                if (ratio >= 1) {
                    cell = "border-neutral-500 text-white";
                    glow = "drop-shadow-[0_0_5px_rgba(255,255,255,0.9)] ";
                } else if (ratio >= 0.5) {
                    cell = "border-neutral-600 text-neutral-300";
                }

                return (
                    <div key={day.date} className="flex justify-center">
                        <div
                            className={`flex h-8 min-w-8 items-center justify-center rounded-lg border bg-neutral-900/60 px-1.5 text-[10px] font-semibold transition-all ${cell} ${glow}`}
                            title={`${value} ${habit.unit} / meta ${goal} ${habit.unit}`}
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