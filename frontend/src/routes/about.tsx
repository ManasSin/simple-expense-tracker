import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About
});

function About() {
  return (
    <div className="">
      <p className="text-bold">please login to access this route</p>
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
}
