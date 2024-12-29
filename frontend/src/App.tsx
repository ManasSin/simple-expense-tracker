import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./components/ui/card";

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get();
  if (!res.ok) {
    throw new Error("server error");
  }

  const data = await res.json();
  return data;
}

function App() {
  const { data, error, isLoading, isPending } = useQuery({
    queryKey: ["get-total-expenses"],
    queryFn: getTotalSpent
  });

  console.log(data?.total, error, isLoading);
  if (isPending) return "loading ...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <Card className="max-w-md mx-auto ">
      <CardHeader>
        <CardTitle>Total Expense</CardTitle>
        <CardDescription>The total amount you have spent</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => data?.total || 0 + 1}>Add</Button>
      </CardContent>
      <CardFooter>{data?.total}</CardFooter>
    </Card>
  );
}

export default App;
