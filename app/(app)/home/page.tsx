"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/home/DashboardHeader";
import { QuoteCard } from "@/components/home/QuoteCard";
import { TimerCard } from "@/components/home/TimerCard";
import { TasksCard } from "@/components/home/TasksCard";
import { getDashboardDateInfo, type DashboardDateInfo } from "@/utils/util-date-dashboard";

export default function Dashboard(): React.JSX.Element {
  const [dateInfo, setDateInfo] = useState<DashboardDateInfo>({
    formattedDate: "",
    dayOfYear: 0,
    totalDays: 365,
    yearProgress: 0,
  });

  useEffect(() => {
    setDateInfo(getDashboardDateInfo());
  }, []);

  const { dayOfYear } = dateInfo;

  return (
      <div className="flex flex-col flex-1 relative z-10">
        {/* ⭐ Header */}
        <DashboardHeader />

        {/* ── Contenido Principal ── */}
        <main className="flex-1 flex flex-col p-10 max-w-[1600px] mx-auto w-full relative z-10">
          <div className="flex flex-col gap-6">
            {/* ── Fila 1: Cita a ancho completo ── */}
            <div className="min-h-[280px]">
              <QuoteCard dayOfYear={dayOfYear} />
            </div>

            {/* ── Fila 2: Timer + Tareas lado a lado ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="min-h-[560px]">
                <TimerCard />
              </div>
              <div className="min-h-[560px]">
                <TasksCard />
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}