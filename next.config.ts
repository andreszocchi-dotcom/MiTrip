import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents is off: every page reads fresh, per-user data from
  // Supabase, so one user's trips can never be served from another's cache.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
