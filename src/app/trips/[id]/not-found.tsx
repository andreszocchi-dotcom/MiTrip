import Link from "next/link";

// Shown when a trip doesn't exist or isn't mine or shared with me
// (Row Level Security returns nothing, so the page calls notFound()).
export default function TripNotFound() {
  return (
    <main className="page">
      <div className="mt-8 tile p-8 text-center">
        <h1 className="section-title">Trip not found</h1>
        <p className="mt-2 text-sm text-muted">
          This trip doesn&apos;t exist, or it hasn&apos;t been shared with you.
        </p>
        <Link
          href="/trips"
          className="mt-6 inline-block btn btn-primary btn-sm"
        >
          Back to my trips
        </Link>
      </div>
    </main>
  );
}
