"use client";

import { useState, useSyncExternalStore } from "react";

const DISMISSED_KEY = "mitrip-install-hint-dismissed";

// True only in Safari on an iPhone or iPad, when MiTrip isn't already
// running from the home screen and the hint hasn't been dismissed.
function shouldShow() {
  const ua = navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Mac") && navigator.maxTouchPoints > 1);
  const isSafari = !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  const installed =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  let dismissed = false;
  try {
    dismissed = localStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    // Private browsing can block storage; just show the hint.
  }
  return isIos && isSafari && !installed && !dismissed;
}

const noSubscribe = () => () => {};

// A one-time card on My trips explaining how to add MiTrip to the iPhone
// home screen (iOS has no install button websites can trigger).
export function InstallHint() {
  const eligible = useSyncExternalStore(noSubscribe, shouldShow, () => false);
  const [closed, setClosed] = useState(false);
  if (!eligible || closed) return null;

  function dismiss() {
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Ignore: it just shows again next time.
    }
    setClosed(true);
  }

  return (
    <div className="tile mx-auto mb-8 flex w-full max-w-[640px] items-center gap-4 p-4 pr-3">
      {/* eslint-disable-next-line @next/next/no-img-element -- the generated app icon */}
      <img src="/apple-icon" alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-[14px]" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">Put MiTrip on your Home Screen</p>
        <p className="text-sm text-muted">
          Tap{" "}
          <svg viewBox="0 0 24 24" className="inline h-4 w-4 -translate-y-px text-accent" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-label="Share">
            <path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
          </svg>{" "}
          Share, then <span className="font-medium text-foreground">Add to Home Screen</span>.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/5"
      >
        ✕
      </button>
    </div>
  );
}
