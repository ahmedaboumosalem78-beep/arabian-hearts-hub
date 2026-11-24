import { createServerFn } from "@tanstack/react-start";
import { POSTS, type Post } from "./site";

// Posts published from the admin dashboard (dashboard.ammar.company) are read at
// request time, so a new post shows up without rebuilding the site. The posts in
// site.ts keep working if the dashboard is unreachable.

export type PostBlock =
  | { type: "heading" | "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type BlogPost = Post & {
  /** Cover image uploaded in the dashboard (absolute URL). */
  image?: string;
  seoTitle?: string;
  /** Structured body; when absent the plain `body` paragraphs are rendered. */
  blocks?: PostBlock[];
};

export type DashboardPost = {
  title: string;
  slug: string;
  seo_title?: string;
  keyword?: string;
  excerpt?: string;
  body?: string;
  image?: string;
  created_at?: string;
};

const DEFAULT_API = "https://dashboard.ammar.company";
const CACHE_MS = 60_000;
const TIMEOUT_MS = 4_000;
const DEFAULT_CATEGORY = "نصائح الطريق";

const localSlugs = new Set(POSTS.map((post) => post.slug));

/**
 * Turns the dashboard's plain-text body into blocks: "## " is a heading,
 * "- " is a list item and a blank line ends a paragraph.
 */
export function parseBody(body: string): PostBlock[] {
  const blocks: PostBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] | null = null;

  const flush = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };

  for (const rawLine of body.replace(/\r/g, "").split("\n")) {
    const line = rawLine.trim();
    const heading = line.match(/^#{1,6}\s+(.+)$/);
    const bullet = line.match(/^[-*•]\s+(.+)$/);
    if (bullet) {
      flush();
      if (!list) {
        list = [];
        blocks.push({ type: "list", items: list });
      }
      list.push((bullet[1] ?? "").trim());
      continue;
    }
    list = null;
    if (heading) {
      flush();
      blocks.push({ type: "heading", text: (heading[1] ?? "").trim() });
    } else if (line === "") {
      flush();
    } else {
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}

export function toBlogPost(post: DashboardPost): BlogPost {
  const blocks = parseBody(post.body ?? "");
  const paragraphs = blocks.flatMap((block) => (block.type === "paragraph" ? [block.text] : []));
  const date = /^\d{4}-\d{2}-\d{2}/.test(post.created_at ?? "")
    ? (post.created_at as string).slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  const image = (post.image ?? "").trim();
  const seoTitle = (post.seo_title ?? "").trim();
  return {
    slug: post.slug,
    title: post.title,
    category: (post.keyword ?? "").trim() || DEFAULT_CATEGORY,
    date,
    excerpt: (post.excerpt ?? "").trim() || (paragraphs[0] ?? "").slice(0, 160),
    body: paragraphs,
    blocks,
    ...(image ? { image } : {}),
    ...(seoTitle ? { seoTitle } : {}),
  };
}

let cache: { at: number; posts: BlogPost[] } | null = null;

/** Server-side fetch with a short cache; falls back to the last good copy. */
export async function loadDashboardPosts(): Promise<BlogPost[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.posts;
  const base =
    (typeof process !== "undefined" && process.env["DASHBOARD_API_URL"]) || DEFAULT_API;
  try {
    const response = await fetch(`${base}/api/v1/content?type=post`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`dashboard API responded ${response.status}`);
    const payload = (await response.json()) as { data?: DashboardPost[] };
    const seen = new Set<string>();
    const posts = (payload.data ?? [])
      .filter((post) => {
        // Posts that ship with the site win on a slug conflict.
        const ok =
          typeof post?.slug === "string" &&
          typeof post?.title === "string" &&
          post.slug.trim() !== "" &&
          !localSlugs.has(post.slug) &&
          !seen.has(post.slug);
        if (ok) seen.add(post.slug);
        return ok;
      })
      .map(toBlogPost);
    cache = { at: Date.now(), posts };
    return posts;
  } catch (error) {
    console.error("Could not load dashboard posts:", error);
    // Retry after a short pause instead of on every request.
    cache = { at: Date.now() - CACHE_MS + 15_000, posts: cache?.posts ?? [] };
    return cache.posts;
  }
}

/** Dashboard posts without their body, for listings. */
export const getDashboardSummaries = createServerFn({ method: "GET" }).handler(async () =>
  (await loadDashboardPosts()).map((post): BlogPost => ({ ...post, body: [], blocks: [] })),
);

/** One dashboard post in full, or null when the slug is not a dashboard post. */
export const getDashboardPost = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => String(slug))
  .handler(
    async ({ data }) => (await loadDashboardPosts()).find((post) => post.slug === data) ?? null,
  );

/** Newest dashboard posts first, then the posts that ship with the site. */
export function mergePosts(remote: BlogPost[]): BlogPost[] {
  return [...remote, ...POSTS];
}
