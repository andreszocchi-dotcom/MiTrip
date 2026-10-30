"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = { error?: string; email?: string } | undefined;

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signUp(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) {
    return { error: "Please enter your email and a password.", email };
  }
  if (password.length < 6) {
    return { error: "Your password needs at least 6 characters.", email };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    const alreadyExists = /already registered/i.test(error.message);
    return {
      error: alreadyExists
        ? "An account with this email already exists. Try logging in."
        : error.message,
      email,
    };
  }
  if (!data.session) {
    return { error: "Check your email to confirm your account, then log in.", email };
  }
  redirect("/trips");
}

export async function logIn(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) {
    return { error: "Please enter your email and password.", email };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      error: "That email and password don't match. Try again or sign up.",
      email,
    };
  }
  redirect("/trips");
}

// Sends the visitor to Google's sign-in screen. Google sends them back to
// /auth/callback on this same site, which finishes the login.
export async function continueWithGoogle() {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error || !data.url) {
    redirect("/login?error=google");
  }
  redirect(data.url);
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
