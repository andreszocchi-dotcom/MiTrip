import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Join a trip · MiTrip" };

// Opening an invite link adds you to the trip as a viewer, then shows it.
// Logged-out visitors are sent to log in first and come back here after.
export default async function JoinPage({ params }: PageProps<"/join/[code]">) {
  const { code } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/join/${code}`)}`);
  }

  const { data: tripId } = await supabase.rpc("join_trip", { p_code: code });
  if (tripId) {
    redirect(`/trips/${tripId}`);
  }

  return (
    <main className="page">
      <div className="tile p-10 text-center">
        <h1 className="section-title">This invite link doesn&apos;t work anymore</h1>
        <p className="mt-2 text-muted">
          The trip&apos;s owner may have reset or turned off the link. Ask them for a new one.
        </p>
        <Link href="/trips" className="btn btn-primary mt-6">
          Go to my trips
        </Link>
      </div>
    </main>
  );
}
