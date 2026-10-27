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

// Tipos que reflejan la respuesta del endpoint GET /api/habits/last30days

export type Last30DaysHabitType = "Binary" | "Quantity" | "Time";
export type Last30DaysHabitStatus = "Active" | "Paused" | "Deleted";
export type Last30DaysArea = "Health" | "Knowledge" | "Work" | "Personal" | string;
export type Last30DaysDayOfWeek =
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday";
export type Last30DaysFrequency = "Weekly" | null;

export interface Last30DaysRecordResponse {
    date: string; // "YYYY-MM-DD" (DateOnly serializado)
    value: number | null;
    target: number | null;
    isCompleted: boolean;
}

export interface Last30DaysHabitResponse {
    name: string;
    type: Last30DaysHabitType;
    status: Last30DaysHabitStatus;
    startDate: string | null; // "YYYY-MM-DD" | null
    target: number | null;
    unit: string | null;
    area: Last30DaysArea;
    days: Last30DaysDayOfWeek[];
    frequency: Last30DaysFrequency;
    occurrences: number | null;
    records: Last30DaysRecordResponse[];
}

export interface GetLast30DaysResponse {
    habits: Last30DaysHabitResponse[];
}