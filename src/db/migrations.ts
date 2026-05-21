import { schemaMigrations, addColumns, createTable } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
    migrations: [
        {
            toVersion: 2,
            steps: [
                addColumns({
                    table: 'items',
                    columns: [
                        { name: 'emoji', type: 'string', isOptional: true },
                    ],
                }),
            ],
        },
        {
            toVersion: 3,
            steps: [
                addColumns({
                    table: 'items',
                    columns: [
                        { name: 'consumed_at', type: 'number', isOptional: true },
                    ],
                }),
            ],
        },
        {
            toVersion: 4,
            steps: [
                createTable({
                    name: 'categories',
                    columns: [
                        { name: 'name', type: 'string' },
                        { name: 'user_id', type: 'string', isOptional: true, isIndexed: true },
                    ],
                }),
            ],
        },
    ],
})