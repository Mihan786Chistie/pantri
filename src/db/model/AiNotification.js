import { Model } from '@nozbe/watermelondb'
import {
    date,
    json,
    readonly,
    text
} from '@nozbe/watermelondb/decorators'

const sanitizeNotifications = raw => (Array.isArray(raw) ? raw : [])

export default class AiNotification extends Model {
    static table = 'ai_notifications'

    @text('user_id') userId
    @json('notifications', sanitizeNotifications) notifications

    @readonly @date('created_at') createdAt
    @date('updated_at') updatedAt
}
