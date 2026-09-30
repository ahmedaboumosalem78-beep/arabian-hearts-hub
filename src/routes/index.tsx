import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, ShieldCheck, Clock, Gauge, MapPin, ArrowLeft } from "lucide-react";
import work2 from "@/assets/work-2.jpg";
import work4 from "@/assets/work-4.jpg";
import work5 from "@/assets/work-5.jpg";
import work6 from "@/assets/work-6.jpg";
import { COVERAGE, SERVICES, SITE, TRUST, telSecondary } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { PhoneButton, WhatsAppButton } from "@/components/site/Buttons";
import {
  CoverageCard,
  EmergencyCTA,
  ServiceCard,
} from "@/components/site/Sections";

export const Route = createFileRoute("/")({
  head: () =>
    pageMeta({
      title: "ونش انقاذ الاسماعيلية | سحب سيارات ونقل معدات ثقيلة 24 ساعة",
      description:
        "ونش إنقاذ الإسماعيلية لسحب ونقل السيارات والسطحة ونقل المعدات الثقيلة في الإسماعيلية والعاشر من رمضان ومحور 30 يونيو. اتصل الآن على مدار الساعة.",
      path: "/",
    }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <img
          src={work4}
          alt="سطحة نقل معدات ثقيلة تابعة لونش إنقاذ الإسماعيلية"
          className="absolute inset-0 size-full object-cover opacity-35"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 bg-gradient-to-l from-[oklch(0.16_0.006_250/0.96)] via-[oklch(0.16_0.006_250/0.85)] to-[oklch(0.16_0.006_250/0.45)]"
          aria-hidden
        />
        <div className="relative container-x py-16 md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-band px-4 py-1.5 text-sm font-bold text-primary-foreground">
            <Clock className="size-4" aria-hidden />
            طوارئ الطريق 24/7
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight md:text-6xl">
            ونش إنقاذ الإسماعيلية
            <span className="block text-gradient-orange">نوصلك أينما كنت</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-bold text-primary md:text-2xl">
            إنقاذ وسحب السيارات ونقل المعدات الثقيلة على مدار الساعة
          </p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-ink-foreground/80">
            خدمة ونش وسحب سيارات احترافية في الإسماعيلية والعاشر من رمضان ومحور 30 يونيو
            وطريق القاهرة الإسماعيلية، بالإضافة إلى نقل المعدات الثقيلة بأمان وسرعة.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <PhoneButton label="اتصل الآن" className="px-8 py-4 text-lg" />
            <WhatsAppButton className="px-8 py-4 text-lg" />
            <a
              href={telSecondary}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-4 font-bold text-ink-foreground hover:border-primary"
            >
              <Phone className="size-5 text-primary" aria-hidden />
              <span dir="ltr">{SITE.phoneSecondary}</span>
            </a>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
            {TRUST.map((t) => (
              <li
                key={t.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur"
              >
                <p className="text-lg font-extrabold text-primary">{t.title}</p>
                <p className="mt-1 text-sm text-ink-foreground/70">{t.sub}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <EmergencyCTA />

      <section className="section bg-background">
        <div className="container-x">
          <header className="max-w-2xl">
            <p className="font-bold text-primary">خدماتنا</p>
            <h2 className="mt-2 text-2xl font-extrabold md:text-4xl">
              إنقاذ وسحب ونقل — خدمة واحدة لكل حالات الطريق
            </h2>
            <p className="mt-3 leading-8 text-muted-foreground">
              نغطي احتياجات السيارات الملاكي والمركبات والمعدات الثقيلة داخل المدن وعلى
              الطرق السريعة.
            </p>
          </header>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink text-ink-foreground">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="font-bold text-primary">المعدات الثقيلة</p>
            <h2 className="mt-2 text-2xl font-extrabold md:text-4xl">
              ونش نقل معدات ثقيلة في الإسماعيلية والعاشر من رمضان
            </h2>
            <p className="mt-4 leading-8 text-ink-foreground/75">
              ننقل المعدات والآلات الثقيلة من وإلى مواقع العمل والمصانع والمناطق الصناعية،
              مع اختيار طريقة التحميل والتثبيت المناسبة لكل مهمة.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                "نقل المعدات الصناعية",
                "معدات البناء",
                "المعدات الزراعية",
                "الماكينات",
                "المعدات داخل المناطق الصناعية",
                "النقل بين المحافظات",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <PhoneButton label="اطلب نقل معدة" />
              <Link
                to="/services/$slug"
                params={{ slug: "heavy-equipment-transport" }}
                className="inline-flex items-center gap-1 rounded-xl border border-white/25 px-6 py-3 font-bold hover:border-primary"
              >
                تفاصيل الخدمة
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[work4, work2, work5, work6].map((img, i) => (
              <img
                key={i}
                src={img}
                alt="نقل معدات ثقيلة بسطحة"
                loading="lazy"
                className="h-40 w-full rounded-2xl object-cover md:h-52"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container-x">
          <header className="max-w-2xl">
            <p className="font-bold text-primary">مناطق التغطية</p>
            <h2 className="mt-2 text-2xl font-extrabold md:text-4xl">
              أينما تعطلت.. نصل إليك
            </h2>
          </header>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COVERAGE.map((c) => (
              <CoverageCard key={c.slug} area={c} />
            ))}
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {["طريق الإسماعيلية", "المناطق الصناعية", "الطرق السريعة والمحاور الرئيسية"].map(
              (x) => (
                <li
                  key={x}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold"
                >
                  <MapPin className="size-4 text-primary" aria-hidden />
                  {x}
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      <section className="section bg-background">
        <div className="container-x grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Clock,
              title: "متاحون 24 ساعة",
              text: "نستقبل طلبات الطوارئ في أي وقت خلال اليوم طوال أيام الأسبوع.",
            },
            {
              icon: Gauge,
              title: "استجابة سريعة",
              text: "نتحرك فور تحديد موقعك ونوع الخدمة المطلوبة لتقليل وقت الانتظار.",
            },
            {
              icon: ShieldCheck,
              title: "نقل آمن",
              text: "تحميل وتثبيت مناسب لكل نوع سيارة أو معدة للحفاظ عليها أثناء النقل.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-border p-6 shadow-card">
              <Icon className="size-8 text-primary" aria-hidden />
              <h2 className="mt-4 text-lg font-extrabold">{title}</h2>
              <p className="mt-2 leading-7 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <EmergencyCTA
        title="اتصل بنا الآن واطلب أقرب ونش"
        text="رقمان متاحان طوال اليوم لخدمتك في الإسماعيلية والعاشر من رمضان والطرق المحيطة."
      />
    </>
  );
}
