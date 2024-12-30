import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/api";

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

export const Route = createFileRoute("/create-expense")({
  component: CreateExpense
});

function CreateExpense() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      amount: 0
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 3000));
      const res = await api.expenses.$post({ json: value });
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      navigate({ to: "/expense" });
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
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "A title is required"
                  : value.length < 3
                    ? "Title must be at least 3 characters"
                    : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                // await new Promise((resolve) => setTimeout(resolve, 1000));
                return (
                  value.includes("error") && 'No "error" allowed in first name'
                );
              }
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
                return (
                  // !value
                  //   ? "An amount is required"
                  //   :
                  !(typeof value === "number")
                    ? "An amount should be a number"
                    : // : value <= 0
                      //   ? "Amount must be greater than 0"
                      undefined
                );
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
                  onChange={(e) => field.handleChange(Number(e.target.value))}
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
