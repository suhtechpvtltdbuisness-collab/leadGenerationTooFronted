import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://lead-generation-tool-backend.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[proxy] ${req.method} ${req.url} → Vercel`);
          });
          proxy.on("error", (err, req, res) => {
            console.error("[proxy error]", err.message);
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Proxy error: " + err.message }));
          });
        },
      },
    },
  },
});

