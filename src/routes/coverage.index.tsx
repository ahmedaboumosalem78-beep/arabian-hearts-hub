import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";
import { COVERAGE } from "@/lib/site";
import { CoverageCard, EmergencyCTA, PageHero } from "@/components/site/Sections";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/coverage/")({
  head: () =>
    pageMeta({
      title: "مناطق التغطية | ونش إنقاذ الإسماعيلية والعاشر من رمضان",
      description:
        "نغطي الإسماعيلية والعاشر من رمضان ومحور 30 يونيو وطريق القاهرة الإسماعيلية والمناطق الصناعية بخدمة ونش وسحب سيارات.",
      path: "/coverage",
    }),
  component: CoverageIndex,
});

const EXTRA = [
  "طريق الإسماعيلية",
  "المناطق الصناعية بالعاشر من رمضان",
  "المناطق الصناعية بالإسماعيلية",
  "الطرق السريعة والمحاور الرئيسية",
];

function CoverageIndex() {
  return (
    <>
      <PageHero
        title="مناطق التغطية"
        subtitle="نصل إليك داخل المدن وعلى الطرق والمحاور المؤدية للإسماعيلية والعاشر من رمضان."
        crumbs={[{ name: "مناطق التغطية", to: "/coverage" }]}
      />
      <section className="section bg-background">
        <div className="container-x">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COVERAGE.map((c) => (
              <CoverageCard key={c.slug} area={c} />
            ))}
          </div>
          <h2 className="mt-12 text-xl font-extrabold">مناطق إضافية نخدمها</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {EXTRA.map((x) => (
              <li
                key={x}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold"
              >
                <MapPin className="size-4 text-primary" aria-hidden />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <EmergencyCTA />
    </>
  );
}
