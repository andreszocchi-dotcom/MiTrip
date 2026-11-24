"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logOut } from "@/app/auth/actions";
import { APP_LINKS, PUBLIC_PATHS } from "@/components/site-nav";

// Small, quiet footer: link columns on light gray.
export function SiteFooter() {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  return (
    <footer className="bg-background text-xs leading-5 text-muted print:hidden">
      <div className="mx-auto max-w-[980px] px-4 py-10 sm:px-6">
        <div className="border-t border-line pt-6">
          {isPublic ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              <div>
                <p className="font-semibold text-foreground">MiTrip</p>
                <p className="mt-2">Every plan for your trip, organized by day.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Account</p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  <li><Link href="/signup" className="hover:text-foreground hover:underline">Create an account</Link></li>
                  <li><Link href="/login" className="hover:text-foreground hover:underline">Log in</Link></li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              <div>
                <p className="font-semibold text-foreground">Your trips</p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {APP_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-foreground hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-foreground">Account</p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  <li><Link href="/trips/new" className="hover:text-foreground hover:underline">Add a trip</Link></li>
                  <li>
                    <form action={logOut}>
                      <button type="submit" className="hover:text-foreground hover:underline">
                        Log out
                      </button>
                    </form>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <p className="mt-8 flex flex-wrap justify-between gap-2 border-t border-line pt-4">
            <span>MiTrip · Made for the trip, one day at a time.</span>
            <Link href="/privacy" className="hover:text-foreground hover:underline">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
