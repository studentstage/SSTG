import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/",
  server: {
    port: 5173, // Vite default port
    host: true, // Allow external access
    open: true, // Auto open browser
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
