import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { z } from "zod";

export const expenses = table(
  "expenses",
  {
    id: t.serial("id").primaryKey(),
    userId: t.text("user_id").notNull(),
    //   slug: t.varchar().$default(() => generateUniqueString(16)),
    title: t.text("title").notNull(),
    amount: t.numeric("amount", { precision: 12, scale: 2 }).notNull(),
    date: t.date("date").notNull(),
    createdAt: t.timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      userId: t.index("name_idx").on(table.userId),
    };
  }
);

// export const createExpenseSchema = expenseSchema.omit({ id: true }).safeParse;
