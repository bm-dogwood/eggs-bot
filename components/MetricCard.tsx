import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  delta?: number | null; // percentage change
  deltaLabel?: string;
  primary?: boolean;
  darkTheme?: boolean;
}

export default function MetricCard({
  label,
  value,
  sub,
  delta,
  deltaLabel,
  primary = false,
}: MetricCardProps) {
  const isUp = delta !== null && delta !== undefined && delta > 0.5;
  const isDn = delta !== null && delta !== undefined && delta < -0.5;

  return (
    <div className={`metric-card${primary ? " primary" : ""}`}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          flexWrap: "wrap",
        }}
      >
        {delta !== null && delta !== undefined && (
          <span
            className={`delta ${
              isUp ? "delta-up" : isDn ? "delta-dn" : "delta-flat"
            }`}
          >
            {isUp ? (
              <TrendingUp size={11} />
            ) : isDn ? (
              <TrendingDown size={11} />
            ) : (
              <Minus size={11} />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        {(sub ?? deltaLabel) && (
          <span className="metric-sub">{deltaLabel ?? sub}</span>
        )}
      </div>
    </div>
  );
}
