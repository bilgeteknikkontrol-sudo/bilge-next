import { KURUM } from "@/lib/site-data";

/**
 * Sag altta sabit duran WhatsApp butonu.
 *
 * Sunucu bileseni — JavaScript gerektirmiyor, sadece bir baglanti.
 * Kucuk ekranda yalnizca ikon, >=640px'te yaninda yazi acilir (hover'da degil,
 * her zaman gorunur: dokunmatik cihazda hover yok).
 *
 * z-index 40: cerez banner'i (z-50) ustte kalsin, geri kalan her sey altta.
 * Konum "bottom" degeri env(safe-area-inset-bottom) ile artiyor ki iPhone'da
 * alt cubugun arkasinda kalmasin.
 */
export default function WhatsappButon() {
  const metin = encodeURIComponent(
    "Merhaba, periyodik kontrol hizmetiniz hakkında bilgi almak istiyorum."
  );
  return (
    <a
      href={`https://wa.me/${KURUM.whatsappE164}?text=${metin}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp ile yazın: ${KURUM.whatsapp}`}
      className="wa-buton"
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden focusable="false" fill="currentColor">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.38-.27.3-1.04 1.01-1.04 2.470 0 1.45 1.06 2.86 1.21 3.06.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
        <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 4.99L2 22l5.19-1.36a9.93 9.93 0 0 0 4.85 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.88 9.88 0 0 0 12.04 2zm0 18.16h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.24 8.24 0 0 1-1.26-4.39c0-4.56 3.71-8.27 8.27-8.27 2.21 0 4.29.86 5.85 2.42a8.22 8.22 0 0 1 2.42 5.85c0 4.57-3.71 8.28-8.28 8.28z" />
      </svg>
      <span className="wa-yazi">WhatsApp</span>
    </a>
  );
}
