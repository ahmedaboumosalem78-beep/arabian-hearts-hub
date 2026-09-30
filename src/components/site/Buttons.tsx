import { Phone, MessageCircle } from "lucide-react";
import { SITE, telPrimary, telSecondary, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function PhoneButton({
  secondary = false,
  className,
  label,
}: {
  secondary?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={secondary ? telSecondary : telPrimary}
      aria-label={`اتصل على ${secondary ? SITE.phoneSecondary : SITE.phonePrimary}`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-orange-band px-6 py-3 text-base font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-95",
        className,
      )}
    >
      <Phone className="size-5 shrink-0" aria-hidden />
      <span dir="ltr" className="tabular-nums">
        {label ?? (secondary ? SITE.phoneSecondary : SITE.phonePrimary)}
      </span>
    </a>
  );
}

export function WhatsAppButton({
  className,
  label = "واتساب",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary bg-transparent px-6 py-3 text-base font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground",
        className,
      )}
    >
      <MessageCircle className="size-5 shrink-0" aria-hidden />
      {label}
    </a>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-20 left-4 z-50 grid size-14 place-items-center rounded-full bg-orange-band text-primary-foreground shadow-glow md:bottom-6"
    >
      <MessageCircle className="size-7" aria-hidden />
    </a>
  );
}

export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-px border-t border-border bg-ink md:hidden">
      <a
        href={telPrimary}
        className="flex items-center justify-center gap-2 bg-orange-band py-4 font-bold text-primary-foreground"
      >
        <Phone className="size-5" aria-hidden />
        اتصل الآن
      </a>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-4 font-bold text-ink-foreground"
      >
        <MessageCircle className="size-5" aria-hidden />
        واتساب
      </a>
    </div>
  );
}
