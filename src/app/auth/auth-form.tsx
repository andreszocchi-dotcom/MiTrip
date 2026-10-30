"use client";

import Link from "next/link";
import { useActionState } from "react";
import { continueWithGoogle, logIn, signUp } from "./actions";

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

export function AuthForm({
  mode,
  notice,
}: {
  mode: "signup" | "login";
  notice?: string;
}) {
  const [state, formAction, pending] = useActionState(
    mode === "signup" ? signUp : logIn,
    undefined,
  );
  const copy = COPY[mode];

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <div className="rounded-3xl bg-surface p-8 shadow-sm ring-1 ring-black/5">
        <Link href="/" className="text-sm font-medium uppercase tracking-widest text-accent">
          MiTrip
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">{copy.title}</h1>

        {notice && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {notice}
          </p>
        )}

        <form action={continueWithGoogle} className="mt-6">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-surface px-4 py-3 text-base font-medium"
          >
            <GoogleLogo />
            Continue with Google
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted">
          <span className="h-px flex-1 bg-black/10" />
          or with email
          <span className="h-px flex-1 bg-black/10" />
        </div>

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

function GoogleLogo() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
