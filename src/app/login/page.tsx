import type { Metadata } from "next";
import { AuthForm } from "../auth/auth-form";

export const metadata: Metadata = { title: "Log in · MiTrip" };

export default function LogInPage() {
  return <AuthForm mode="login" />;
}
