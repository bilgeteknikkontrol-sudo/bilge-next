import AdminNav from "./AdminNav";
import { isDbOn } from "@/lib/cms";
import { depoDurumu } from "@/lib/store";

/**
 * Panel kabuğu. Mobilde menu ustte acilir baslik, masaustunde sol sutun
 * (AdminNav ikisini de kendi iciyor). Icerik alani ortalanmis ve genisligi
 * sinirli: tam genislikte form satirlari cok uzuyor ve okumak zorlasiyordu.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const kaliciDegil = !isDbOn() && !process.env.VERCEL_API_TOKEN;
  // Depo yazilamiyorsa panelde yapilan HICBIR degisiklik kalici olmaz.
  // Bu durum eskiden hicbir yerde gorunmuyordu; en tepede gosteriliyor.
  const depo = await depoDurumu();
  const askiya = /suspend/i.test(depo.mesaj);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <AdminNav />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
          {!depo.calisiyor && (
            <div className="mb-5 rounded-xl border-2 border-red-400 bg-red-50 px-4 py-4 text-sm leading-relaxed text-red-800">
              <b className="block text-base">
                🚨 Kayıt deposuna ulaşılamıyor — yaptığınız değişiklikler KAYBOLUR
              </b>
              {askiya ? (
                <>
                  <p className="mt-2">
                    Vercel Blob deponuz <b>askıya alınmış</b>. Bu düzeltilene kadar panelden
                    yaptığınız düzenlemeler kaydedilmez ve online teklif formundan gelen
                    talepler saklanamaz.
                  </p>
                  <p className="mt-2">
                    <b>Yapılması gereken:</b> vercel.com → bilge-next projesi → Storage →{" "}
                    <code>bilge-cms</code> deposunu açın. Genellikle sebep ücretsiz kotanın
                    dolması veya ödeme sorunudur.
                  </p>
                </>
              ) : (
                <p className="mt-2">
                  Depo hatası: <code>{depo.mesaj}</code>
                </p>
              )}
            </div>
          )}
          {kaliciDegil && (
            <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
              ⚠️ <b>Değişiklikler kalıcı olmayacak.</b> Ne <code>DATABASE_URL</code> ne de{" "}
              <code>VERCEL_API_TOKEN</code> tanımlı; yaptığınız düzenlemeler bu oturumla sınırlı kalır.
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
