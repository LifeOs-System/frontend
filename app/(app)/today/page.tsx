// app/(app)/today/page.tsx
import TodayView from "@/components/today/TodayView";

export default function TodayPage(): React.JSX.Element {
    return (
        <main className="flex-1 flex flex-col px-10 py-10 relative z-10">
            <TodayView />
        </main>
    );
}