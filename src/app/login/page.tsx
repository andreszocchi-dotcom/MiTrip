import type { Metadata } from "next";
import { AuthForm } from "../auth/auth-form";

export const metadata: Metadata = { title: "Log in · MiTrip" };

export default async function LogInPage({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;
  const notice =
    error === "google"
      ? "Google sign-in didn't finish. Please try again or use email."
      : undefined;
  return <AuthForm mode="login" notice={notice} />;
}
