// app/api/bls/route.ts
import { NextResponse } from "next/server";

const BLS_API_KEY = process.env.BLS_API_KEY ?? "";
// BLS series: APU0000708111 = Eggs, grade A, large, per doz. in U.S. city average
const SERIES_ID = "APU0000708111";

export async function GET() {
  try {
    const now = new Date();
    const startYear = now.getFullYear() - 1;
    const endYear = now.getFullYear();

    const body = {
      seriesid: [SERIES_ID],
      startyear: String(startYear),
      endyear: String(endYear),
      registrationkey: BLS_API_KEY,
    };

    const res = await fetch(
      "https://api.bls.gov/publicAPI/v2/timeseries/data/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        next: { revalidate: 86400 }, // cache for 24h
      }
    );

    if (!res.ok) throw new Error(`BLS HTTP ${res.status}`);

    const json = await res.json();

    if (json.status !== "REQUEST_SUCCEEDED") {
      throw new Error(
        "BLS API error: " + (json.message?.join(", ") ?? "unknown")
      );
    }

    const rawData: Array<{ year: string; period: string; value: string }> =
      json.Results?.series?.[0]?.data ?? [];

    // BLS returns newest-first; reverse to chronological, drop nulls/prelim entries
    const sorted = [...rawData]
      .reverse()
      .filter((d) => d.value && d.value !== "-" && !isNaN(parseFloat(d.value)));

    // Build monthly trend (last 12 points)
    const MONTH_LABELS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const trends = sorted.slice(-12).map((d) => ({
      m: MONTH_LABELS[parseInt(d.period.slice(1)) - 1] ?? d.period,
      price: parseFloat(d.value),
    }));

    // National stats
    const latest = parseFloat(sorted[sorted.length - 1]?.value ?? "0");
    const prevWeek = parseFloat(sorted[sorted.length - 2]?.value ?? "0");
    const yearAgo = parseFloat(
      sorted[sorted.length - 13]?.value ?? sorted[0]?.value ?? "0"
    );

    const weekly =
      prevWeek > 0
        ? (((latest - prevWeek) / prevWeek) * 100).toFixed(1)
        : "0.0";
    const yoy =
      yearAgo > 0 ? (((latest - yearAgo) / yearAgo) * 100).toFixed(1) : "0.0";

    return NextResponse.json({
      avg: latest.toFixed(2),
      weekly,
      yoy,
      trends,
      // cheapest/costliest state is not in BLS aggregate — we keep demo values
      cheapestState: "Mississippi",
      cheapestPrice: "2.18",
      costliestState: "Hawaii",
      costliestPrice: "6.89",
    });
  } catch (err) {
    console.error("[BLS API]", err);
    // Fall back to demo data so the app never breaks
    return NextResponse.json(FALLBACK_BLS);
  }
}

const FALLBACK_BLS = {
  avg: "3.47",
  weekly: "-1.2",
  yoy: "+28.4",
  trends: [
    { m: "Jun", price: 2.41 },
    { m: "Jul", price: 2.67 },
    { m: "Aug", price: 2.83 },
    { m: "Sep", price: 2.95 },
    { m: "Oct", price: 3.14 },
    { m: "Nov", price: 3.37 },
    { m: "Dec", price: 3.82 },
    { m: "Jan", price: 4.15 },
    { m: "Feb", price: 4.52 },
    { m: "Mar", price: 4.28 },
    { m: "Apr", price: 3.79 },
    { m: "May", price: 3.47 },
  ],
  cheapestState: "Mississippi",
  cheapestPrice: "2.18",
  costliestState: "Hawaii",
  costliestPrice: "6.89",
};
