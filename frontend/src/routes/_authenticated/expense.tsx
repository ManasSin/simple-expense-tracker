import {
  deleteExpense,
  getExpensesQueryOption,
  loadingCreateExpenseQueryOption
} from "@/lib/api";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/expense")({
  component: Expenses
});

function Expenses() {
  const { data, error, isPending } = useQuery(getExpensesQueryOption);
  const { data: loadingCreationExpense } = useQuery(
    loadingCreateExpenseQueryOption
  );

  if (isPending) return "loading ...";

  if (error) return "An error has occurred: " + error.message;
  return (
    <div className="flex max-w-xl flex-col gap-5 mx-auto">
      {JSON.stringify(loadingCreationExpense)}
      <Table className="mt-10 border backdrop-blur-sm">
        <TableCaption>A list of your expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            {/* <TableHead className="text-right">Amount</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingCreationExpense && (
            <TableRow>
              <TableCell className="font-medium">
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>{loadingCreationExpense?.expense?.title}</TableCell>
              <TableCell>{loadingCreationExpense?.expense?.amount}</TableCell>
              <TableCell>{loadingCreationExpense?.expense?.date}</TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4" />
              </TableCell>
            </TableRow>
          )}
          {isPending
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                  </TableRow>
                ))
            : data.expenses.map((expense) => (
                <ExpenseTable expense={expense} />
              ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            {/* <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell> */}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

function ExpenseTable({
  expense
}: {
  expense: {
    id: number;
    title: string;
    amount: string;
    date: string | null;
  };
}) {
  return (
    <TableRow key={expense.id}>
      <TableCell className="font-medium">{expense.id}</TableCell>
      <TableCell>{expense.title}</TableCell>
      <TableCell>{expense.amount}</TableCell>
      <TableCell>{expense.date}</TableCell>
      <ExpenseDeleteButton id={expense.id} />
    </TableRow>
  );
}

function ExpenseDeleteButton({ id }: { id: number }) {
  const queryClient = new QueryClient();
  const mutation = useMutation({
    mutationFn: deleteExpense,

    onError: () => {
      toast("Something went wrong", {
        description: "Could not delete expense" + id
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(
        getExpensesQueryOption.queryKey,
        (existingExpenses) => ({
          ...existingExpenses,
          expenses: existingExpenses!.expenses.filter((e) => e.id !== id)
        })
      );
      toast("Expense deleted", {
        description: "Successfully deleted" + id
      });
    }
  });
  return (
    <Button
      disabled={mutation.isPending}
      variant="ghost"
      size="icon"
      onClick={() => mutation.mutate({ id })}
    >
      {mutation.isPending ? (
        // make a spinner component
        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current border-t-transparent"></div>
      ) : (
        <Trash2Icon />
      )}
    </Button>
  );
}
