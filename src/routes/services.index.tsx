import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";
import { SERVICES } from "@/lib/site";
import { EmergencyCTA, PageHero, ServiceCard } from "@/components/site/Sections";

export const Route = createFileRoute("/services/")({
  head: () =>
    pageMeta({
      title: "خدماتنا | ونش سحب سيارات وسطحة ونقل معدات ثقيلة",
      description:
        "خدمات ونش إنقاذ الإسماعيلية: سحب سيارات، سطحة نقل سيارات، نقل معدات ثقيلة، ومساعدة على الطريق 24 ساعة.",
      path: "/services",
    }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <>
      <PageHero
        title="خدماتنا"
        subtitle="حلول متكاملة لإنقاذ السيارات ونقلها ونقل المعدات الثقيلة داخل الإسماعيلية والمحاور الرئيسية."
        crumbs={[{ name: "خدماتنا", to: "/services" }]}
      />
      <section className="section bg-background">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>
      <EmergencyCTA />
    </>
  );
}
