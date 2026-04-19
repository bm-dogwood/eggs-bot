// components/shared/Card.tsx
"use client";

import { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { DARK_THEME } from "./DarkThemeStyles";

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({
  title,
  subtitle,
  icon,
  action,
  children,
  className = "",
}: CardProps) {
  return (
    <>
      <div className={`card-dark ${className}`}>
        {(title || action) && (
          <div className="card-header-dark">
            <div>
              {title && (
                <h3 className="card-title-dark">
                  {icon}
                  {title}
                </h3>
              )}
              {subtitle && <p className="card-subtitle-dark">{subtitle}</p>}
            </div>
            {action && <div className="card-action">{action}</div>}
          </div>
        )}
        <div className="card-body-dark">{children}</div>
      </div>

      <style jsx>{`
        .card-dark {
          background: ${DARK_THEME.gradient.card};
          border: 1px solid ${DARK_THEME.border.subtle};
          border-radius: 18px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .card-dark:hover {
          border-color: ${DARK_THEME.border.medium};
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .card-header-dark {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 18px 20px 12px;
          border-bottom: 1px solid ${DARK_THEME.border.subtle};
        }

        .card-title-dark {
          font-size: 16px;
          font-weight: 700;
          color: ${DARK_THEME.text.primary};
          margin: 0 0 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .card-subtitle-dark {
          font-size: 12px;
          color: ${DARK_THEME.text.tertiary};
          margin: 0;
        }

        .card-body-dark {
          padding: 20px;
        }
      `}</style>
    </>
  );
}
