import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const expenseSchema = z.object({
  id: z.coerce.number().min(2).max(100),
  title: z.string(),
  amount: z.number().int().positive(),
});

type expenseSchemaType = z.infer<typeof expenseSchema>;

const FakeDb: expenseSchemaType[] = [
  { id: 1, title: "Groceries", amount: 50 },
  { id: 2, title: "Electricity Bill", amount: 75 },
  { id: 3, title: "Internet Bill", amount: 40 },
  { id: 4, title: "Rent", amount: 500 },
  { id: 5, title: "Gym Membership", amount: 30 },
];

const expenses = new Hono();

expenses
  .get("/", (c) => {
    return c.json({ expenses: FakeDb });
  })
  //   .post("/", async (c) => {
  //     const json = await c.req.json();
  //     const { data, error } = expenseSchema.omit({ id: true }).safeParse(json);
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
  .post(
    "/",
    zValidator("json", expenseSchema.omit({ id: true })),
    async (c) => {
      const json = c.req.valid("json");
      FakeDb.push({ id: FakeDb.length + 1, ...json });
      return c.json(json);
    }
  )
  .get("/:id{[0-9]+}", (c) => {
    // this a way in hono to check if the param is of type number even before landing to that route. read more here https://hono.dev/docs/api/routing#regexp
    const id = Number.parseInt(c.req.param("id"));
    const expense = FakeDb.find((item) => item.id === id);
    if (!expense) return c.notFound();
    return c.json(expense);
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = FakeDb.findIndex((item) => item.id === id);
    if (expense === -1) return c.notFound();

    const deletedExpense = FakeDb.splice(expense, 1);
    return c.json(deletedExpense);
  });

export default expenses;
