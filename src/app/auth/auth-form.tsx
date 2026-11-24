"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Logo } from "@/components/logo";
import { logIn, signUp } from "./actions";

const COPY = {
  signup: {
    title: "Create your account",
    button: "Sign up",
    pending: "Creating account...",
    switchText: "Already have an account?",
    switchLink: "Log in",
    switchHref: "/login",
  },
  login: {
    title: "Welcome back",
    button: "Log in",
    pending: "Logging in...",
    switchText: "New to MiTrip?",
    switchLink: "Create an account",
    switchHref: "/signup",
  },
};

export function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const [state, formAction, pending] = useActionState(
    mode === "signup" ? signUp : logIn,
    undefined,
  );
  const copy = COPY[mode];

  return (
    <main className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center px-4 py-16 sm:py-24">
      <div className="text-center">
        <Logo className="mx-auto h-12 w-auto" />
        <h1 className="headline mt-6">{copy.title}</h1>
      </div>
      <div className="tile mt-8 p-6 sm:p-8">

        <form action={formAction} className="mt-6 flex flex-col gap-4" noValidate>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={state?.email}
              className="field"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Password
            <input
              name="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="field"
            />
          </label>

          {state?.error && (
            <p role="alert" className="rounded-[12px] bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary mt-2"
          >
            {pending ? copy.pending : copy.button}
          </button>
        </form>

      </div>
      <p className="mt-6 text-center text-sm text-muted">
        {copy.switchText}{" "}
        <Link href={copy.switchHref} className="link">
          {copy.switchLink} ›
        </Link>
      </p>
    </main>
  );
}
