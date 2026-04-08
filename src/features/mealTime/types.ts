export type MealTime = {
    breakfast?: string;
    lunch?: string;
    snacks?: string;
    dinner?: string;
    timezoneOffset: number;
    timezone: string;
}

export type UpdateMealTime = {
    breakfast?: string;
    lunch?: string;
    snacks?: string;
    dinner?: string;
    timezoneOffset?: number;
    timezone?: string;
}