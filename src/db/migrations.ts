import {
  addColumns,
  createTable,
  schemaMigrations,
} from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: "items",
          columns: [{ name: "emoji", type: "string", isOptional: true }],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: "items",
          columns: [{ name: "consumed_at", type: "number", isOptional: true }],
        }),
      ],
    },
    {
      toVersion: 4,
      steps: [
        createTable({
          name: "categories",
          columns: [
            { name: "name", type: "string" },
            {
              name: "user_id",
              type: "string",
              isOptional: true,
              isIndexed: true,
            },
          ],
        }),
      ],
    },
    {
      toVersion: 5,
      steps: [
        createTable({
          name: "weekly_trend",
          columns: [
            { name: "item_id", type: "string" },
            { name: "type", type: "string" },
            { name: "user_id", type: "string" },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
      ],
    },
    {
      toVersion: 6,
      steps: [
        addColumns({
          table: "weekly_trend",
          columns: [{ name: "date", type: "number" }],
        }),
      ],
    },
  ],
});
