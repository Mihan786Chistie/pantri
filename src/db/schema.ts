import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 6,
  tables: [
    tableSchema({
      name: "items",
      columns: [
        { name: "name", type: "string" },
        { name: "category", type: "string", isOptional: true },
        { name: "expires_at", type: "number" },
        { name: "is_consumed", type: "boolean" },
        { name: "user_id", type: "string", isIndexed: true },
        { name: "emoji", type: "string", isOptional: true },
        { name: "consumed_at", type: "number", isOptional: true },
      ],
    }),

    tableSchema({
      name: "meal_times",
      columns: [
        { name: "user_id", type: "string" },
        { name: "breakfast", type: "string", isOptional: true },
        { name: "lunch", type: "string", isOptional: true },
        { name: "snacks", type: "string", isOptional: true },
        { name: "dinner", type: "string", isOptional: true },
        { name: "timezone_offset", type: "number" },
        { name: "timezone", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "ai_notifications",
      columns: [
        { name: "user_id", type: "string" },
        { name: "notifications", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "categories",
      columns: [
        { name: "name", type: "string" },
        { name: "user_id", type: "string", isOptional: true, isIndexed: true },
      ],
    }),

    tableSchema({
      name: "weekly_trend",
      columns: [
        { name: "item_id", type: "string" },
        { name: "type", type: "string" },
        { name: "user_id", type: "string" },
        { name: "date", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
