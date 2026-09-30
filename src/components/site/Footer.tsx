import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Clock } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";
import { COVERAGE, SERVICES, SITE, telPrimary, telSecondary } from "@/lib/site";

export function Footer() {
  return (
    <footer className="stripe-top bg-ink pb-24 text-ink-foreground md:pb-0">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <img
            src={logo.url}
            alt={SITE.nameAr}
            className="size-20 rounded-full object-contain"
            width={80}
            height={80}
            loading="lazy"
          />
          <h2 className="mt-4 text-lg font-extrabold">{SITE.nameAr}</h2>
          <p className="mt-2 text-sm text-ink-foreground/70">
            خدمة إنقاذ وسحب السيارات ونقل المعدات الثقيلة في الإسماعيلية والعاشر من رمضان
            والمحاور الرئيسية.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-base font-extrabold text-primary">خدماتنا</h2>
          <ul className="space-y-2 text-sm">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to={s.to} className="hover:text-primary">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-base font-extrabold text-primary">مناطق التغطية</h2>
          <ul className="space-y-2 text-sm">
            {COVERAGE.map((c) => (
              <li key={c.slug}>
                <Link to={c.to} className="hover:text-primary">
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/blog" className="hover:text-primary">
                المدونة
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                من نحن
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-base font-extrabold text-primary">تواصل معنا</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={telPrimary} className="flex items-center gap-2 font-bold hover:text-primary">
                <Phone className="size-4 text-primary" aria-hidden />
                <span dir="ltr">{SITE.phonePrimary}</span>
              </a>
            </li>
            <li>
              <a href={telSecondary} className="flex items-center gap-2 font-bold hover:text-primary">
                <Phone className="size-4 text-primary" aria-hidden />
                <span dir="ltr">{SITE.phoneSecondary}</span>
              </a>
            </li>
            <li className="flex items-center gap-2 text-ink-foreground/70">
              <MapPin className="size-4 text-primary" aria-hidden />
              الإسماعيلية والعاشر من رمضان والطرق المؤدية إليها
            </li>
            <li className="flex items-center gap-2 text-ink-foreground/70">
              <Clock className="size-4 text-primary" aria-hidden />
              خدمة على مدار 24 ساعة طوال أيام الأسبوع
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-5 text-center text-xs text-ink-foreground/60">
          © {new Date().getFullYear()} {SITE.nameAr} — {SITE.brandAr}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
