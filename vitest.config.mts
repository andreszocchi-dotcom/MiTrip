import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Same "@/..." imports as the app (see tsconfig.json paths).
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
    // Only the TEST_SUPABASE_* settings from .env.test.local reach the tests,
    // so they can never point at the live database by accident.
    env: loadEnv("test", process.cwd(), "TEST_SUPABASE_"),
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
