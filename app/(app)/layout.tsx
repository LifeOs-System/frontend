// app/(app)/layout.tsx
import Sidebar from "@/components/Sidebar";
import { TimerAlarmProvider } from "@/components/home/TimerAlarmProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-[#08080a] text-white antialiased">
            <Sidebar />

            {/* ⭐ min-w-0: permite que esta columna se encoja al ancho del viewport */}
            <div className="flex-1 min-w-0 flex flex-col overflow-y-auto relative bg-[#050505]">
                {children}
            </div>

            <TimerAlarmProvider />
        </div>
    );
}