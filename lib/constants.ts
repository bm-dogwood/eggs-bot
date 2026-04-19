import type { EggPricePoint, SeasonalDataPoint, EggType } from "./types";

// ─── BLS Historical Price Data ───────────────────────────────────────────────
// Source: BLS CPI Series APU0000708111 — Grade A large eggs, per dozen
export const PRICE_HISTORY: EggPricePoint[] = [
  // 2019
  { period: "January", year: "2019", price: 1.21 },
  { period: "February", year: "2019", price: 1.18 },
  { period: "March", year: "2019", price: 1.17 },
  { period: "April", year: "2019", price: 1.15 },
  { period: "May", year: "2019", price: 1.09 },
  { period: "June", year: "2019", price: 1.05 },
  { period: "July", year: "2019", price: 1.01 },
  { period: "August", year: "2019", price: 1.03 },
  { period: "September", year: "2019", price: 1.08 },
  { period: "October", year: "2019", price: 1.17 },
  { period: "November", year: "2019", price: 1.28 },
  { period: "December", year: "2019", price: 1.4 },
  // 2020
  { period: "January", year: "2020", price: 1.32 },
  { period: "February", year: "2020", price: 1.28 },
  { period: "March", year: "2020", price: 1.65 },
  { period: "April", year: "2020", price: 1.55 },
  { period: "May", year: "2020", price: 1.41 },
  { period: "June", year: "2020", price: 1.25 },
  { period: "July", year: "2020", price: 1.19 },
  { period: "August", year: "2020", price: 1.1 },
  { period: "September", year: "2020", price: 1.18 },
  { period: "October", year: "2020", price: 1.35 },
  { period: "November", year: "2020", price: 1.48 },
  { period: "December", year: "2020", price: 1.65 },
  // 2021
  { period: "January", year: "2021", price: 1.72 },
  { period: "February", year: "2021", price: 1.68 },
  { period: "March", year: "2021", price: 1.61 },
  { period: "April", year: "2021", price: 1.55 },
  { period: "May", year: "2021", price: 1.42 },
  { period: "June", year: "2021", price: 1.28 },
  { period: "July", year: "2021", price: 1.22 },
  { period: "August", year: "2021", price: 1.3 },
  { period: "September", year: "2021", price: 1.48 },
  { period: "October", year: "2021", price: 1.71 },
  { period: "November", year: "2021", price: 1.94 },
  { period: "December", year: "2021", price: 2.18 },
  // 2022 — HPAI wave hits
  { period: "January", year: "2022", price: 2.55 },
  { period: "February", year: "2022", price: 2.41 },
  { period: "March", year: "2022", price: 2.88 },
  { period: "April", year: "2022", price: 3.22 },
  { period: "May", year: "2022", price: 3.48 },
  { period: "June", year: "2022", price: 3.81 },
  { period: "July", year: "2022", price: 4.01 },
  { period: "August", year: "2022", price: 3.92 },
  { period: "September", year: "2022", price: 3.74 },
  { period: "October", year: "2022", price: 4.17 },
  { period: "November", year: "2022", price: 4.89 },
  { period: "December", year: "2022", price: 5.78 },
  // 2023 — All-time high, then recovery
  { period: "January", year: "2023", price: 6.5 },
  { period: "February", year: "2023", price: 5.9 },
  { period: "March", year: "2023", price: 4.6 },
  { period: "April", year: "2023", price: 3.91 },
  { period: "May", year: "2023", price: 3.35 },
  { period: "June", year: "2023", price: 3.01 },
  { period: "July", year: "2023", price: 2.82 },
  { period: "August", year: "2023", price: 2.74 },
  { period: "September", year: "2023", price: 2.91 },
  { period: "October", year: "2023", price: 3.12 },
  { period: "November", year: "2023", price: 3.38 },
  { period: "December", year: "2023", price: 3.65 },
  // 2024
  { period: "January", year: "2024", price: 3.95 },
  { period: "February", year: "2024", price: 4.21 },
  { period: "March", year: "2024", price: 4.18 },
  { period: "April", year: "2024", price: 3.97 },
  { period: "May", year: "2024", price: 3.75 },
  { period: "June", year: "2024", price: 3.61 },
  { period: "July", year: "2024", price: 3.48 },
  { period: "August", year: "2024", price: 3.52 },
  { period: "September", year: "2024", price: 3.71 },
  { period: "October", year: "2024", price: 3.89 },
  { period: "November", year: "2024", price: 4.12 },
  { period: "December", year: "2024", price: 4.35 },
  // 2025 (YTD)
  { period: "January", year: "2025", price: 4.5 },
  { period: "February", year: "2025", price: 4.38 },
  { period: "March", year: "2025", price: 4.31 },
  { period: "April", year: "2025", price: 4.25 },
];

// ─── Seasonal Averages (5-year) ──────────────────────────────────────────────
export const SEASONAL_DATA: SeasonalDataPoint[] = [
  { month: "Jan", price: 5.1, demand: "High" },
  { month: "Feb", price: 4.8, demand: "High" },
  { month: "Mar", price: 4.2, demand: "Med" },
  { month: "Apr", price: 3.9, demand: "Med" },
  { month: "May", price: 3.6, demand: "Low" },
  { month: "Jun", price: 3.4, demand: "Low" },
  { month: "Jul", price: 3.5, demand: "Low" },
  { month: "Aug", price: 3.7, demand: "Med" },
  { month: "Sep", price: 3.9, demand: "Med" },
  { month: "Oct", price: 4.1, demand: "Med" },
  { month: "Nov", price: 4.6, demand: "High" },
  { month: "Dec", price: 5.3, demand: "High" },
];

// ─── Egg Type metadata ───────────────────────────────────────────────────────
export const EGG_TYPE_INFO: Record<
  Exclude<EggType, "all">,
  {
    label: string;
    emoji: string;
    priceLow: number;
    priceHigh: number;
    multiplier: string;
    space: string;
    outdoorAccess: "None" | "Some" | "Full";
    feed: string;
    welfareScore: number; // 1-5
    description: string;
  }
> = {
  conventional: {
    label: "Conventional",
    emoji: "🥚",
    priceLow: 2.5,
    priceHigh: 3.5,
    multiplier: "1.0×",
    space: "~67 sq in (paper-sized)",
    outdoorAccess: "None",
    feed: "Standard",
    welfareScore: 1,
    description:
      "Standard battery cage or enriched colony housing. Lowest retail cost. Hens have roughly 67 sq in of space — the size of a sheet of paper.",
  },
  "cage-free": {
    label: "Cage-Free",
    emoji: "🐔",
    priceLow: 3.5,
    priceHigh: 5.0,
    multiplier: "~1.4×",
    space: "~1 sq ft indoors",
    outdoorAccess: "None",
    feed: "Standard",
    welfareScore: 2,
    description:
      "Hens live indoors without cages and can walk freely, but have no outdoor access. Now required in California, Massachusetts, and several other states.",
  },
  "free-range": {
    label: "Free-Range",
    emoji: "🌿",
    priceLow: 4.0,
    priceHigh: 5.5,
    multiplier: "~1.6×",
    space: "2+ sq ft + outdoor",
    outdoorAccess: "Some",
    feed: "Standard",
    welfareScore: 3,
    description:
      "USDA requires some outdoor access, but quality and duration varies significantly between farms. No minimum space requirement outdoors.",
  },
  organic: {
    label: "Organic",
    emoji: "🌱",
    priceLow: 5.0,
    priceHigh: 7.0,
    multiplier: "~1.8×",
    space: "2+ sq ft + outdoor",
    outdoorAccess: "Some",
    feed: "USDA Certified Organic",
    welfareScore: 4,
    description:
      "Certified organic feed with no antibiotics or synthetic pesticides. Must also be cage-free. Feed costs drive most of the premium.",
  },
  "pasture-raised": {
    label: "Pasture-Raised",
    emoji: "🏡",
    priceLow: 6.0,
    priceHigh: 9.0,
    multiplier: "~2.2×",
    space: "108+ sq ft outdoors",
    outdoorAccess: "Full",
    feed: "Mixed/pasture grass",
    welfareScore: 5,
    description:
      "At least 108 sq ft of outdoor pasture per hen — the highest animal welfare standard available. Hummane Farm Animal Care (HFAC) certified.",
  },
};

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    q: "Why are egg prices so high right now?",
    a: "Prices remain elevated due to ongoing HPAI (bird flu) outbreaks reducing flock sizes, elevated feed and energy costs, and new cage-free mandates in many states. Replacing hens takes 5–6 months from chick to laying maturity, so recovery is inherently slow.",
  },
  {
    q: "What is HPAI and how does it affect egg prices?",
    a: "Highly Pathogenic Avian Influenza has led to the culling of 100M+ birds since 2022. When a flock tests positive, the entire farm must be cleared immediately — removing millions of eggs from supply overnight. The virus spreads through wild bird migration routes, making it very difficult to contain seasonally.",
  },
  {
    q: "What's the cheapest way to buy eggs right now?",
    a: "Costco's 36-count packs offer the lowest per-egg cost (~$0.22/egg). Aldi and Walmart are best for 12-count cartons. Buying store-brand conventional eggs saves 20–35% vs. name brands that often come from the exact same farms.",
  },
  {
    q: "Are cage-free eggs worth the premium?",
    a: "Cage-free hens have meaningfully better welfare conditions and more room to move. Studies show minimal nutritional difference in the eggs. Free-range and pasture-raised eggs tend to have slightly more omega-3 fatty acids. The choice depends on your values and budget.",
  },
  {
    q: "Will egg prices come down soon?",
    a: "Analysts expect gradual normalization as flocks recover and new cage-free facilities come online. Any new major outbreak can spike prices rapidly. The structural price floor has likely risen permanently due to state-level cage-free mandates adding $0.80–$1.20/dz to production costs.",
  },
  {
    q: "How is the national average calculated?",
    a: "The national average comes from the BLS Consumer Price Index, series APU0000708111 — tracking the average retail price of one dozen Grade A large eggs, collected monthly from urban areas across the U.S. It lags real-time retail pricing by 2–4 weeks.",
  },
  {
    q: "How does the Kroger API work?",
    a: "Kroger offers a free public API at developer.kroger.com. It returns live product pricing by ZIP code after OAuth2 authentication. You get real prices for every Kroger-owned banner (Kroger, Fred Meyer, Ralph's, King Soopers, etc.). Other retailers don't have public APIs — real-time data requires scraping.",
  },
  {
    q: "How do you scrape Walmart, Target, and Aldi prices?",
    a: "Walmart and Target pricing can be fetched via their internal APIs discovered through browser devtools (not officially public). Aldi requires HTML scraping via Playwright or Puppeteer since they don't have a product search API. All scraped data should be cached to avoid rate limiting.",
  },
  {
    q: "Can I freeze eggs to save money?",
    a: "Yes. Crack eggs into an ice cube tray and freeze for up to 12 months. Whites and yolks can be frozen separately. This is a great way to stock up when prices dip in summer (Jun–Aug) and avoid holiday spikes.",
  },
];

// ─── Market analysis cards ────────────────────────────────────────────────────
export const MARKET_ANALYSIS = [
  {
    emoji: "🦠",
    title: "Bird Flu (HPAI) Outbreaks",
    body: "Since 2022, over 100 million birds in the U.S. have been culled due to HPAI. When a flock tests positive, the entire farm must be cleared immediately — wiping out millions of eggs almost overnight. The virus spreads through wild bird migration routes, making seasonal recurrence very likely.",
  },
  {
    emoji: "🌽",
    title: "Feed & Energy Costs",
    body: "Chicken feed is mostly corn and soybeans, which rose sharply after 2021. Feed alone accounts for 60–70% of egg production costs. When commodity prices rise, egg prices follow closely — usually within a few weeks.",
  },
  {
    emoji: "🏭",
    title: "A Concentrated Market",
    body: "The top 5 egg producers control ~30% of all U.S. laying capacity. One outbreak at a major producer ripples nationally. Proposition 12 (CA) and similar laws have added a permanent $0.80–$1.20/dz premium by mandating cage-free housing.",
  },
  {
    emoji: "🐣",
    title: "Slow Recovery After Culls",
    body: "It takes 5–6 months to raise a chick into a productive laying hen. This biological constraint means supply cannot recover quickly after an outbreak — high prices persist for many months even after containment.",
  },
  {
    emoji: "🏪",
    title: "Retail Markup Patterns",
    body: "Grocers sometimes use eggs as a loss leader. But during shortages, retail prices haven't always fallen as fast as wholesale — suggesting some of the elevated shelf prices reflect retailer margins, not just supply costs.",
  },
  {
    emoji: "🌍",
    title: "Trade & Export Pressure",
    body: "The U.S. exports ~4–5% of egg production. When domestic supply is tight, export demand worsens shortages. Import restrictions from other HPAI-affected countries also limit the ability to supplement supply through trade.",
  },
];

// ─── Industry stats table ─────────────────────────────────────────────────────
export const INDUSTRY_STATS = [
  {
    metric: "Annual egg production",
    value: "~110 billion",
    note: "USDA NASS 2023",
  },
  {
    metric: "Laying hens in the U.S.",
    value: "~380 million",
    note: "As of Q1 2024",
  },
  {
    metric: "Per capita consumption",
    value: "~286 eggs/year",
    note: "USDA ERS estimate",
  },
  {
    metric: "Birds culled since 2022",
    value: "100 million+",
    note: "HPAI bird flu response",
  },
  {
    metric: "Cage-free market share",
    value: "~35%",
    note: "Up from 5% in 2015",
  },
  {
    metric: "Top 5 producer share",
    value: "~30%",
    note: "Cal-Maine Foods leads",
  },
  {
    metric: "Recovery time after cull",
    value: "5–6 months",
    note: "Chick to laying maturity",
  },
  {
    metric: "Average farm gate price",
    value: "$1.40–$2.20/dz",
    note: "Varies by contract & region",
  },
  {
    metric: "Retail markup (estimated)",
    value: "60–80%",
    note: "Over farm gate price",
  },
  {
    metric: "USDA inspection coverage",
    value: "100%",
    note: "All shell eggs federally graded",
  },
];
