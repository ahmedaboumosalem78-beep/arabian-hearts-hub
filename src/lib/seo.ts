import { SITE } from "./site";

/** Absolute URL for a site path; search engines and social cards need full URLs. */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return SITE.url + path;
}

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  type?: string;
}) {
  const { title, description, path, type = "website" } = opts;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: absoluteUrl(path) },
      { property: "og:locale", content: "ar_EG" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(path) }],
  };
}

export function jsonLd(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}

export function breadcrumbLd(items: { name: string; item: string }[]) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.item),
    })),
  });
}
