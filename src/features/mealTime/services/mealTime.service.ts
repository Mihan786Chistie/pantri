import { database } from "@/src/db";
import MealTime from "@/src/db/model/MealTime";

export async function getMealTime(): Promise<MealTime | null> {
    const mealTimes = await database.get<MealTime>('meal_times').query().fetch();
    return mealTimes[0] || null;
}