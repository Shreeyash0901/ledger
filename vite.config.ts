import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "website-core": path.resolve(__dirname, "./packages/website-core/src"),
      "website-templates": path.resolve(__dirname, "./packages/website-templates/src"),
    },
  },
});
