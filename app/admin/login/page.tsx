import type { Metadata } from "next";
import { loginAction } from "../actions";
import { panelKurulu } from "@/lib/auth";

/**
 * Giris ekrani arama motorlarina kapali.
 *
 * ⚠️ robots.txt zaten /admin/ altini disliyor ama robots.txt bir TAVSIYEDIR;
 * baska bir yerden baglanti verilirse sayfa yine indekslenebilir. `noindex`
 * baslikta durdugu icin bu ihtimali de kapatiyor.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Yönetici Girişi",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const kurulu = panelKurulu();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form action={loginAction} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-black tracking-tight text-navy">Yönetici Girişi</h1>
        <p className="mt-1 text-sm text-slate-500">Bilge Teknik Kontrol paneli</p>

        {!kurulu ? (
          /**
           * ⚠️ Kurulum eksikken eskiden 500 doniyordu ve sebebi hicbir yerde
           * yazmiyordu (Hostinger uygulama gunlugu tutmuyor). Panel yine kapali,
           * ama artik ne yapilmasi gerektigi ekranda yaziyor.
           */
          <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-sm text-amber-900">
            <b className="block">Panel henüz kurulmadı</b>
            <p className="mt-1 leading-relaxed">
              Sunucuda <code className="font-mono">ADMIN_PASSWORD</code> ortam değişkeni tanımlı
              değil, bu yüzden giriş kapalı.
            </p>
            <p className="mt-2 leading-relaxed">
              hPanel → <b>Ortam değişkenleri</b> → <code className="font-mono">ADMIN_PASSWORD</code>{" "}
              ekleyin, ardından <b>yeniden dağıtın</b> (ortam değişkeni ancak yeni dağıtımda devreye
              girer).
            </p>
          </div>
        ) : (
          <>
            {sp.error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                Şifre hatalı.
              </p>
            )}
            <label className="mt-5 block text-sm font-semibold text-slate-700">
              Şifre
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-blue px-4 py-2.5 font-bold text-white hover:brightness-110"
            >
              Giriş Yap
            </button>
          </>
        )}
      </form>
    </div>
  );
}
