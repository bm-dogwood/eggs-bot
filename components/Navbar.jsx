// components/site/Nav.tsx
"use client";

import { TICKER } from "@/lib/eggs-data";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/finder", label: "Finder" },
  { href: "/dashboard", label: "Yolk Index" },
  { href: "/types", label: "Types" },
  { href: "/alerts", label: "Alerts" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="relative inline-flex h-8 w-7 items-center justify-center rounded-[60%/70%] bg-yolk-grad shadow-yolk transition-transform group-hover:rotate-12">
            <span className="absolute inset-1 rounded-[60%/70%] bg-yolk-grad opacity-90" />
          </span>
          <span className="font-display text-2xl font-black tracking-tight">
            EGGS<span className="text-yolk">.</span>BOT
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                  active
                    ? "bg-yolk text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/finder"
          className="rounded-full bg-yolk px-4 py-2 text-sm font-semibold text-primary-foreground shadow-yolk transition-transform hover:scale-105"
        >
          Find cheap eggs
        </Link>
      </div>
      <div className="overflow-hidden border-b border-border/60 bg-yolk py-3 text-primary-foreground">
        <div className="flex w-max animate-ticker gap-12 whitespace-nowrap font-mono text-sm">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-primary-foreground" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
