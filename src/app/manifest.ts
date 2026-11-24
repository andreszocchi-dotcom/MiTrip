import type { MetadataRoute } from "next";

// Lets phones install MiTrip from the browser ("Add to Home Screen"): it gets
// its own icon and opens full screen, straight to your trips.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MiTrip",
    short_name: "MiTrip",
    description: "Every plan for your trip, organized by day.",
    start_url: "/trips",
    scope: "/",
    display: "standalone",
    background_color: "#f5f5f7",
    theme_color: "#f5f5f7",
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
