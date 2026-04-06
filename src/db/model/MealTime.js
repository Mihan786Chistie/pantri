import { Model } from '@nozbe/watermelondb'
import {
    date,
    field,
    readonly,
    text
} from '@nozbe/watermelondb/decorators'

export default class MealTime extends Model {
    static table = 'meal_times'

    @text('user_id') userId
    @field('breakfast') breakfast
    @field('lunch') lunch
    @field('snacks') snacks
    @field('dinner') dinner

    @field('timezone_offset') timezoneOffset
    @field('timezone') timezone

    @readonly @date('created_at') createdAt
    @date('updated_at') updatedAt

}
