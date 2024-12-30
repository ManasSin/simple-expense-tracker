import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: Root
});

function Navbar() {
  return (
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
      <Link to="/expense" className="[&.active]:font-bold">
        Expenses
      </Link>{" "}
      <Link to="/create-expense" className="[&.active]:font-bold">
        Add Expense
      </Link>
    </div>
  );
}

function Root() {
  return (
    <>
      <Navbar />
      <hr />
      <Outlet />
      {/* <TanStackRouterDevtools  */}
    </>
  );
}
