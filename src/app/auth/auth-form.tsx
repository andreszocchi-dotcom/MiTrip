"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Logo } from "@/components/logo";
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
  next,
  notice,
}: {
  mode: "signup" | "login";
  next?: string;
  notice?: string;
}) {
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
        {notice && (
          <p role="alert" className="mb-5 rounded-[12px] bg-red-50 px-4 py-3 text-sm text-red-700">
            {notice}
          </p>
        )}

        <form action={continueWithGoogle}>
          {next && <input type="hidden" name="next" value={next} />}
          <button type="submit" className="btn w-full border border-line bg-surface text-foreground hover:bg-background">
            <GoogleLogo />
            Continue with Google
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-line" />
          or with email
          <span className="h-px flex-1 bg-line" />
        </div>

        <form action={formAction} className="flex flex-col gap-4" noValidate>
          {next && <input type="hidden" name="next" value={next} />}
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
        <Link href={next ? `${copy.switchHref}?next=${encodeURIComponent(next)}` : copy.switchHref} className="link">
          {copy.switchLink} ›
        </Link>
      </p>
    </main>
  );
}

// Google's "G" mark, as Google asks sign-in buttons to show it.
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
