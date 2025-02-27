import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const ideasResult = await supabase
    .from("ideas")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (ideasResult.error) {
    return (
      <div>
        <p>Error fetching ideas: {ideasResult.error.message}</p>
      </div>
    );
  }

  const ideas = ideasResult.data ?? [];

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h2>Your Ideas</h2>
        {ideas.map((idea) => {
          return (
            <div key={idea.id} className="flex flex-col gap-2">
              <h3>{idea.name}</h3>
              <p>{idea.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
