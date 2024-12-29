import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { api } from "@/lib/api";

function App() {
  const [totalExpense, setTotalExpense] = useState<number>(0);

  useEffect(() => {
    async function fetchTotalExpense() {
      const data = await api.expenses["total-spent"].$get();

      const total = await data.json();
      setTotalExpense(total.total);
      return total;
    }
    // ;(async () => {
    //   const data = await fetch("/api/expenses/total-spent")

    //   const total = await data.json()
    //   setTotalExpense(total.total)
    //   return total
    // })()

    fetchTotalExpense();
  }, []);

  console.log(totalExpense);

  return (
    <Card className="max-w-md mx-auto ">
      <CardHeader>
        <CardTitle>Total Expense</CardTitle>
        <CardDescription>The total amount you have spent</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setTotalExpense(totalExpense + 1)}>Add</Button>
      </CardContent>
      <CardFooter>{totalExpense}</CardFooter>
    </Card>
  );
}

export default App;
