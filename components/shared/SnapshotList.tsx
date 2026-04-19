// components/shared/SnapshotList.tsx
"use client";

import { DARK_THEME } from "./DarkThemeStyles";

interface SnapshotItem {
  label: string;
  value: string;
  color?: string;
}

interface SnapshotListProps {
  items: SnapshotItem[];
}

export function SnapshotList({ items }: SnapshotListProps) {
  return (
    <>
      <div className="snapshot-list">
        {items.map(({ label, value, color = DARK_THEME.text.primary }) => (
          <div key={label} className="snapshot-item">
            <span className="snapshot-label">{label}</span>
            <span className="snapshot-value" style={{ color }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .snapshot-list {
          padding: 8px 20px 16px;
        }

        .snapshot-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 0;
          border-bottom: 1px solid ${DARK_THEME.border.subtle};
        }

        .snapshot-item:last-child {
          border-bottom: none;
        }

        .snapshot-label {
          font-size: 12.5px;
          color: ${DARK_THEME.text.secondary};
        }

        .snapshot-value {
          font-size: 13px;
          font-weight: 700;
        }
      `}</style>
    </>
  );
}
