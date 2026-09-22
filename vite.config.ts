import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), {
    name: "mathinking-public-data",
    configureServer(server) {
      server.middlewares.use(async (req,res,next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const match = url.pathname.match(/^\/content\/(lessons|problems)\/([A-Za-z0-9-]+)\.json$/);
        if (url.pathname !== "/__seo/page" && !match) return next();
        try {
          const module = await server.ssrLoadModule("/src/seo/catalog.server.ts");
          const data = match ? module.getInteractionData(match[1],match[2]) : module.createCatalog().resolve(url.searchParams.get("path") ?? "/");
          res.statusCode = data ? 200 : 404;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(data ?? { error: "Not found" }));
        } catch (error) { next(error as Error); }
      });
    },
  }],
});
