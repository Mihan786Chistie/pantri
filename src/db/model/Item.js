import { Model } from '@nozbe/watermelondb'
import {
    date,
    field,
    immutableRelation,
    text,
    writer,
} from '@nozbe/watermelondb/decorators'

export default class Item extends Model {
    static table = 'items'

    static associations = {
        users: { type: 'belongs_to', key: 'user_id' },
    }

    // ─── Fields ─────────────────────────────────────────────────────────────────

    @text('name') name
    @text('category') category

    @date('expires_at') expiresAt

    @field('is_consumed') isConsumed

    // ─── Relations ──────────────────────────────────────────────────────────────

    @immutableRelation('users', 'user_id') user

    // ─── Derived fields ─────────────────────────────────────────────────────────

    get isExpired() {
        return this.expiresAt && this.expiresAt < new Date()
    }

    get isExpiringSoon() {
        const threeDays = 3 * 24 * 60 * 60 * 1000
        return this.expiresAt && !this.isExpired && this.expiresAt < new Date(Date.now() + threeDays)
    }

    // ─── Writers ────────────────────────────────────────────────────────────────

    @writer async markAsConsumed() {
        await this.update(item => {
            item.isConsumed = true
        })
    }

    @writer async updateItem({ name, category, expiresAt }) {
        await this.update(item => {
            if (name !== undefined) item.name = name
            if (category !== undefined) item.category = category
            if (expiresAt !== undefined) item.expiresAt = expiresAt
        })
    }
}