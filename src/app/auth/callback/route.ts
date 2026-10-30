import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Google sends the visitor back here with a one-time code. Trading the code
// for a session logs them in (and creates their users row on first visit).
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL("/trips", request.url));
    }
  }
  return NextResponse.redirect(new URL("/login?error=google", request.url));
}
