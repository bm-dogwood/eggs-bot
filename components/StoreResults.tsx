"use client";

import { useState, useCallback } from "react";
import { Search, RefreshCw, ExternalLink, MapPin, Info } from "lucide-react";
import type { StorePrice, EggType } from "@/lib/types";
import { getMockStorePrices } from "@/lib/api";
import { formatPrice, formatPricePerEgg } from "@/lib/utils";

const EGG_TYPES: { value: EggType; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "conventional", label: "Conventional" },
  { value: "cage-free", label: "Cage-Free" },
  { value: "free-range", label: "Free-Range" },
  { value: "organic", label: "Organic" },
  { value: "pasture-raised", label: "Pasture-Raised" },
];

export default function StoreResults() {
  const [zip, setZip] = useState("");
  const [eggType, setEggType] = useState<EggType>("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<StorePrice[] | null>(null);
  const [searchedZip, setSearchedZip] = useState("");

  const search = useCallback(async () => {
    if (zip.length < 5) return;
    setLoading(true);
    setSearchedZip(zip);

    // In production, call /api/store-prices?zip=...&type=...
    // which runs getStorePrices() server-side with Kroger API
    await new Promise((r) => setTimeout(r, 850));

    setLoading(false);
  }, [zip, eggType]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") search();
  };

  const cheapest = results?.[0];

  return (
    <div>
      {/* Search bar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <div style={{ position: "relative" }}>
          <MapPin
            size={14}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
            }}
          />
          <input
            className="input"
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
            onKeyDown={handleKey}
            placeholder="ZIP code"
            style={{ paddingLeft: 32, width: 140 }}
          />
        </div>
        <select
          className="input"
          value={eggType}
          onChange={(e) => setEggType(e.target.value as EggType)}
          style={{ width: 150 }}
        >
          {EGG_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          className="btn"
          onClick={search}
          disabled={zip.length < 5 || loading}
        >
          {loading ? (
            <RefreshCw size={13} className="spin" />
          ) : (
            <Search size={13} />
          )}
          {loading ? "Searching…" : "Compare Stores"}
        </button>
      </div>

      {/* Loading shimmer */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="shimmer" style={{ height: 56 }} />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && results && (
        <div className="fade-in">
          {cheapest && (
            <div
              style={{
                background: "#f0fdf4",
                border: "0.5px solid #bbf7d0",
                borderRadius: 9,
                padding: "9px 14px",
                marginBottom: 10,
                fontSize: 12.5,
                color: "#15803d",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              🏆 Best near {searchedZip}: <strong>{cheapest.store}</strong> —{" "}
              {formatPrice(cheapest.price)}/dz (
              {formatPricePerEgg(cheapest.pricePerEgg)}/egg)
            </div>
          )}

          <div className="card">
            {results.map((s, i) => (
              <a
                key={s.store}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`store-row${i === 0 ? " best" : ""}`}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 7,
                    background: "#f9fafb",
                    border: "0.5px solid #e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {s.logo}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {s.store}
                    </span>
                    {i === 0 && <span className="chip chip-green">Best</span>}
                    {s.source === "api" && (
                      <span className="chip chip-amber">Live price</span>
                    )}
                    {s.source === "estimated" && (
                      <span className="chip chip-gray">Estimate</span>
                    )}
                    {s.source === "scraped" && (
                      <span className="chip chip-blue">Scraped</span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>{s.size}</span>
                    {s.distance && (
                      <span>· {s.distance.toFixed(1)} mi away</span>
                    )}
                    {s.note && <span>· {s.note}</span>}
                  </div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: i === 0 ? "#15803d" : "#111827",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {formatPrice(s.price)}
                  </div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af" }}>
                    {formatPricePerEgg(s.pricePerEgg)}/egg
                  </div>
                </div>

                <ExternalLink
                  size={12}
                  style={{ color: "#d1d5db", flexShrink: 0 }}
                />
              </a>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10.5,
              color: "#d1d5db",
              marginTop: 8,
            }}
          >
            <Info size={10} />
            Kroger: live API data. Others: regional estimates. Always verify
            in-store before purchasing.
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !results && (
        <div
          style={{
            padding: "32px 20px",
            textAlign: "center",
            color: "#9ca3af",
            fontSize: 13,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>📍</div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Enter a ZIP code to get started
          </div>
          <div style={{ fontSize: 12 }}>
            We&apos;ll compare egg prices at Aldi, Walmart, Kroger, Target &
            Costco near you
          </div>
        </div>
      )}
    </div>
  );
}
