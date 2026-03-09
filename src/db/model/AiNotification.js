import { Model } from '@nozbe/watermelondb'
import {
    date,
    immutableRelation,
    json,
    readonly,
    writer,
} from '@nozbe/watermelondb/decorators'

const sanitizeNotifications = raw => (Array.isArray(raw) ? raw : [])

export default class AiNotification extends Model {
    static table = 'ai_notifications'

    static associations = {
        users: { type: 'belongs_to', key: 'user_id' },
    }

    // ─── Fields ─────────────────────────────────────────────────────────────────

    @json('notifications', sanitizeNotifications) notifications

    @readonly @date('created_at') createdAt
    @date('updated_at') updatedAt

    // ─── Relations ──────────────────────────────────────────────────────────────

    @immutableRelation('users', 'user_id') user

    // ─── Derived fields ─────────────────────────────────────────────────────────

    getNotificationFor(mealType) {
        return this.notifications.find(n => n.mealType === mealType) ?? null
    }

    // ─── Writers ────────────────────────────────────────────────────────────────

    @writer async setNotifications(notifications) {
        await this.update(record => {
            record.notifications = notifications
        })
    }
}
