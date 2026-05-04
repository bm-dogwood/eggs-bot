// app/api/eggs/route.ts
import { NextResponse } from "next/server";
import { fetchEggPrices, getMockEggPrices } from "@/lib/api";

export const revalidate = 86400; // Cache 24 hours

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startYear = searchParams.get("startYear") || "2024";
  const endYear =
    searchParams.get("endYear") || new Date().getFullYear().toString();

  try {
    const prices = await fetchEggPrices(startYear, endYear);
    return NextResponse.json({
      success: true,
      source: "BLS CPI",
      series: "APU0000708111",
      data: prices,
      count: prices.length,
    });
  } catch (err) {
    console.warn("BLS fetch failed, using mock data:", err);
    const prices = getMockEggPrices();
    return NextResponse.json({
      success: true,
      source: "fallback",
      series: "APU0000708111",
      data: prices,
      count: prices.length,
    });
  }
}
