import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile
});

function Profile() {
  const { data: user, error, isLoading } = useQuery(userQueryOptions);

  if (isLoading) return <div>loading ...</div>;
  if (error) return <div className="text-red-500">error..</div>;
  // console.log(user);
  return (
    <div>
      {/* <img
        src={`${user?.user.picture}`}
        alt="user image"
        className="border-2 border-red-400"
      /> */}
      <p>{user?.user.given_name}</p>
    </div>
  );
}
