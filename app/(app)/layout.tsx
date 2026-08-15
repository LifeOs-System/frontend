// app/(app)/layout.tsx
import Sidebar from "@/components/Sidebar";
import {TimerAlarmProvider} from "@/components/home/TimerAlarmProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-[#08080a] text-white antialiased">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto relative bg-[#050505]">
                {children}
            </div>
            <TimerAlarmProvider />
        </div>
    );
}