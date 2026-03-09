// model/schema.js
import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
    version: 1,
    tables: [
        // ─── Users ────────────────────────────────────────────────────────────────
        tableSchema({
            name: 'users',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'email', type: 'string' },
                { name: 'password', type: 'string' },
                { name: 'hashed_refresh_token', type: 'string', isOptional: true },
                { name: 'avatar_url', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
            ],
        }),

        // ─── Items ────────────────────────────────────────────────────────────────
        tableSchema({
            name: 'items',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'category', type: 'string', isOptional: true },
                { name: 'expires_at', type: 'number' },
                { name: 'is_consumed', type: 'boolean' },
                { name: 'user_id', type: 'string', isIndexed: true },
            ],
        }),

        // ─── Meal Times ───────────────────────────────────────────────────────────
        tableSchema({
            name: 'meal_times',
            columns: [
                { name: 'user_id', type: 'string' },
                { name: 'breakfast', type: 'string', isOptional: true },
                { name: 'lunch', type: 'string', isOptional: true },
                { name: 'snacks', type: 'string', isOptional: true },
                { name: 'dinner', type: 'string', isOptional: true },
                { name: 'timezone_offset', type: 'number' },
                { name: 'timezone', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),

        // ─── AI Notifications ─────────────────────────────────────────────────────
        tableSchema({
            name: 'ai_notifications',
            columns: [
                { name: 'user_id', type: 'string' },
                { name: 'notifications', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),
    ],
})
