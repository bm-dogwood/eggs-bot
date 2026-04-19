import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function formatPricePerEgg(price: number): string {
  return `$${price.toFixed(3)}`;
}

export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function calcPctChange(current: number, previous: number): number {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

export function sliceHistory<T>(arr: T[], months: number): T[] {
  if (months >= 999) return arr;
  return arr.slice(-months);
}

export function shortLabel(period: string, year: string): string {
  return `${period.slice(0, 3)} '${year.slice(2)}`;
}

// Demand color helpers
export const demandColor = {
  High: { bg: "rgba(239,68,68,0.65)", text: "#dc2626", badge: "#fef2f2" },
  Med: { bg: "rgba(234,179,8,0.60)", text: "#d97706", badge: "#fef9c3" },
  Low: { bg: "rgba(22,163,74,0.60)", text: "#16a34a", badge: "#f0fdf4" },
} as const;

// Chart color palette
export const CHART_COLORS = {
  green: "#16a34a",
  greenAlpha: "rgba(22,163,74,0.08)",
  red: "#ef4444",
  amber: "#f59e0b",
  blue: "#3b82f6",
  gray: "#9ca3af",
  gridLine: "rgba(128,128,128,0.1)",
};

// Shared Chart.js options factory
export function baseChartOptions(yPrefix = "$") {
  const font = { family: "'DM Sans', sans-serif", size: 11 };
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "rgba(0,0,0,0.1)",
        borderWidth: 1,
        titleColor: "#6b7280",
        bodyColor: "#111827",
        bodyFont: { ...font, weight: "600" as const },
        titleFont: font,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: CHART_COLORS.gridLine },
        ticks: { color: "#9ca3af", font, maxTicksLimit: 9, maxRotation: 0 },
        border: { display: false },
      },
      y: {
        grid: { color: CHART_COLORS.gridLine },
        ticks: {
          color: "#9ca3af",
          font,
          callback: (v: number | string) => `${yPrefix}${Number(v).toFixed(2)}`,
        },
        border: { display: false },
      },
    },
  };
}
