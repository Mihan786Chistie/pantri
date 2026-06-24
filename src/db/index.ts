import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import migrations from './migrations'
import schema from './schema'

// Models
import AiNotification from './model/AiNotification'
import Item from './model/Item'
import MealTime from './model/MealTime'
import Category from './model/Category'
import WeeklyTrend from './model/WeeklyTrend'

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
    schema,
    // (You might want to comment it out for development purposes -- see Migrations documentation)
    migrations,
    // Disable JSI on Android if you run into initialization issues
    jsi: false,
    onSetUpError: error => {
        console.error('WatermelonDB setup error:', error)
    }
})

// Then, make a Watermelon database from it!
export const database = new Database({
    adapter,
    modelClasses: [
        Item,
        MealTime,
        AiNotification,
        Category,
        WeeklyTrend
    ],
})