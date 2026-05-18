import { Model } from '@nozbe/watermelondb'
import {
    date,
    field,
    text
} from '@nozbe/watermelondb/decorators'

export default class Item extends Model {
    static table = 'items'

    @text('user_id') userId
    @text('name') name
    @text('category') category
    @text('emoji') emoji

    @date('expires_at') expiresAt

    @field('is_consumed') isConsumed

}