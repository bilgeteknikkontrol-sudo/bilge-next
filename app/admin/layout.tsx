import AdminNav from "./AdminNav";
import { isDbOn } from "@/lib/cms";

/**
 * Panel kabuğu. Mobilde menu ustte acilir baslik, masaustunde sol sutun
 * (AdminNav ikisini de kendi iciyor). Icerik alani ortalanmis ve genisligi
 * sinirli: tam genislikte form satirlari cok uzuyor ve okumak zorlasiyordu.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const kaliciDegil = !isDbOn() && !process.env.VERCEL_API_TOKEN;

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <AdminNav />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
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
