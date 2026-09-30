import { createFileRoute } from "@tanstack/react-router";
import { COVERAGE, POSTS, SERVICES } from "@/lib/site";

const STATIC = ["/", "/about", "/services", "/coverage", "/blog", "/contact"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const paths = [
          ...STATIC,
          ...SERVICES.map((s) => `/services/${s.slug}`),
          ...COVERAGE.map((c) => `/coverage/${c.slug}`),
          ...POSTS.map((p) => `/blog/${p.slug}`),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (p) =>
      `  <url><loc>${origin}${p}</loc><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : "0.8"}</priority></url>`,
  )
  .join("\n")}
</urlset>`;
        return new Response(body, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
