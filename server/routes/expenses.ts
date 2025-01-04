import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUserMiddleware as getUser } from "../kinde";
import { expenses as expensesTable } from "../db/schema/expenses";
import { db } from "../db";
import { and, desc, eq, sum } from "drizzle-orm";
import {
  createExpenseSchema,
  insertExpenseSchema,
  type Expense,
} from "../Types";

const expenses = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;

    const expense: Expense[] = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt));

    return c.json({ expenses: expense });
  })
  //   .post("/", async (c) => {
  //     const json = await c.req.json();
  //     const { data, error } = createExpenseSchema.omit({ id: true }).safeParse(json);
  //     console.log(error, json);
  //     if (!error) {
  //       const id = FakeDb.length + 1;
  //       const putData = { id, ...data };
  //       FakeDb.push(putData);
  //       return c.json(data);
  //     } else {
  //       return c.json(JSON.stringify(error.flatten().fieldErrors, null, 2));
  //     }
  //   });
  // instead of doing all the above dance, we can just do.
  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
    const json = c.req.valid("json");
    const user = c.var.user;

    const { data, error } = insertExpenseSchema.safeParse({
      ...json,
      userId: user.id,
    });
    if (error) {
      return c.json({ error: error.flatten() }, 400);
    }

    const expense: Expense = await db
      .insert(expensesTable)
      .values(data)
      .returning()
      .then((res) => res[0]);

    c.status(201);
    return c.json({ expense: expense });
  })
  .get("/total-spent", getUser, async (c) => {
    const user = c.var.user;

    const TotalSpent = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
      .then((res) => res[0]);

    if (!TotalSpent) return c.notFound();
    return c.json({ TotalSpent });
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    // this a way in hono to check if the param is of type number even before landing to that route. read more here https://hono.dev/docs/api/routing#regexp
    const id = Number.parseInt(c.req.param("id"));

    const user = c.var.user;

    const expense = await db
      .select({
        userId: expensesTable.userId,
        id: expensesTable.id,
        title: expensesTable.title,
        amount: expensesTable.amount,
        createdAt: expensesTable.createdAt,
      })
      .from(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .then((res) => res[0]);

    if (!expense) return c.notFound();
    return c.json(expense);
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));

    const user = c.var.user;

    const deletedExpense = await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .returning()
      .then((res) => res[0]);

    if (!deletedExpense) return c.notFound();
    return c.json({ expense: deletedExpense });
  });

export default expenses;
