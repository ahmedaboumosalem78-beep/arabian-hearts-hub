import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, Clock } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";
import { NAV, SITE, telPrimary, telSecondary } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-ink text-ink-foreground md:block">
        <div className="container-x flex items-center justify-between py-2 text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <Clock className="size-4 text-primary" aria-hidden />
            طوارئ الطريق 24/7 — اتصل بنا الآن
          </p>
          <div className="flex items-center gap-4 font-bold">
            <a href={telPrimary} className="flex items-center gap-1 hover:text-primary">
              <Phone className="size-4 text-primary" aria-hidden />
              <span dir="ltr">{SITE.phonePrimary}</span>
            </a>
            <a href={telSecondary} className="flex items-center gap-1 hover:text-primary">
              <Phone className="size-4 text-primary" aria-hidden />
              <span dir="ltr">{SITE.phoneSecondary}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container-x grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src={logo.url}
              alt={`${SITE.brandAr} - ${SITE.nameAr}`}
              className="size-12 shrink-0 rounded-full object-contain sm:size-14"
              width={56}
              height={56}
            />
            <span className="min-w-0">
              <span className="block truncate text-base font-extrabold sm:text-lg">
                {SITE.nameAr}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {SITE.brandAr} — {SITE.tagline}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary" }}
                className="rounded-lg px-3 py-2 text-sm font-bold transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={telPrimary}
              className="mr-2 inline-flex items-center gap-2 rounded-xl bg-orange-band px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-glow"
            >
              <Phone className="size-4" aria-hidden />
              اتصل للإنقاذ
            </a>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={telPrimary}
              aria-label="اتصل الآن"
              className="grid size-11 place-items-center rounded-xl bg-orange-band text-primary-foreground"
            >
              <Phone className="size-5" aria-hidden />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={open}
              className="grid size-11 place-items-center rounded-xl border border-border"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-border bg-background lg:hidden" aria-label="قائمة الجوال">
            <div className="container-x flex flex-col py-2">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-primary" }}
                  className="border-b border-border/60 py-3 font-bold last:border-0"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
