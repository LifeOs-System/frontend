export type MealType = 1 | 2 | 3 | 4 | 5 | 6;

export const MEAL_TYPE_OPTIONS: { value: MealType; label: string }[] = [
    { value: 1, label: "Desayuno" },
    { value: 2, label: "Merienda de la mañana" },
    { value: 3, label: "Almuerzo" },
    { value: 4, label: "Merienda de la tarde" },
    { value: 5, label: "Cena" },
    { value: 6, label: "Merienda de la noche" },
];