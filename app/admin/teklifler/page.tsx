import { guard } from "@/lib/auth";
import { tumTeklifler } from "@/lib/store";
import { SayfaBasligi, Kart, Bilgi, BosDurum } from "../ui";

export const dynamic = "force-dynamic";

/**
 * Formdan gelen teklif talepleri.
 *
 * ⚠️ Bu ekran yazilana kadar gelen talepleri gorecek HICBIR YER yoktu:
 * kayitlar Vercel Blob icindeki bir JSON dosyasina yaziliyor, e-posta da
 * gonderilmiyordu. Yani her talep goruntuye cikmadan kayboluyordu.
 */
export default async function TekliflerAdmin() {
  await guard();
  const kayitlar = await tumTeklifler().catch(() => []);
  const bildirimAcik = Boolean(process.env.RESEND_API_KEY);

  return (
    <div>
      <SayfaBasligi
        baslik="📥 Teklif Talepleri"
        aciklama="Online teklif formundan gelen istekler. En yeni en üstte."
        onizleme="/teklif"
      />

      {!bildirimAcik && (
        <div className="mb-5">
          <Bilgi tur="uyari">
            <b>E-posta bildirimi kapalı.</b> Talepler burada birikiyor ama kimseye e-posta
            gitmiyor. Açmak için Vercel &gt; Settings &gt; Environment Variables altına{" "}
            <code>RESEND_API_KEY</code> ekleyin (resend.com üzerinden ücretsiz alınır).
            İsterseniz <code>TEKLIF_ALICI</code> ile bildirimin gideceği adresi de belirleyin.
          </Bilgi>
        </div>
      )}

      {kayitlar.length === 0 ? (
        <BosDurum
          ikon="📭"
          baslik="Henüz talep yok"
          aciklama="Online teklif formundan bir istek geldiğinde burada listelenecek."
        />
      ) : (
        <Kart baslik={`${kayitlar.length} talep`}>
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  {["Tarih", "Firma", "İletişim", "Ekipman", "Referans"].map((b) => (
                    <th key={b} className="py-2 pr-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kayitlar.map((t) => (
                  <tr key={t.ref} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-4 whitespace-nowrap text-slate-500 tabular-nums">
                      {new Date(t.tarih).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                      <span className="block text-xs text-slate-400">
                        {new Date(t.tarih).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="font-bold text-navy">{t.firma}</span>
                      {t.ad && <span className="block text-xs text-slate-500">{t.ad}</span>}
                      {t.bolge && <span className="block text-xs text-slate-400">{t.bolge}</span>}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <a href={`tel:${t.tel}`} className="block font-semibold text-blue hover:underline">
                        {t.tel}
                      </a>
                      <a href={`mailto:${t.eposta}`} className="block text-xs text-slate-500 hover:underline">
                        {t.eposta}
                      </a>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-slate-700">{t.ekipmanlar.join(", ")}</span>
                      {t.ek && (
                        <span className="mt-1 block border-l-2 border-accent pl-2 text-xs italic text-slate-500">
                          {t.ek}
                        </span>
                      )}
                    </td>
                    <td className="py-3 font-mono text-xs text-slate-400">{t.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Kart>
      )}
    </div>
  );
}
