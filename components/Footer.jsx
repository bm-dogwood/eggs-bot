// components/site/Footer.tsx
import Link from "next/link";
import { TICKER } from "@/lib/eggs-data";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-3xl font-black">
            EGGS<span className="text-yolk">.</span>BOT
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Independent price intelligence for the most volatile carton in the
            grocery aisle. Data from USDA, BLS, Kroger, Walmart and
            on-the-ground scrapes.
          </p>
        </div>
        <div>
          <div className="mb-3 font-mono text-xs uppercase text-muted-foreground">
            Tools
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/finder" className="hover:text-yolk">
                Zip finder
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-yolk">
                Yolk Index
              </Link>
            </li>
            <li>
              <Link href="/alerts" className="hover:text-yolk">
                Price alerts
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-mono text-xs uppercase text-muted-foreground">
            Read
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/types" className="hover:text-yolk">
                Egg types
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-yolk">
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center font-mono text-xs text-muted-foreground">
        © {new Date().getFullYear()} EGGS.BOT — not affiliated with any
        retailer. Prices indicative.
      </div>
    </footer>
  );
}
