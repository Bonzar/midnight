import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteSvgR from "vite-plugin-svgr";

import type { UserConfig } from "vitest/config";

const test = {
  globals: true,
  environment: "jsdom",
  setupFiles: ["src/__tests__/setupTests.ts"],
  threads: false,
  watch: false,
} as UserConfig["test"];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSvgR()],
  server: { port: 3000 },
  build: {
    minify: false,
  },
  root: "",
  base: "",
  // @ts-ignore
  test,
});
