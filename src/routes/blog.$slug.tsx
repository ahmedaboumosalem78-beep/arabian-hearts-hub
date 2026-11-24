import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { breadcrumbLd, jsonLd, pageMeta } from "@/lib/seo";
import { POSTS, SITE } from "@/lib/site";
import { EmergencyCTA, PageHero } from "@/components/site/Sections";
import { getDashboardPost, getDashboardSummaries, mergePosts, type BlogPost } from "@/lib/dashboard-posts";
import { postCover } from "./blog.index";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const remote = await getDashboardSummaries();
    // Posts shipped with the site win; anything else may be a dashboard post.
    const found: BlogPost | null =
      POSTS.find((p) => p.slug === params.slug) ?? (await getDashboardPost({ data: params.slug }));
    if (!found) throw notFound();
    return { post: found, image: postCover(found), remote };
  },
  head: ({ params, loaderData }) => {
    const post = loaderData?.post;
    const path = `/blog/${params.slug}`;
    if (!post) return {};
    const meta = pageMeta({
      title: post.seoTitle ?? `${post.title} | ${SITE.nameAr}`,
      description: post.excerpt,
      path,
      type: "article",
    });
    return {
      ...meta,
      meta: post.image ? [...meta.meta, { property: "og:image", content: post.image }] : meta.meta,
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          articleSection: post.category,
          inLanguage: "ar",
          author: { "@type": "Organization", name: SITE.nameAr },
          publisher: { "@type": "Organization", name: SITE.nameAr },
        }),
        breadcrumbLd([
          { name: "الرئيسية", item: "/" },
          { name: "المدونة", item: "/blog" },
          { name: post.title, item: path },
        ]),
      ],
    };
  },
  component: PostPage,
});

function PostPage() {
  const { post, image, remote } = Route.useLoaderData();
  const related = mergePosts(remote)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={post.excerpt}
        crumbs={[
          { name: "المدونة", to: "/blog" },
          { name: post.title, to: `/blog/${post.slug}` },
        ]}
      />
      <section className="section bg-background">
        <article className="container-x max-w-3xl">
          <img
            src={image}
            alt={post.title}
            className="h-64 w-full rounded-2xl object-cover shadow-card md:h-96"
          />
          <p className="mt-6 text-sm text-muted-foreground">
            {post.category} —{" "}
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
          <div className="mt-4 space-y-4 text-base leading-8 text-muted-foreground">
            {post.blocks
              ? post.blocks.map((block, i) =>
                  block.type === "heading" ? (
                    <h2 key={i} className="pt-4 text-xl font-extrabold text-foreground">
                      {block.text}
                    </h2>
                  ) : block.type === "list" ? (
                    <ul key={i} className="list-disc space-y-2 pr-6">
                      {block.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i}>{block.text}</p>
                  ),
                )
              : post.body.map((p) => <p key={p}>{p}</p>)}
          </div>

          <h2 className="mt-12 text-xl font-extrabold text-foreground">مقالات ذات صلة</h2>
          <ul className="mt-4 space-y-2">
            {related.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="font-bold text-primary"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </section>
      <EmergencyCTA />
    </>
  );
}
