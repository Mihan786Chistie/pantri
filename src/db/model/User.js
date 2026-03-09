import { Model } from '@nozbe/watermelondb'
import {
    children,
    date,
    field,
    readonly,
    text
} from '@nozbe/watermelondb/decorators'

export default class User extends Model {
    static table = 'users'

    static associations = {
        items: { type: 'has_many', foreignKey: 'user_id' },
        meal_times: { type: 'has_many', foreignKey: 'user_id' },
        ai_notifications: { type: 'has_many', foreignKey: 'user_id' },
    }

    // ─── Fields ─────────────────────────────────────────────────────────────────

    @text('name') name
    @text('email') email
    @field('password') password
    @field('hashed_refresh_token') hashedRefreshToken
    @field('avatar_url') avatarUrl

    @readonly @date('created_at') createdAt

    // ─── Relations ──────────────────────────────────────────────────────────────

    @children('items') items
    @children('meal_times') mealTimes
    @children('ai_notifications') aiNotifications

}
