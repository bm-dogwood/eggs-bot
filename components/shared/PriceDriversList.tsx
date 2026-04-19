// components/shared/PriceDriversList.tsx
"use client";

import { DARK_THEME } from "./DarkThemeStyles";

interface Driver {
  label: string;
  pct: number;
  color: string;
  bgColor: string;
  level: string;
}

interface PriceDriversListProps {
  drivers: Driver[];
}

export function PriceDriversList({ drivers }: PriceDriversListProps) {
  return (
    <>
      <div className="drivers-list">
        {drivers.map(({ label, pct, color, bgColor, level }) => (
          <div key={label} className="driver-item">
            <div className="driver-header">
              <span className="driver-label">{label}</span>
              <span className="driver-level" style={{ color }}>
                {level}
              </span>
            </div>
            <div className="progress-bar-dark">
              <div
                className="progress-fill-dark"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .drivers-list {
          padding: 8px 20px 18px;
        }

        .driver-item {
          margin-bottom: 16px;
        }

        .driver-item:last-child {
          margin-bottom: 0;
        }

        .driver-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .driver-label {
          font-size: 12px;
          color: ${DARK_THEME.text.secondary};
        }

        .driver-level {
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .progress-bar-dark {
          height: 6px;
          background: ${DARK_THEME.bg.tertiary};
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill-dark {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      `}</style>
    </>
  );
}
