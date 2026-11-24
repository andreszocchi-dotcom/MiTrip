import { headers } from "next/headers";
import { leaveTrip, removeMember, resetInviteLink, turnOffInviteLink } from "../member-actions";
import { CopyLink } from "./copy-link";

type Person = { user_id: string; email: string; role: string };

// Who's on the trip, plus (for the owner) the invite link to add viewers.
export async function People({
  tripId,
  tripName,
  isOwner,
  inviteCode,
  people,
  myId,
}: {
  tripId: number;
  tripName: string;
  isOwner: boolean;
  inviteCode: string | null;
  people: Person[];
  myId: string;
}) {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  const inviteUrl = inviteCode ? `${proto}://${host}/join/${inviteCode}` : null;

  return (
    <section className="tile p-6 sm:p-8">
      <h2 className="section-title">{isOwner ? "Invite link" : "People"}</h2>

      {isOwner && (
        <>
          <p className="mt-1 text-muted">
            Anyone with the link can view this trip after they log in. Only you can make changes.
          </p>
          <div className="mt-5">
            {inviteUrl ? (
              <>
                <CopyLink url={inviteUrl} tripName={tripName} />
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  <form action={resetInviteLink.bind(null, tripId)}>
                    <button type="submit" className="link">
                      Reset link
                    </button>
                  </form>
                  <form action={turnOffInviteLink.bind(null, tripId)}>
                    <button type="submit" className="link">
                      Turn off link
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <form action={resetInviteLink.bind(null, tripId)}>
                <button type="submit" className="btn btn-primary">
                  Create invite link
                </button>
              </form>
            )}
          </div>
        </>
      )}

      {people.length > 1 || !isOwner ? (
        <ul className="mt-6 divide-y divide-black/[0.06] border-t border-black/[0.06]">
          {people.map((person) => (
            <li key={person.user_id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate">
                  {person.email}
                  {person.user_id === myId && <span className="text-muted"> (you)</span>}
                </p>
                <p className="text-sm text-muted">{person.role === "owner" ? "Owner" : "Can view"}</p>
              </div>
              {isOwner && person.role !== "owner" && (
                <form action={removeMember.bind(null, tripId, person.user_id)}>
                  <button type="submit" className="text-sm font-medium text-[#b42318] hover:underline">
                    Remove
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-muted">Nobody else has joined yet.</p>
      )}

      {!isOwner && (
        <form action={leaveTrip.bind(null, tripId)} className="mt-4">
          <button type="submit" className="btn btn-danger btn-sm">
            Leave this trip
          </button>
        </form>
      )}
    </section>
  );
}
