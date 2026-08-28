import { loginAction } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        action={loginAction}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-2xl font-black tracking-tight text-navy">Yönetici Girişi</h1>
        <p className="mt-1 text-sm text-slate-500">Bilge Teknik Kontrol paneli</p>
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
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-blue px-4 py-2.5 font-bold text-white hover:brightness-110"
        >
          Giriş Yap
        </button>
        <p className="mt-4 text-center text-xs text-slate-400">
          Şifre: ortam değişkeni ADMIN_PASSWORD (tanımsızsa varsayılan bilgeadmin2026)
        </p>
      </form>
    </div>
  );
}
