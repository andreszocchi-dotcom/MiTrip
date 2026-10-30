import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <div className="rounded-3xl bg-surface p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-xl font-semibold tracking-tight text-accent">
          MiTrip
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight">
          Everything you need for today&apos;s trip, in one place.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Flights, hotels, reservations, tickets, and directions, organized by
          day and shared with the people traveling with you.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/signup"
            className="rounded-xl bg-accent px-4 py-3 text-center text-base font-medium text-white"
          >
            Create an account
          </Link>
          <Link
            href="/login"
            className="rounded-xl bg-accent-soft px-4 py-3 text-center text-base font-medium text-accent"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
