import Link from "next/link";
import { logOut } from "@/app/auth/actions";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between">
      <Link
        href="/trips"
        className="text-xl font-semibold tracking-tight text-accent"
      >
        MiTrip
      </Link>
      <form action={logOut}>
        <button type="submit" className="text-sm font-medium text-muted">
          Log out
        </button>
      </form>
    </header>
  );
}
