import { guard } from "@/lib/auth";
import { tumTeklifler } from "@/lib/store";
import { epostaAyari } from "@/lib/eposta";
import { testEpostaAction } from "../actions";
import { SayfaBasligi, Kart, Buton, Bilgi, BosDurum } from "../ui";

export const dynamic = "force-dynamic";

/**
 * Formdan gelen teklif talepleri.
 *
 * ⚠️ Bu ekran yazilana kadar gelen talepleri gorecek HICBIR YER yoktu:
 * kayitlar Vercel Blob icindeki bir JSON dosyasina yaziliyor, e-posta da
 * gonderilmiyordu. Yani her talep goruntuye cikmadan kayboluyordu.
 */
export default async function TekliflerAdmin({
  searchParams,
}: {
  searchParams: Promise<{ test?: string; mesaj?: string }>;
}) {
  await guard();
  const sp = await searchParams;
  const kayitlar = await tumTeklifler().catch(() => []);
  const eposta = epostaAyari();

  return (
    <div>
      <SayfaBasligi
        baslik="📥 Teklif Talepleri"
        aciklama="Online teklif formundan gelen istekler. En yeni en üstte."
        onizleme="/teklif"
      />

      {sp.test === "ok" && (
        <div className="mb-5">
          <Bilgi>
            ✓ Test e-postası gönderildi. <b>{eposta.alici.join(", ")}</b> kutusunu kontrol edin
            (spam klasörüne de bakın).
          </Bilgi>
        </div>
      )}
      {sp.test === "hata" && (
        <div className="mb-5">
          <Bilgi tur="hata">
            <b>Test e-postası gönderilemedi.</b>
            <code className="mt-1 block break-all text-xs">{sp.mesaj}</code>
          </Bilgi>
        </div>
      )}

      <div className="mb-5">
        {eposta.hazir ? (
          <Kart
            baslik="E-posta bildirimi açık"
            aciklama={`Gelen talepler ${eposta.alici.join(", ")} adresine gönderiliyor (${
              eposta.yol === "smtp" ? "kendi posta kutunuz üzerinden" : "Resend üzerinden"
            }).`}
          >
            <form action={testEpostaAction}>
              <Buton type="submit" tur="ikincil">
                Test e-postası gönder
              </Buton>
            </form>
          </Kart>
        ) : (
          <Bilgi tur="uyari">
            <b className="block text-base">E-posta bildirimi kapalı</b>
            <p className="mt-1">
              Gelen talepler <b>{eposta.alici.join(", ")}</b> adresine gidecek şekilde ayarlı, ama
              sunucu posta kutusuna giriş yapamadığı için gönderemiyor.
            </p>

            <p className="mt-3 font-bold">Eksik olan {eposta.eksik.length === 1 ? "değer" : "değerler"}:</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 font-mono text-xs">
              {eposta.eksik.map((a) => (
                <li key={a}>
                  {a}
                  {a === "SMTP_PASS" && " = info@bilgeteknikkontrol.com kutusunun şifresi"}
                  {a === "SMTP_HOST" && " = smtp.hostinger.com"}
                  {a === "SMTP_PORT" && " = 465"}
                  {a === "SMTP_USER" && " = info@bilgeteknikkontrol.com"}
                </li>
              ))}
            </ul>

            <p className="mt-3 text-xs leading-relaxed">
              Vercel → <b>bilge-next</b> → Settings → Environment Variables → Add New. Değeri
              ekledikten sonra <b>Deployments</b> sekmesinden en üstteki dağıtımda “Redeploy”
              deyin (ortam değişkenleri ancak yeni dağıtımda devreye girer). Sonra bu sayfadaki
              test düğmesiyle doğrulayın.
            </p>
            <p className="mt-2 text-xs leading-relaxed">
              Postanız Hostinger&apos;da olduğu için e-postalar kendi kutunuzdan çıkar; spam&apos;e
              düşme ihtimali en düşük yol budur.
            </p>
          </Bilgi>
        )}
      </div>

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
