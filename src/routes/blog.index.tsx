import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";
import { POSTS } from "@/lib/site";
import { BlogCard, EmergencyCTA, PageHero } from "@/components/site/Sections";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";
import work5 from "@/assets/work-5.jpg";

const POST_IMAGES = [work3, work2, work4, work1, work5];

export function postImage(index: number): string {
  return POST_IMAGES[index % POST_IMAGES.length] ?? POST_IMAGES[0]!;
}

export const Route = createFileRoute("/blog/")({
  head: () =>
    pageMeta({
      title: "المدونة | نصائح إنقاذ السيارات ونقل المعدات",
      description:
        "مقالات عن إنقاذ السيارات وسحبها ونقل المعدات الثقيلة ونصائح الطريق في الإسماعيلية والعاشر من رمضان.",
      path: "/blog",
    }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <>
      <PageHero
        title="المدونة"
        subtitle="نصائح عملية عن أعطال الطريق وسحب السيارات ونقل المعدات الثقيلة."
        crumbs={[{ name: "المدونة", to: "/blog" }]}
      />
      <section className="section bg-background">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p, i) => (
            <BlogCard key={p.slug} post={p} image={postImage(i)} />
          ))}
        </div>
      </section>
      <EmergencyCTA />
    </>
  );
}
