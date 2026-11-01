import Link from "next/link";
import { AppHeader } from "@/components/app-header";

// Shown when a trip doesn't exist or isn't mine or shared with me
// (Row Level Security returns nothing, so the page calls notFound()).
export default function TripNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <AppHeader />
      <div className="mt-8 rounded-2xl bg-surface p-8 text-center shadow-sm ring-1 ring-black/5">
        <h1 className="text-2xl font-semibold">Trip not found</h1>
        <p className="mt-2 text-sm text-muted">
          This trip doesn&apos;t exist, or it hasn&apos;t been shared with you.
        </p>
        <Link
          href="/trips"
          className="mt-6 inline-block rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white"
        >
          Back to my trips
        </Link>
      </div>
    </main>
  );
}
