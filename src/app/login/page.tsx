import type { Metadata } from "next";
import { AuthForm } from "../auth/auth-form";

export const metadata: Metadata = { title: "Log in · MiTrip" };

// "next" is where to return after logging in, like an invite link.
export default async function LogInPage({ searchParams }: PageProps<"/login">) {
  const { next, error } = await searchParams;
  const notice =
    error === "google" ? "Google sign-in didn't finish. Please try again or use email." : undefined;
  return <AuthForm mode="login" next={typeof next === "string" ? next : undefined} notice={notice} />;
}
