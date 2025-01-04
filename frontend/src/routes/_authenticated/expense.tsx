import {
  getExpensesQueryOption,
  loadingCreateExpenseQueryOption
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
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
                  </TableRow>
                ))
            : data.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  {/* <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell> */}
                </TableRow>
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
