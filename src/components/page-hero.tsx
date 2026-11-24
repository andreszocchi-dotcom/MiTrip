import type { ReactNode } from "react";

// The big centered opening of a page, like the log in screen: one short
// headline, one plain line under it, and at most a couple of actions.
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-[640px] pb-10 pt-4 text-center sm:pb-14 sm:pt-8">
      {eyebrow && <p className="eyebrow text-brand">{eyebrow}</p>}
      <h1 className="headline-lg mt-2">{title}</h1>
      {subtitle && <p className="subhead mx-auto mt-4 max-w-[520px]">{subtitle}</p>}
      {children && (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">{children}</div>
      )}
    </header>
  );
}
