import { Link } from "@tanstack/react-router";
import {
  Truck,
  Forklift,
  Car,
  TriangleAlert,
  ChevronLeft,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import type { ReactNode } from "react";
import { PhoneButton, WhatsAppButton } from "./Buttons";
import type { Coverage, Post, Service } from "@/lib/site";
import { SITE } from "@/lib/site";

const ICONS = {
  tow: Truck,
  equipment: Forklift,
  flatbed: Car,
  road: TriangleAlert,
} as const;

export function PageHero({
  title,
  subtitle,
  crumbs,
}: {
  title: string;
  subtitle?: string;
  crumbs: { name: string; to: string }[];
}) {
  return (
    <section className="bg-ink text-ink-foreground">
      <div className="container-x py-12 md:py-16">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-3xl text-base text-ink-foreground/75 md:text-lg">{subtitle}</p>
        )}
        <div className="mt-7 flex flex-wrap gap-3">
          <PhoneButton label="اتصل الآن" />
          <WhatsAppButton className="border-white/25 text-ink-foreground hover:border-primary" />
        </div>
      </div>
    </section>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: { name: string; to: string }[] }) {
  return (
    <nav aria-label="مسار التصفح">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-foreground/60">
        <li>
          <Link to="/" className="hover:text-primary">
            الرئيسية
          </Link>
        </li>
        {crumbs.map((c) => (
          <li key={c.to} className="flex items-center gap-1">
            <ChevronLeft className="size-3" aria-hidden />
            <Link to={c.to} className="hover:text-primary">
              {c.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.icon];
  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary">
      <span className="grid size-12 place-items-center rounded-xl bg-orange-band text-primary-foreground">
        <Icon className="size-6" aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-extrabold">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{service.short}</p>
      <Link
        to="/services/$slug" params={{ slug: service.slug }}
        className="mt-5 inline-flex items-center gap-1 font-bold text-primary"
      >
        اطلب الخدمة
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
      </Link>
    </article>
  );
}

export function CoverageCard({ area }: { area: Coverage }) {
  return (
    <article className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary">
      <span className="flex items-center gap-2 text-primary">
        <MapPin className="size-5" aria-hidden />
        <h3 className="text-lg font-extrabold text-foreground">{area.title}</h3>
      </span>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{area.short}</p>
      <Link to="/coverage/$slug" params={{ slug: area.slug }} className="mt-5 inline-flex items-center gap-1 font-bold text-primary">
        تفاصيل التغطية
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
      </Link>
    </article>
  );
}

export function BlogCard({ post, image }: { post: Post; image: string }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:border-primary">
      <img
        src={image}
        alt={post.title}
        loading="lazy"
        className="h-48 w-full object-cover"
        width={640}
        height={360}
      />
      <div className="p-6">
        <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
          {post.category}
        </span>
        <h3 className="mt-3 text-lg font-extrabold">{post.title}</h3>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <time dateTime={post.date} className="text-muted-foreground">
            {new Date(post.date).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="inline-flex items-center gap-1 font-bold text-primary"
          >
            اقرأ المزيد
            <ArrowLeft className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function EmergencyCTA({
  title = "عطلان على الطريق؟ محتاج ونش فورًا؟",
  text = "اتصل بنا وحدد موقعك وسنساعدك في اختيار خدمة السحب أو النقل المناسبة.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="bg-orange-band">
      <div className="container-x flex flex-col items-center gap-6 py-14 text-center text-primary-foreground">
        <h2 className="max-w-3xl text-2xl font-extrabold md:text-4xl">{title}</h2>
        <p className="max-w-2xl text-base opacity-95">{text}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`tel:${SITE.phonePrimary}`}
            className="rounded-xl bg-ink px-7 py-3.5 text-base font-extrabold text-ink-foreground transition-transform hover:scale-[1.02]"
          >
            اتصل الآن
          </a>
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border-2 border-white/80 px-7 py-3.5 text-base font-extrabold text-primary-foreground transition-colors hover:bg-white/15"
          >
            واتساب
          </a>
        </div>
      </div>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 text-base leading-8 text-muted-foreground">{children}</div>
  );
}
