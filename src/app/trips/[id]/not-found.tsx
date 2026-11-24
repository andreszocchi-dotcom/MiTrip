import Link from "next/link";
import { PageHero } from "@/components/page-hero";

// Shown when a trip doesn't exist or isn't mine or shared with me
// (Row Level Security returns nothing, so the page calls notFound()).
export default function TripNotFound() {
  return (
    <main className="page">
      <PageHero
        title="Trip not found."
        subtitle="This trip doesn't exist, or it hasn't been shared with you."
      >
        <Link href="/trips" className="btn btn-primary">
          Back to my trips
        </Link>
      </PageHero>
    </main>
  );
}
