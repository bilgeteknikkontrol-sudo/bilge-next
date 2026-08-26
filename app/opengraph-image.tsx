import { ImageResponse } from "next/og";

export const alt = "Bilge Teknik Kontrol - TURKAK Accredited Periodic Inspection";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #1d4ed8 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px", fontSize: 56, fontWeight: 800 }}>
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: 22,
              background: "white",
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
              fontWeight: 900,
            }}
          >
            B
          </div>
          Bilge Teknik Kontrol
        </div>
        <div style={{ marginTop: 30, fontSize: 42, fontWeight: 700 }}>
          TURKAK Accredited Periodic Inspection
        </div>
        <div style={{ marginTop: 18, fontSize: 30, color: "#cbd5e1" }}>
          Lifting · Pressure · Electrical · Fire Equipment
        </div>
        <div style={{ marginTop: 46, fontSize: 26, color: "#93c5fd" }}>
          bilgekontrol.com
        </div>
      </div>
    ),
    { ...size }
  );
}
