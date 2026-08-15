// app/(app)/habits/page.tsx
import HabitsView from "@/components/habits/HabitsView";

export default function HabitsPage(): React.JSX.Element {
    return (
        <main className="flex-1 flex flex-col p-10 max-w-[1400px] mx-auto w-full relative z-10">
            <HabitsView />
        </main>
    );
}