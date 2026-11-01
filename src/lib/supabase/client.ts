import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

// A Supabase client for code running in the browser, signed in with the same
// login cookies as the server. Used to upload ticket photos straight to
// Storage, since phone photos are too big to send through a server action.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
