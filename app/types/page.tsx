// app/types/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

import { EGG_TYPES } from "@/lib/eggs-data";
import eggCarton from "@/public/cartoon.jpeg";
import eggWhite from "@/public/white.jpeg";

export default function TypesPage() {
  const [active, setActive] = useState(EGG_TYPES[0].id);
  const activeType = EGG_TYPES.find((t) => t.id === active)!;

  return (
    <>
      <section className="border-b border-border bg-hero-grad">
        <div className="mx-auto grid max-w-7xl items-end gap-12 px-6 py-20 md:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-yolk">
              The carton spectrum
            </div>
            <h1 className="mt-3 font-display text-6xl font-black md:text-7xl">
              Five labels.
              <br />
              <span className="italic text-yolk">One bird.</span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              A guide to what those words on the carton actually mean — and what
              they cost.
            </p>
          </div>
          <Image
            src={eggCarton}
            alt="Carton of brown eggs"
            width={1280}
            height={896}
            priority
            className="rounded-3xl shadow-card"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {EGG_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setActive(type.id)}
              className={`rounded-full border px-5 py-2 font-semibold transition-all ${
                active === type.id
                  ? "border-yolk bg-yolk text-primary-foreground shadow-yolk"
                  : "border-border bg-card text-muted-foreground hover:border-yolk hover:text-foreground"
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div className="relative">
            <Image
              src={eggWhite}
              alt="Glowing egg"
              width={896}
              height={896}
              className="rounded-3xl shadow-yolk"
            />
            <div className="absolute bottom-4 left-4 rounded-2xl border border-border bg-card/90 px-4 py-3 backdrop-blur">
              <div className="font-mono text-xs uppercase text-muted-foreground">
                avg. national
              </div>
              <div className="font-display text-3xl font-black">
                ${activeType.avg}
              </div>
            </div>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-yolk">
              {activeType.name}
            </div>
            <h2 className="mt-2 font-display text-5xl font-black">
              {activeType.blurb}
            </h2>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {EGG_TYPES.map((type) => (
                <div
                  key={type.id}
                  className={`rounded-2xl border p-4 ${
                    type.id === activeType.id
                      ? "border-yolk bg-yolk/10"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="font-mono text-xs uppercase text-muted-foreground">
                    {type.name}
                  </div>
                  <div className="mt-2 font-display text-2xl font-black">
                    ${type.avg}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-border bg-card p-6">
              <div className="font-mono text-xs uppercase tracking-widest text-yolk">
                Premium math
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Pasture-raised costs{" "}
                <span className="font-display text-yolk">
                  {((EGG_TYPES[4].avg / EGG_TYPES[0].avg - 1) * 100).toFixed(0)}
                  %
                </span>{" "}
                more than conventional. That&apos;s roughly an extra{" "}
                <span className="font-display text-yolk">
                  ${(EGG_TYPES[4].avg - EGG_TYPES[0].avg).toFixed(2)}
                </span>{" "}
                per dozen, or{" "}
                <span className="font-display text-yolk">
                  ${((EGG_TYPES[4].avg - EGG_TYPES[0].avg) * 52).toFixed(0)}
                  /yr
                </span>{" "}
                if your household eats one carton a week.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
