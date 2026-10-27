export type MealType = 1 | 2 | 3 | 4 | 5 | 6;


export interface CreateFoodRecordRequest {
    mealType: MealType;
    foodsJson: string;
}