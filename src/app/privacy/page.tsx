import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Privacy · MiTrip",
  description: "What MiTrip stores, who helps run it, and how to delete your data.",
};

const CONTACT = "andres.zocchi97@gmail.com";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="tile p-6 sm:p-8">
      <h2 className="section-title">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}

// The privacy policy. Public, so Google's sign-in setup can link to it.
export default function PrivacyPage() {
  return (
    <main className="page">
      <PageHero
        title="Privacy."
        subtitle="Your trips are yours. Here's what MiTrip keeps, who helps run it, and how to delete it."
      />

      <div className="flex flex-col gap-4">
        <Section title="What MiTrip stores">
          <p>
            <strong>Your account:</strong> your email address, and a password if you sign up with email (stored
            only as a secure hash). If you continue with Google, MiTrip receives your name and email address from
            Google, nothing else.
          </p>
          <p>
            <strong>What you add:</strong> trips, days, and plans (titles, times, addresses, confirmation numbers,
            ticket links, and notes), any itinerary you paste, ticket photos and PDFs you upload, the trips and plans
            you star, and the people you share a trip with.
          </p>
        </Section>

        <Section title="How it's used">
          <p>
            Only to run MiTrip for you: showing your trips, sorting plans into days, opening places in Google Maps,
            and letting people you invite view a trip. MiTrip has no ads, doesn&apos;t sell your data, and
            doesn&apos;t share it for marketing.
          </p>
        </Section>

        <Section title="Who helps run MiTrip">
          <p>
            <strong>Supabase</strong> stores the database, sign-in, and ticket files (in the United States).
          </p>
          <p>
            <strong>Vercel</strong> hosts the website.
          </p>
          <p>
            <strong>Anthropic</strong> receives your pasted itinerary only when you tap Import on a trip, so its
            Claude model can sort the items into days. Nothing else is sent to Anthropic.
          </p>
          <p>
            <strong>Google</strong> handles &ldquo;Continue with Google&rdquo; if you choose it. Address links open
            Google Maps, which follows Google&apos;s own privacy policy.
          </p>
        </Section>

        <Section title="Who can see your trips">
          <p>
            Only you, plus anyone you invite with a trip&apos;s invite link. Invited people can view the trip but
            can&apos;t change it, and you can remove them or turn the link off at any time. Ticket files are private
            and open only for people who can view the trip.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            MiTrip uses cookies only to keep you logged in. There are no tracking or advertising cookies.
          </p>
        </Section>

        <Section title="Deleting your data">
          <p>
            You can delete any plan or trip in the app; deleting a trip removes its days, plans, and ticket files. To
            delete your whole account, email{" "}
            <a href={`mailto:${CONTACT}`} className="link">
              {CONTACT}
            </a>{" "}
            from the address you signed up with, and everything tied to it will be deleted.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            Email{" "}
            <a href={`mailto:${CONTACT}`} className="link">
              {CONTACT}
            </a>
            . MiTrip isn&apos;t meant for children under 13. If this policy changes, the date below will change too.
          </p>
          <p className="text-sm text-muted">Last updated November 23, 2026.</p>
        </Section>
      </div>
    </main>
  );
}
