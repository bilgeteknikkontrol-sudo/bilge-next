import AdminNav from "./AdminNav";
import { isDbOn } from "@/lib/cms";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const dbOff = !isDbOn();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminNav />
      <main className="flex-1 p-6">
        {dbOff && (
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            ⚠️ Veritabanı bağlantısı yok. İçerik düzenlemeleri kalıcı olmayabilir. Lütfen Vercel ortam
            değişkenlerine <code>DATABASE_URL</code> ekleyin.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
