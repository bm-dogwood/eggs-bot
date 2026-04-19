"use client";
import {
  BellIcon,
  BookIcon,
  CalendarIcon,
  MapPinIcon,
  EggIcon,
  GridIcon,
  HelpCircleIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useState } from "react";

export type PageId =
  | "overview"
  | "prices"
  | "stores"
  | "seasonal"
  | "alerts"
  | "guide";

const NAV: {
  id: PageId;
  label: string;
  section?: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "overview",
    label: "Overview",
    section: "Analytics",
    icon: <GridIcon size={15} />,
  },
  { id: "prices", label: "Price History", icon: <TrendingUpIcon size={15} /> },
  { id: "stores", label: "Store Finder", icon: <MapPinIcon size={15} /> },
  { id: "seasonal", label: "Seasonal", icon: <CalendarIcon size={15} /> },
  {
    id: "alerts",
    label: "Price Alerts",
    section: "Tools",
    icon: <BellIcon size={15} />,
  },
  { id: "guide", label: "Egg Guide", icon: <BookIcon size={15} /> },
];

// ─── dark palette tokens ──────────────────────────────────────────
const D = {
  bg: "#161615",
  bgHover: "#1f1f1e",
  bgActive: "#14291e",
  border: "#242423",
  borderSub: "#1f1f1e",
  text: "#f5f5f4",
  textMuted: "#78786e",
  textDim: "#52524e",
  textGhost: "#3a3a37",
  accent: "#4ade80",
  accentBg: "#166534",
  accentBorder: "#15803d",
};

export default function Sidebar({
  activePage,
  onNavigate,
}: {
  activePage: PageId;
  onNavigate: (p: PageId) => void;
}) {
  const [rail, setRail] = useState(false);

  return (
    <aside
      style={{
        width: rail ? 60 : 240,
        flexShrink: 0,
        background: D.bg,
        borderRight: `1px solid ${D.border}`,
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 40,
        overflow: "hidden",
        transition: "width .25s cubic-bezier(.4,0,.2,1)",
      }}
    >
      {/* ── Logo header ── */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderBottom: `1px solid ${D.borderSub}`,
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: D.accentBg,
            border: `1px solid ${D.accentBorder}`,
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <EggIcon size={16} color={D.accent} strokeWidth={1.75} />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            opacity: rail ? 0 : 1,
            transition: "opacity .2s",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: D.text,
              letterSpacing: "-0.5px",
              lineHeight: 1,
            }}
          >
            eggs<span style={{ color: D.accent }}>.bot</span>
          </div>
          <div style={{ fontSize: 11, color: D.textDim, marginTop: 2 }}>
            Real-time egg prices
          </div>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setRail((r) => !r)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          {([16, 12, 16] as number[]).map((w, i) => (
            <span
              key={i}
              style={{
                display: "block",
                height: 1.5,
                width: rail ? 14 : w,
                background: D.textDim,
                borderRadius: 2,
                transition: "all .25s cubic-bezier(.4,0,.2,1)",
                transform: rail
                  ? i === 0
                    ? "rotate(45deg) translate(4.5px,4.5px)"
                    : i === 1
                    ? "scaleX(0)"
                    : "rotate(-45deg) translate(4.5px,-4.5px)"
                  : "none",
                opacity: rail && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: "12px 10px", overflow: "hidden" }}>
        {NAV.map((item, idx) => (
          <div key={item.id}>
            {item.section && (
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: D.textGhost,
                  letterSpacing: ".7px",
                  textTransform: "uppercase",
                  padding: rail
                    ? "0"
                    : idx === 0
                    ? "4px 8px 6px"
                    : "16px 8px 6px",
                  height: rail ? 0 : "auto",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  opacity: rail ? 0 : 1,
                  transition: "opacity .2s",
                }}
              >
                {item.section}
              </div>
            )}
            <button
              onClick={() => onNavigate(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "0 10px",
                height: 38,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 13.5,
                fontWeight: 500,
                whiteSpace: "nowrap",
                fontFamily: "inherit",
                background: activePage === item.id ? D.bgActive : "transparent",
                color: activePage === item.id ? D.accent : D.textMuted,
                transition: "background .12s, color .12s",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  overflow: "hidden",
                  opacity: rail ? 0 : 1,
                  transition: "opacity .2s",
                }}
              >
                {item.label}
              </span>
            </button>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div
        style={{
          padding: "14px 10px 16px",
          borderTop: `1px solid ${D.borderSub}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "0 8px",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: D.accent,
              flexShrink: 0,
              animation: "sb-pip 2.5s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: 11.5,
              color: D.textGhost,
              whiteSpace: "nowrap",
              opacity: rail ? 0 : 1,
              transition: "opacity .2s",
            }}
          >
            Live · BLS · Kroger API
          </span>
        </div>
      </div>

      <style>{`
        @keyframes sb-pip {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:.3; transform:scale(.6); }
        }
      `}</style>
    </aside>
  );
}
