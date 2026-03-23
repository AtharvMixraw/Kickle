import * as React from "react";

interface GridLiveEmailProps {
  gridNumber: number;
  siteUrl: string;
}

export function GridLiveEmail({ gridNumber, siteUrl }: GridLiveEmailProps) {
  return (
    <div style={{ backgroundColor: "#050505", fontFamily: "sans-serif", padding: "40px 0" }}>
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          backgroundColor: "#0f0f0f",
          border: "1px solid #1f1f1f",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0a1e1a 0%, #0d2a22 100%)",
            padding: "36px 40px 28px",
            textAlign: "center",
            borderBottom: "1px solid #1a1a1a",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              backgroundColor: "#36e27b",
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              marginBottom: "16px",
            }}
          >
            ⚽
          </div>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "22px",
              fontWeight: "800",
              margin: "0 0 6px",
              letterSpacing: "-0.5px",
            }}
          >
            Football Grid Challenge
          </h1>
          <p style={{ color: "#36e27b", fontSize: "12px", fontWeight: "700", margin: 0, letterSpacing: "2px", textTransform: "uppercase" }}>
            Daily Challenge
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "36px 40px" }}>
          <div
            style={{
              backgroundColor: "#36e27b10",
              border: "1px solid #36e27b30",
              borderRadius: "12px",
              padding: "20px 24px",
              marginBottom: "28px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#36e27b", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 8px" }}>
              Now Live
            </p>
            <p style={{ color: "#ffffff", fontSize: "32px", fontWeight: "900", margin: 0, letterSpacing: "-1px" }}>
              Grid #{gridNumber}
            </p>
          </div>

          <p style={{ color: "#9ca3af", fontSize: "15px", lineHeight: "1.6", margin: "0 0 28px", textAlign: "center" }}>
            Today&apos;s football grid is ready. Fill in the 3×3 with players who match both row and column criteria — and see if you can top the leaderboard.
          </p>

          {/* CTA Button */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <a
              href={`${siteUrl}/dashboard`}
              style={{
                display: "inline-block",
                backgroundColor: "#36e27b",
                color: "#000000",
                fontWeight: "800",
                fontSize: "15px",
                padding: "14px 36px",
                borderRadius: "100px",
                textDecoration: "none",
                letterSpacing: "-0.2px",
              }}
            >
              ▶ Play Today&apos;s Grid
            </a>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #1f1f1f", margin: "0 0 24px" }} />

          {/* Tips */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              ["⚡", "One attempt only — make it count"],
              ["🏆", "Check the leaderboard after you submit"],
              ["📤", "Share your result to challenge friends"],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "16px" }}>{icon}</span>
                <span style={{ color: "#6b7280", fontSize: "13px" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#0a0a0a",
            borderTop: "1px solid #1a1a1a",
            padding: "20px 40px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#374151", fontSize: "12px", margin: 0 }}>
            © 2026 Football Grid Challenge &nbsp;·&nbsp;
            <a href={siteUrl} style={{ color: "#374151", textDecoration: "underline" }}>
              Unsubscribe
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}