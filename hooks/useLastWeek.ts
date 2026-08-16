// hooks/useLastWeek.ts
import { useQuery } from "@tanstack/react-query";
import {habitService} from "@/lib/habits/habitsService";


export function useLastWeek() {
    return useQuery({
        queryKey: ["habits", "last-week"],
        queryFn: () => habitService.getLastWeek(),
        staleTime: 1000 * 60 * 2, // 2 minutos
    });
}