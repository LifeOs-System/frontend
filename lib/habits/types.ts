export type HabitType = "Binary" | "Time" | "Quantity";
export type HabitStatus = "Active" | "Paused" | "Deleted";
export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export type HabitFrequency = "Weekly" | "Monthly" | null;
export type Area = "Health" | "Knowledge" | "Finance" | "Work" | "Personal";


// 2. Úsalo en tu interfaz Habit
export interface Habit {
    id: string;
    name: string;
    type: HabitType;
    status: HabitStatus;
    startDate: string | null;
    target: number | null;
    unit: string | null;
    area: Area;
    days: DayOfWeek [];
    totalDays: number;
    completedDays: number;
    completionRate: number;
    frequency: HabitFrequency;
    occurrences: number | null;
}

export interface TodayHabit {
    id: string;
    name: string;
    type: HabitType;
    target: number | null;
    value: number | null;
    unit: string | null;
    isCompleted: boolean | null;
    area: Area;
    frequency: HabitFrequency | null;
    occurrences: number | null;
    completedOccurrences: number | null;
}