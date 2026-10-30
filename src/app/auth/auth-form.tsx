"use client";

import Link from "next/link";
import { useActionState } from "react";
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
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <div className="rounded-3xl bg-surface p-8 shadow-sm ring-1 ring-black/5">
        <Link href="/" className="text-xl font-semibold tracking-tight text-accent">
          MiTrip
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">{copy.title}</h1>

        <form action={formAction} className="mt-6 flex flex-col gap-4" noValidate>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={state?.email}
              className="rounded-xl border border-black/10 px-4 py-3 text-base font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Password
            <input
              name="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="rounded-xl border border-black/10 px-4 py-3 text-base font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </label>

          {state?.error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-xl bg-accent px-4 py-3 text-base font-medium text-white transition-opacity disabled:opacity-60"
          >
            {pending ? copy.pending : copy.button}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          {copy.switchText}{" "}
          <Link href={copy.switchHref} className="font-medium text-accent">
            {copy.switchLink}
          </Link>
        </p>
      </div>
    </main>
  );
}
