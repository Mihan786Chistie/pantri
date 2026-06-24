import { Model } from '@nozbe/watermelondb'
import { readonly, text, date } from '@nozbe/watermelondb/decorators'

export default class WeeklyTrend extends Model {
    static table = 'weekly_trend'

    @text('item_id') itemId!: string
    @text('type') type!: string
    @text('user_id') userId!: string
    @date('date') date!: Date

    @readonly @date('created_at') createdAt!: Date
    @date('updated_at') updatedAt!: Date
}
