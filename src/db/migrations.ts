import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations'

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
    ],
})