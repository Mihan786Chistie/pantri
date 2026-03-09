import { Model } from '@nozbe/watermelondb'
import {
    date,
    field,
    immutableRelation,
    readonly,
    writer,
} from '@nozbe/watermelondb/decorators'

export default class MealTime extends Model {
    static table = 'meal_times'

    static associations = {
        users: { type: 'belongs_to', key: 'user_id' },
    }

    // ─── Fields ─────────────────────────────────────────────────────────────────

    @field('breakfast') breakfast
    @field('lunch') lunch
    @field('snacks') snacks
    @field('dinner') dinner

    @field('timezone_offset') timezoneOffset
    @field('timezone') timezone

    @readonly @date('created_at') createdAt
    @date('updated_at') updatedAt

    // ─── Relations ──────────────────────────────────────────────────────────────

    @immutableRelation('users', 'user_id') user

    // ─── Writers ────────────────────────────────────────────────────────────────

    @writer async updateMealTimes({ breakfast, lunch, snacks, dinner, timezoneOffset, timezone }) {
        await this.update(mealTime => {
            if (breakfast !== undefined) mealTime.breakfast = breakfast
            if (lunch !== undefined) mealTime.lunch = lunch
            if (snacks !== undefined) mealTime.snacks = snacks
            if (dinner !== undefined) mealTime.dinner = dinner
            if (timezoneOffset !== undefined) mealTime.timezoneOffset = timezoneOffset
            if (timezone !== undefined) mealTime.timezone = timezone
        })
    }
}
