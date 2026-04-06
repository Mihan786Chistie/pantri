import { api } from '@/src/api/client'
import { synchronize } from '@nozbe/watermelondb/sync'
import { database } from '../index'

export async function mySync() {
    await synchronize({
        database,
        pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
            const urlParams = `last_pulled_at=${lastPulledAt}&schema_version=${schemaVersion}&migration=${encodeURIComponent(
                JSON.stringify(migration),
            )}`
            const response = await api.get(`/sync?${urlParams}`)
            if (response.status !== 200) {
                throw new Error(response.data)
            }

            const { changes, timestamp } = response.data
            return { changes, timestamp }
        },
        pushChanges: async ({ changes, lastPulledAt }) => {
            const response = await api.post(`/sync?last_pulled_at=${lastPulledAt}`, {
                changes,
            })
            if (response.status !== 200) {
                throw new Error(response.data)
            }
        },
        sendCreatedAsUpdated: true,
        migrationsEnabledAtVersion: 1,
    })
}