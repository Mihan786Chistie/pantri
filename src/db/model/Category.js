import { Model } from '@nozbe/watermelondb'
import { text } from '@nozbe/watermelondb/decorators'

export default class Category extends Model {
    static table = 'categories'

    @text('name') name
    @text('user_id') userId
}
