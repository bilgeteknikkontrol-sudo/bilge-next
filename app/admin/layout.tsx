import AdminNav from "./AdminNav";
import { isDbOn } from "@/lib/cms";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const noPersist = !isDbOn() && !process.env.VERCEL_API_TOKEN;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminNav />
      <main className="flex-1 p-6">
        {noPersist && (
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            ⚠️ Ne <code>DATABASE_URL</code> ne de <code>VERCEL_API_TOKEN</code> tanımlı. İçerik
            düzenlemeleri bu oturumla sınırlı kalır ve kalıcı olmaz. CMS verisini kalıcı kılmak için
            Vercel ortam değişkenlerine <code>VERCEL_API_TOKEN</code> + <code>VERCEL_TEAM_ID</code> ekleyin
            (veya <code>DATABASE_URL</code>).
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
