import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { type CreateExpense, createExpenseSchema } from "@server/Types";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getUser() {
  try {
    const res = await api.auth.user.$get();
    if (!res.ok) {
      throw new Error("error while getting user profile");
    }
    const user = await res.json();
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getAllSpent() {
  //   await new Promise((r) => setTimeout(r, 1000));
  const res = await api.expenses.$get();
  if (!res.ok) {
    throw new Error("server error");
  }

  const data = await res.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-user"],
  queryFn: getUser,
  staleTime: Infinity
});

export const getExpensesQueryOption = queryOptions({
  queryKey: ["get-all-expenses"],
  queryFn: getAllSpent,
  staleTime: 1000 * 60 * 5
});

export async function createExpense({ value }: { value: CreateExpense }) {
  const { data, error } = createExpenseSchema.safeParse(value);
  if (error) {
    // console.log(error);
    throw new Error("Invalid form fields");
  }

  const res = await api.expenses.$post({ json: data });
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const { expense } = await res.json();
  return expense;
}

export const loadingCreateExpenseQueryOption = queryOptions<{
  expense?: CreateExpense;
}>({
  queryKey: ["loading-create-expense"],
  queryFn: async () => {
    return {};
  },
  staleTime: Infinity
});

export async function deleteExpense({ id }: { id: number }) {
  const res = await api.expenses[":id{[0-9]+}"].$delete({
    param: { id: id.toString() }
  });

  if (!res.ok) {
    throw new Error("server error");
  }
}
