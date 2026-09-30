import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { SERVICE_PAGES } from "@/lib/content";
import { COVERAGE, SERVICES } from "@/lib/site";
import { EmergencyCTA, PageHero } from "@/components/site/Sections";
import { Check } from "lucide-react";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const page = SERVICE_PAGES[params.slug];
    if (!page) throw notFound();
    return { page };
  },
  head: ({ params, loaderData }) => {
    const page = loaderData?.page;
    const path = `/services/${params.slug}`;
    if (!page) return {};
    return {
      ...pageMeta({ title: page.title, description: page.description, path }),
      scripts: [
        breadcrumbLd([
          { name: "الرئيسية", item: "/" },
          { name: "خدماتنا", item: "/services" },
          { name: page.h1, item: path },
        ]),
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { page } = Route.useLoaderData();
  const { slug } = Route.useParams();

  return (
    <>
      <PageHero
        title={page.h1}
        subtitle={page.intro}
        crumbs={[
          { name: "خدماتنا", to: "/services" },
          { name: page.h1, to: `/services/${slug}` },
        ]}
      />

      <section className="section bg-background">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-10">
            {page.sections.map((sec) => (
              <article key={sec.heading}>
                <h2 className="text-2xl font-extrabold">{sec.heading}</h2>
                <div className="mt-3 space-y-3 leading-8 text-muted-foreground">
                  {sec.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {sec.bullets && (
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {sec.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm leading-7">
                        <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border p-6 shadow-card">
              <h2 className="text-lg font-extrabold">خدمات أخرى</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {SERVICES.filter((s) => s.slug !== slug).map((s) => (
                  <li key={s.slug}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="font-bold hover:text-primary"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border p-6 shadow-card">
              <h2 className="text-lg font-extrabold">مناطق التغطية</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {COVERAGE.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/coverage/$slug"
                      params={{ slug: c.slug }}
                      className="font-bold hover:text-primary"
                    >
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <EmergencyCTA />
    </>
  );
}
