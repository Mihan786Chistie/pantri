import { api } from '@/src/api/client';
import { getMealTime } from '@/src/features/mealTime/services/mealTime.service';
import { MealTime, UpdateMealTime } from '@/src/features/mealTime/types';
import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from '../index';

class SyncService {
    private static instance: SyncService;
    private isSyncing = false;

    private constructor() { }

    public static getInstance(): SyncService {
        if (!SyncService.instance) {
            SyncService.instance = new SyncService();
        }
        return SyncService.instance;
    }

    public async sync() {
        if (this.isSyncing) {
            return;
        }

        try {
            this.isSyncing = true;

            await this.syncLocale().catch(err => {
                console.error("[SyncService] Locale sync failed:", err);
            });
            await this.syncDatabase();

            console.log('[SyncService] Synchronization complete.');
        } catch (error) {
            console.error("[SyncService] Database sync failed during synchronization:", error);
        } finally {
            this.isSyncing = false;
        }
    }

    private async syncLocale() {
        const timezoneOffset = new Date().getTimezoneOffset();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const localMealTime = await getMealTime();

        if (localMealTime && localMealTime.timezone === timezone && localMealTime.timezoneOffset === timezoneOffset) {
            return;
        }

        let mealTime = null;
        try {
            const response = await api.get('/users/mealTime');
            mealTime = response?.data || response;
        } catch (e) {
            console.error("[SyncService] Locale sync failed:", e);
        }

        if (mealTime) {
            const updatePayload: UpdateMealTime = {
                timezoneOffset,
                timezone
            };
            return await api.patch('/users/mealTime', updatePayload);
        }

        const createPayload: MealTime = {
            timezoneOffset,
            timezone
        };
        return await api.post('/users/mealTime', createPayload);
    }

    private async syncDatabase() {
        await synchronize({
            database,
            pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
                const urlParams = `last_pulled_at=${lastPulledAt || 0}&schema_version=${schemaVersion}&migration=${encodeURIComponent(
                    JSON.stringify(migration),
                )}`;
                const response = await api.get(`/sync?${urlParams}`);
                if (response.status !== 200) {
                    throw new Error(response.data);
                }

                const { changes, timestamp } = response.data;
                return { changes, timestamp };
            },
            pushChanges: async ({ changes, lastPulledAt }) => {
                const response = await api.post(`/sync?last_pulled_at=${lastPulledAt || 0}`, {
                    changes,
                });
                if (response.status !== 200) {
                    throw new Error(response.data);
                }
            },
            sendCreatedAsUpdated: true,
            migrationsEnabledAtVersion: 1,
        });
    }
}

export const syncService = SyncService.getInstance();
