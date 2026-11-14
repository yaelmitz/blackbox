import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Requests to /api go to the NestJS server (tahkirim-api), in dev and in preview.
// Default matches PORT in tahkirim-api/.env; override with API_URL=http://host:port
const API = process.env.API_URL ?? "http://localhost:4000";
const proxy = { "/api": { target: API, changeOrigin: true } };

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { proxy },
  preview: { proxy },
});
