import Link from "next/link";
import { logOut } from "@/app/auth/actions";
import { Logo } from "@/components/logo";

export function AppHeader() {
  return (
    // On narrow phones the links drop to their own row under the logo.
    <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <Link href="/trips">
        <Logo className="h-10 w-auto" />
      </Link>
      <nav className="flex items-center gap-4 whitespace-nowrap">
        <Link href="/dashboard" className="text-sm font-medium text-accent">
          Dashboard
        </Link>
        <Link href="/search" className="text-sm font-medium text-accent">
          Search
        </Link>
        <Link href="/starred" className="text-sm font-medium text-amber-600">
          ★ Starred
        </Link>
        <form action={logOut}>
          <button type="submit" className="text-sm font-medium text-muted">
            Log out
          </button>
        </form>
      </nav>
    </header>
  );
}
