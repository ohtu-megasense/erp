import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      "/api": {
        target: "http://backend:3000",
        changeOrigin: true,
      },
    },
    allowedHosts: ['frontend'],
    hmr: {
      host: '0.0.0.0',
      port: 5173,
      clientPort: 5173
    },
    cors: true
  },
});
