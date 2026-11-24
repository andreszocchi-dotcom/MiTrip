import Link from "next/link";
import type { ReactNode } from "react";

// A second slim bar that sticks under the main nav inside a trip, like the
// product bar on Apple's pages: where you are on the left, a few links and
// one action on the right.
export function SubNav({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children?: ReactNode;
}) {
  return (
    <div className="sticky top-12 z-40 border-b border-black/[0.06] bg-[rgb(251_251_253/0.78)] backdrop-blur-xl backdrop-saturate-150 print:hidden">
      <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={href} className="min-w-0 truncate text-[17px] font-semibold tracking-[-0.02em] sm:text-[19px]">
          {title}
        </Link>
        <div className="flex shrink-0 items-center gap-4 text-[13px] sm:gap-6">{children}</div>
      </div>
    </div>
  );
}
