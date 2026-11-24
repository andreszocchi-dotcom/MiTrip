"use client";

import { useEffect, useState } from "react";

// Draws the pages of a PDF ticket as images with pdf.js, in the browser, so
// a boarding pass can show on the plan page and be printed into the trip's
// Save as PDF like a ticket photo. While it's drawing, the wrapper carries
// data-ticket-loading so the print button can wait for it.
export function PdfTicketPages({
  url,
  title,
  maxPages = 4,
  imgClassName = "",
}: {
  url: string;
  title: string;
  maxPages?: number;
  imgClassName?: string;
}) {
  const [pages, setPages] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      const task = pdfjs.getDocument({ url });
      const doc = await task.promise;
      const count = Math.min(doc.numPages, maxPages);
      const images: string[] = [];
      for (let n = 1; n <= count; n++) {
        const page = await doc.getPage(n);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        await page.render({ canvas, viewport }).promise;
        images.push(canvas.toDataURL("image/png"));
      }
      const total = doc.numPages;
      await task.destroy();
      if (!cancelled) {
        setPages(images);
        setExtra(total - count);
      }
    })().catch(() => {
      if (!cancelled) setFailed(true);
    });
    return () => {
      cancelled = true;
    };
  }, [url, maxPages]);

  if (failed) {
    return (
      <p className="text-sm text-muted">
        This PDF couldn&apos;t be shown here.{" "}
        <a href={url} target="_blank" rel="noopener noreferrer" className="link">
          Open it ↗
        </a>
      </p>
    );
  }

  if (!pages) {
    return (
      <div
        data-ticket-loading
        className="flex h-40 items-center justify-center rounded-[12px] bg-background text-sm text-muted"
      >
        Loading ticket…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {pages.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- drawn in the browser from the private PDF
        <img
          key={i}
          src={src}
          alt={pages.length > 1 ? `Ticket for ${title}, page ${i + 1}` : `Ticket for ${title}`}
          className={`w-full rounded-[12px] bg-white object-contain ring-1 ring-black/10 ${imgClassName}`}
        />
      ))}
      {extra > 0 && (
        <p className="text-xs text-muted">
          {extra} more {extra === 1 ? "page" : "pages"} in the full PDF.
        </p>
      )}
    </div>
  );
}
