import { createFileRoute } from "@tanstack/react-router";
import { COVERAGE, SERVICES, SITE } from "@/lib/site";
import { loadDashboardPosts, mergePosts } from "@/lib/dashboard-posts";

const STATIC = ["/", "/about", "/services", "/coverage", "/blog", "/contact"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = mergePosts(await loadDashboardPosts());
        // Use the public origin: behind the host's proxy the request URL is http://.
        const origin = SITE.url;
        const paths = [
          ...STATIC,
          ...SERVICES.map((s) => `/services/${s.slug}`),
          ...COVERAGE.map((c) => `/coverage/${c.slug}`),
          ...posts.map((p) => `/blog/${encodeURIComponent(p.slug)}`),
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
