// app/alerts/page.tsx
"use client";

import type { Metadata } from "next";

import { useState } from "react";
import { Bell, Check } from "lucide-react";

export default function Alerts() {
  const [zip, setZip] = useState("");
  const [target, setTarget] = useState(2.5);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <>
      <section className="border-b border-border bg-hero-grad">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="font-mono text-xs uppercase tracking-widest text-yolk">
            Set & forget
          </div>
          <h1 className="mt-3 font-display text-6xl font-black md:text-7xl">
            Eggs under <span className="italic text-yolk">$X</span>
            <br />
            near you.
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            We watch the carton. You get a ping the moment a store crosses your
            line.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.2fr_1fr]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
          className="space-y-8 rounded-3xl border border-border bg-card p-10 shadow-card"
        >
          <Field label="Zip code">
            <input
              value={zip}
              onChange={(e) =>
                setZip(e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              placeholder="00000"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 font-mono outline-none focus:border-yolk"
            />
          </Field>

          <Field
            label={`Notify me when a dozen drops below $${target.toFixed(2)}`}
          >
            <input
              type="range"
              min="1.5"
              max="6"
              step="0.05"
              value={target}
              onChange={(e) => setTarget(parseFloat(e.target.value))}
              className="w-full accent-[oklch(0.85_0.18_85)]"
            />
            <div className="mt-2 flex justify-between font-mono text-xs text-muted-foreground">
              <span>$1.50</span>
              <span>$6.00</span>
            </div>
          </Field>

          <Field label="Email or phone">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@kitchen.com"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-yolk"
            />
          </Field>

          <button className="inline-flex items-center gap-2 rounded-full bg-yolk px-6 py-3 font-semibold text-primary-foreground shadow-yolk transition-transform hover:scale-105">
            {done ? (
              <>
                <Check className="h-4 w-4" /> Alert armed
              </>
            ) : (
              <>
                <Bell className="h-4 w-4" /> Arm alert
              </>
            )}
          </button>

          {done && (
            <div className="rounded-2xl border border-yolk/40 bg-yolk/10 p-4 font-mono text-sm text-yolk">
              Watching {zip || "your area"} for cartons under $
              {target.toFixed(2)}. We'll ping {email || "you"}.
            </div>
          )}
        </form>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="font-mono text-xs uppercase text-yolk">
              Recent triggers
            </div>
            <ul className="mt-4 space-y-4 text-sm">
              {[
                ["Aldi · 30303", "$2.18", "2 hrs ago"],
                ["Walmart · 77024", "$2.46", "yesterday"],
                ["Costco · 94110", "$5.49 / 24-pack", "2 days ago"],
              ].map(([a, b, c]) => (
                <li key={a} className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-base font-bold">{a}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {c}
                    </div>
                  </div>
                  <div className="font-display text-lg font-black text-yolk">
                    {b}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-yolk-grad p-6 text-primary-foreground">
            <div className="font-mono text-xs uppercase">Pro tip</div>
            <div className="mt-2 font-display text-2xl font-black leading-tight">
              Set $0.20 below your local average. You'll get pinged 1–2× per
              week without spam.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}
