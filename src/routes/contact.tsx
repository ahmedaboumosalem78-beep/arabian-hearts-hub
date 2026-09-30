import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, MessageCircle, Clock, MapPin } from "lucide-react";
import { pageMeta } from "@/lib/seo";
import { SITE, telPrimary, telSecondary, whatsappLink } from "@/lib/site";
import { PageHero } from "@/components/site/Sections";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageMeta({
      title: "اتصل بنا | ونش إنقاذ الإسماعيلية 24 ساعة",
      description:
        "تواصل مع ونش إنقاذ الإسماعيلية على 01231035306 أو 01231035305 أو عبر واتساب لطلب سحب سيارة أو نقل معدة ثقيلة.",
      path: "/contact",
    }),
  component: Contact,
});

const SERVICE_OPTIONS = [
  "سحب سيارة",
  "نقل سيارة",
  "ونش إنقاذ",
  "نقل معدات ثقيلة",
  "خدمة أخرى",
];

type Errors = Partial<Record<"name" | "phone" | "service" | "location", string>>;

function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const service = String(data.get("service") ?? "");
    const location = String(data.get("location") ?? "").trim();
    const details = String(data.get("details") ?? "").trim();

    const next: Errors = {};
    if (name.length < 2) next.name = "من فضلك اكتب اسمك.";
    if (!/^01[0-9]{9}$/.test(phone)) next.phone = "اكتب رقم موبايل مصري صحيح (11 رقم).";
    if (!service) next.service = "اختر نوع الخدمة.";
    if (location.length < 2) next.location = "حدد موقعك الحالي.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // ملاحظة: لا يوجد بريد/سيرفر موصول بالنموذج حاليًا، لذلك نحوّل الطلب إلى واتساب.
    const text = `طلب خدمة من الموقع%0Aالاسم: ${name}%0Aالهاتف: ${phone}%0Aالخدمة: ${service}%0Aالموقع: ${location}%0Aالتفاصيل: ${details || "-"}`;
    window.open(`https://wa.me/${SITE.whatsapp}?text=${text}`, "_blank", "noopener");
    setSent(true);
  }

  const field =
    "mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-ring/30";

  return (
    <>
      <PageHero
        title="اتصل بنا"
        subtitle="متاحون على مدار الساعة لطلبات الإنقاذ والسحب ونقل المعدات."
        crumbs={[{ name: "اتصل بنا", to: "/contact" }]}
      />

      <section className="section bg-background">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="space-y-4">
            <a
              href={telPrimary}
              className="flex items-center gap-3 rounded-2xl border border-border p-5 shadow-card hover:border-primary"
            >
              <Phone className="size-6 text-primary" aria-hidden />
              <span>
                <span className="block text-sm text-muted-foreground">الرقم الأساسي</span>
                <span dir="ltr" className="block text-xl font-extrabold">
                  {SITE.phonePrimary}
                </span>
              </span>
            </a>
            <a
              href={telSecondary}
              className="flex items-center gap-3 rounded-2xl border border-border p-5 shadow-card hover:border-primary"
            >
              <Phone className="size-6 text-primary" aria-hidden />
              <span>
                <span className="block text-sm text-muted-foreground">رقم إضافي</span>
                <span dir="ltr" className="block text-xl font-extrabold">
                  {SITE.phoneSecondary}
                </span>
              </span>
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-orange-band p-5 text-primary-foreground shadow-glow"
            >
              <MessageCircle className="size-6" aria-hidden />
              <span className="text-lg font-extrabold">تواصل عبر واتساب</span>
            </a>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 text-primary" aria-hidden />
              خدمة على مدار 24 ساعة طوال أيام الأسبوع
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" aria-hidden />
              الإسماعيلية، العاشر من رمضان، محور 30 يونيو، طريق القاهرة الإسماعيلية
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-border p-6 shadow-card">
            <h2 className="text-xl font-extrabold">اطلب الخدمة</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              املأ البيانات وسيتم تحويل طلبك إلى واتساب مباشرة.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold">
                الاسم
                <input name="name" className={field} placeholder="اسمك" />
                {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
              </label>
              <label className="text-sm font-bold">
                رقم الهاتف
                <input
                  name="phone"
                  inputMode="tel"
                  dir="ltr"
                  className={field}
                  placeholder="01xxxxxxxxx"
                />
                {errors.phone && <span className="text-xs text-destructive">{errors.phone}</span>}
              </label>
              <label className="text-sm font-bold">
                نوع الخدمة
                <select name="service" className={field} defaultValue="">
                  <option value="" disabled>
                    اختر الخدمة
                  </option>
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <span className="text-xs text-destructive">{errors.service}</span>
                )}
              </label>
              <label className="text-sm font-bold">
                الموقع
                <input name="location" className={field} placeholder="المدينة / الطريق" />
                {errors.location && (
                  <span className="text-xs text-destructive">{errors.location}</span>
                )}
              </label>
              <label className="text-sm font-bold sm:col-span-2">
                تفاصيل الطلب
                <textarea
                  name="details"
                  rows={4}
                  className={field}
                  placeholder="نوع السيارة أو المعدة وحالة العطل"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-orange-band px-6 py-4 text-lg font-extrabold text-primary-foreground shadow-glow"
            >
              إرسال الطلب عبر واتساب
            </button>

            {sent && (
              <p className="mt-4 rounded-xl bg-accent p-3 text-sm font-bold text-accent-foreground">
                تم تجهيز رسالتك. أكمل الإرسال من نافذة واتساب، أو اتصل بنا مباشرة.
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
