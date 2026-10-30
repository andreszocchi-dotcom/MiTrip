import type { Metadata } from "next";
import { AuthForm } from "../auth/auth-form";

export const metadata: Metadata = { title: "Sign up · MiTrip" };

export default function SignUpPage() {
  return <AuthForm mode="signup" />;
}
