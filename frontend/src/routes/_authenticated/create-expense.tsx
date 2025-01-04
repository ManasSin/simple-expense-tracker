import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";

import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  createExpense,
  getExpensesQueryOption,
  loadingCreateExpenseQueryOption
} from "@/lib/api";

import { createExpenseSchema } from "@server/Types";
import { Calendar } from "@/components/ui/calendar";

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense
});

function CreateExpense() {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toISOString()
    },

    onSubmit: async ({ value }) => {
      const existingExpenses = await queryClient.ensureQueryData(
        getExpensesQueryOption
      );
      navigate({ to: "/expense" });

      // loading state
      queryClient.setQueryData(loadingCreateExpenseQueryOption.queryKey, {
        expense: value
      });
      try {
        const expense = await createExpense({ value });

        queryClient.setQueryData(getExpensesQueryOption.queryKey, {
          ...existingExpenses,
          expenses: [expense, ...existingExpenses.expenses]
        });
        toast("Expense created", {
          description: `${expense.title} has been created`
        });
      } catch (error) {
        // handle error
        toast("Something went wrong", {
          description: (error as Error).message
        });
      } finally {
        queryClient.setQueryData(loadingCreateExpenseQueryOption.queryKey, {});
      }
    }
  });

  return (
    <div>
      <form
        className="max-w-xl flex flex-col gap-3 mt-10 mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="">
          <form.Field
            name="title"
            // validators={{
            //   onChange: ({ value }) =>
            //     !value
            //       ? "A title is required"
            //       : value.length < 3
            //         ? "Title must be at least 3 characters"
            //         : undefined,
            //   onChangeAsyncDebounceMs: 500,
            //   onChangeAsync: async ({ value }) => {
            //     // await new Promise((resolve) => setTimeout(resolve, 1000));
            //     return (
            //       value.includes("error") && 'No "error" allowed in first name'
            //     );
            //   }
            // }}
            validators={{
              onChange: createExpenseSchema.shape.title
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                // <div className="flex flex-col gap-2 justify-start align-top">
                <>
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    // className="border border-gray-300 rounded-md px-2 py-1 bg-background text-foreground my-1 max-w-sm"
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>

        <div className="basis-full  self-center">
          <form.Field
            name="date"
            validators={{
              onChange: createExpenseSchema.shape.date
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                // <div className="flex flex-col gap-2 justify-start align-top">
                <>
                  <Calendar
                    id={field.name}
                    mode="single"
                    selected={new Date(field.state.value)}
                    onSelect={(date) =>
                      field.handleChange((date ?? new Date()).toISOString())
                    }
                    className=""
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>
        <div className="">
          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }) =>
                !(typeof value === "number")
                  ? "An amount should be a number"
                  : undefined,
              onChangeAsyncDebounceMs: 50,
              onChangeAsync: async ({ value }) => {
                // await new Promise((resolve) => setTimeout(resolve, 1000));
                return !(typeof value === "number")
                  ? "An amount should be a number"
                  : undefined;
              }
            }}
            children={(field) => (
              // <div className="flex flex-col gap-2 justify-start align-top">
              <>
                <Label htmlFor={field.name}>Amount</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  type="number"
                  onChange={(e) => field.handleChange(e.target.value)}
                  // className="border border-gray-300 rounded-md px-2 py-1 bg-background text-foreground my-1 max-w-sm"
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              variant={"default"}
              size={"lg"}
              onSubmit={form.handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        />
        {/* <Label htmlFor="title">Title</Label>
        <Input type="text" id="title" placeholder="title" />
        <Label htmlFor="amount">amount</Label>
        <Input type="number" id="amount" placeholder="amount" />
        <Button className="mt-4" type="submit">
          Create Button
        </Button> */}
      </form>
    </div>
  );
}
