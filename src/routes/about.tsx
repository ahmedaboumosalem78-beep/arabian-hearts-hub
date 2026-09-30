import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";
import { PageHero, EmergencyCTA } from "@/components/site/Sections";
import work1 from "@/assets/work-1.jpg.asset.json";
import work3 from "@/assets/work-3.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () =>
    pageMeta({
      title: "من نحن | ونش إنقاذ الإسماعيلية عمار أبو مسلم",
      description:
        "تعرف على ونش إنقاذ الإسماعيلية: خدمة محلية لسحب ونقل السيارات ونقل المعدات الثقيلة في الإسماعيلية والعاشر من رمضان.",
      path: "/about",
    }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        title="من نحن"
        subtitle="خدمة محلية متخصصة في إنقاذ وسحب ونقل السيارات ونقل المعدات الثقيلة."
        crumbs={[{ name: "من نحن", to: "/about" }]}
      />

      <section className="section bg-background">
        <div className="container-x grid items-start gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-base leading-8 text-muted-foreground">
            <h2 className="text-2xl font-extrabold text-foreground">
              ونش إنقاذ الإسماعيلية — عمار أبو مسلم
            </h2>
            <p>
              نعمل في مجال إنقاذ وسحب ونقل السيارات والمعدات داخل محافظة الإسماعيلية ومدينة
              العاشر من رمضان والطرق والمحاور المؤدية إليهما.
            </p>
            <p>
              نستقبل طلبات الطوارئ على مدار الساعة، ونختار طريقة النقل المناسبة لكل حالة:
              سحب بالونش أو نقل كامل بالسطحة أو نقل معدة ثقيلة حسب وزنها وأبعادها.
            </p>
            <p>
              هدفنا بسيط: وصول سريع، تعامل واضح، ونقل آمن للسيارة أو المعدة إلى الوجهة التي
              تحددها.
            </p>
            <h3 className="pt-2 text-xl font-extrabold text-foreground">مجالات عملنا</h3>
            <ul className="list-inside list-disc space-y-1">
              <li>إنقاذ السيارات المتعطلة على الطرق</li>
              <li>سحب السيارات ونقلها للورش</li>
              <li>نقل السيارات بالسطحة بين المدن</li>
              <li>نقل المعدات الثقيلة والماكينات</li>
              <li>خدمات الطريق والطوارئ</li>
            </ul>
          </div>
          <div className="grid gap-4">
            <img
              src={work1.url}
              alt="نقل حمولة كبيرة بسطحة"
              loading="lazy"
              className="h-64 w-full rounded-2xl object-cover shadow-card"
            />
            <img
              src={work3.url}
              alt="عمل ميداني لونش الإنقاذ"
              loading="lazy"
              className="h-64 w-full rounded-2xl object-cover shadow-card"
            />
          </div>
        </div>
      </section>

      <EmergencyCTA />
    </>
  );
}
