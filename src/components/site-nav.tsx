"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";

// Pages for visitors who aren't logged in (the proxy keeps logged-in users
// off them), so the nav can tell which links to show from the address alone.
export const PUBLIC_PATHS = ["/", "/login", "/signup"];

export const APP_LINKS = [
  { href: "/trips", label: "Trips" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/search", label: "Search" },
  { href: "/starred", label: "Starred" },
];

// A slim, see-through bar that stays at the top while you scroll.
export function SiteNav() {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[rgb(251_251_253/0.78)] backdrop-blur-xl backdrop-saturate-150 print:hidden">
      <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={isPublic ? "/" : "/trips"} aria-label="MiTrip home" className="shrink-0">
          <Logo className="h-[22px] w-auto" />
        </Link>
        {isPublic ? (
          <nav className="flex items-center gap-5 text-[13px]">
            <Link href="/login" className="text-foreground/80 transition-colors hover:text-foreground">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary px-3.5 py-1 text-[13px]">
              Sign up
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-4 text-[13px] sm:gap-7">
            {APP_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`transition-colors ${
                    active ? "font-medium text-foreground" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
