import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

export const alt = "Bilge Teknik Kontrol — TÜRKAK Akredite Periyodik Muayene";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Koyu zemin varyanti kullaniliyor: OG arka plani lacivert.
  // ImageResponse harici URL cozemedigi icin dosya data: URI olarak gomuluyor.
  const logo = await fs.readFile(
    path.join(process.cwd(), "public/img/marka/logo-light.png")
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={300} height={209} />
        <div style={{ marginTop: 34, fontSize: 44, fontWeight: 700 }}>
          TÜRKAK Akredite Periyodik Teknik Kontrol
        </div>
        <div style={{ marginTop: 18, fontSize: 30, color: "#cbd5e1" }}>
          Kaldırma · Basınçlı Kap · Elektrik · Yangın · İş Makineleri
        </div>
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              background: "rgba(255,255,255,.12)",
              fontSize: 26,
              color: "#e2e8f0",
            }}
          >
            AB-0296-M
          </div>
          <div style={{ fontSize: 26, color: "#93c5fd" }}>bilgekontrol.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
