import Link from "next/link";
import { logOut } from "@/app/auth/actions";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <Link
        href="/trips"
        className="text-xl font-semibold tracking-tight text-accent"
      >
        MiTrip
      </Link>
      <nav className="flex items-center gap-4">
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
