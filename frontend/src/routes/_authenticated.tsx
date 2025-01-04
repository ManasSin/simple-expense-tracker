import { userQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

const Login = () => {
  return (
    <div className="">
      <p className="text-bold">please login to access this route</p>
      <a href="/api/auth/login">Login</a>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    const getUser = async () => {
      try {
        const data = await queryClient.fetchQuery(userQueryOptions);
        return data;
      } catch {
        return null;
      }
    };

    const data = await getUser();
    //   if (!data) {
    //     throw redirect({
    //       to: "/about",
    //       search: {
    //         // Use the current location to power a redirect after login
    //         // (Do not use `router.state.resolvedLocation` as it can
    //         // potentially lag behind the actual current location)
    //         redirect: location.href
    //       }
    //     });
    //   }
    //   // return { user: { name: "user" } };
    return { user: data };
  },
  component: Component
});

function Component() {
  const { user } = Route.useRouteContext();
  if (!user) {
    return <Login />;
  }

  return <Outlet />;
}
