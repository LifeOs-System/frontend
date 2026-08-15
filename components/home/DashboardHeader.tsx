"use client";

import { useState, useEffect } from "react";
import CreateHabitDialog from "@/components/CreateHabitDialog";
import { getDashboardDateInfo, type DashboardDateInfo } from "@/utils/util-date-dashboard";

export function DashboardHeader() {
    const [dateInfo, setDateInfo] = useState<DashboardDateInfo>({
        formattedDate: "",
        dayOfYear: 0,
        totalDays: 365,
        yearProgress: 0,
    });

    useEffect(() => {
        setDateInfo(getDashboardDateInfo());
    }, []);

    const { formattedDate, dayOfYear, totalDays, yearProgress } = dateInfo;

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between px-10 py-8 bg-[#050505]/70 backdrop-blur-xl border-b border-white/[0.03]">
            {/* ── Izquierda: Fecha + Día del año + Saludo ── */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <p className="text-[13px] text-white/40 font-medium tracking-wide capitalize min-w-[200px]">
                        {formattedDate || "\u00A0"}
                    </p>

                    {/* Indicador Día del Año */}
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05]">
                        <span className="text-[11px] font-medium text-white/60 tracking-wider">
                            DÍA {dayOfYear} <span className="text-white/20">/ {totalDays}</span>
                        </span>
                        <div className="w-12 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                            <div
                                className="h-full rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-500"
                                style={{ width: `${yearProgress}%` }}
                            />
                        </div>
                    </div>
                </div>

                <h1 className="text-[32px] font-semibold text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                    Buenos días, Angel.
                </h1>
            </div>

            {/* ── Derecha: Acciones ── */}
            <div className="flex items-center gap-3">
                <CreateHabitDialog />
            </div>
        </header>
    );
}