import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logOut } from "../auth/actions";

export const metadata: Metadata = { title: "My trips · MiTrip" };

export default async function TripsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <header className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          MiTrip
        </p>
        <form action={logOut}>
          <button type="submit" className="text-sm font-medium text-muted">
            Log out
          </button>
        </form>
      </header>

      <h1 className="mt-8 text-3xl font-semibold">My trips</h1>
      <p className="mt-1 text-sm text-muted">Signed in as {user.email}</p>

      <div className="mt-8 rounded-3xl bg-surface p-8 text-center shadow-sm ring-1 ring-black/5">
        <p className="text-lg font-medium">No trips yet</p>
        <p className="mt-2 text-muted">Adding trips is coming in the next feature.</p>
      </div>
    </main>
  );
}
