import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT || "3000"),
    strictPort: true,
    host: true,
    proxy: {
      "/api": {
        target: "https://keijiban-d86a38875649.herokuapp.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  preview: {
    port: parseInt(process.env.PORT || "3000"),
    strictPort: true,
    host: true,
    allowedHosts: true,
  },
});
