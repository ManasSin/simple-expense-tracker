import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { expenses as expensesTable } from "../db/schema/expenses";

export const expenseSchema = createSelectSchema(expensesTable);

export const insertExpenseSchema = createInsertSchema(expensesTable, {
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be positive and up to 2 decimal places",
  }),
});
export const createExpenseSchema = insertExpenseSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
});

export type CreateExpense = z.infer<typeof createExpenseSchema>;

export type Expense = z.infer<typeof expenseSchema>;

/*
import { z } from "zod";

const expenseSchema = z.object({
  id: z.coerce.number().int().positive().min(1),
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Amount must be positive" }),
});

export type Expense = z.infer<typeof expenseSchema>;

export const createExpenseSchema = expenseSchema.omit({ id: true });

*/
