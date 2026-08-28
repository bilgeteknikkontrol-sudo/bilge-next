import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * VERITABANI BAGLANTISI (Postgres + MySQL)
 *
 * Bu kod eskiden `cms.ts` icindeydi. Site Hostinger'a tasinirken teklif
 * kayitlari da veritabanina alindi (`store.ts`); `store.ts` -> `cms.ts`
 * baglantisi ise DONGU olusturuyordu (`cms.ts` zaten `store.ts`'i cagiriyor).
 * Bu yuzden baglanti katmani ayri dosyaya alindi. `cms.ts` disari acilan
 * `isDbOn`/`isMysql`/`sql` adlarini yeniden ihrac ediyor; cagri yerleri
 * degismedi.
 */

export type Sql = NeonQueryFunction<false, boolean>;

export async function run(q: Promise<unknown>): Promise<Record<string, unknown>[]> {
  return (await q) as Record<string, unknown>[];
}

/**
 * MySQL bilgileri AYRI DEGISKENLERLE de verilebilir.
 *
 * Hostinger'in urettigi veritabani sifreleri `@ : / ? #` gibi karakterler
 * icerebiliyor; bunlar tek parca `DATABASE_URL` icine oldugu gibi yazilinca
 * adres yanlis ayristirilir ve baglanti "Access denied" ile duser — sebebi de
 * hicbir yerde gorunmez. Bu yuzden host/kullanici/sifre ayri ayri verilirse
 * adresi kendimiz, kacislari dogru yaparak kuruyoruz.
 */
function mysqlAyriDegiskenlerden(): string | undefined {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const veritabani = process.env.MYSQL_DATABASE;
  if (!host || !user || !veritabani) return undefined;
  const sifre = process.env.MYSQL_PASSWORD ?? "";
  const port = process.env.MYSQL_PORT || "3306";
  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(sifre)}@${host}:${port}/${veritabani}`;
}

function dbUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || mysqlAyriDegiskenlerden();
}

export function isDbOn(): boolean {
  return Boolean(dbUrl());
}

/**
 * IKI VERITABANI DESTEGI
 *
 * Site Hostinger'a tasiniyor ve oradaki Business planinda yalnizca MySQL var;
 * kod ise Postgres (Neon) icin yazilmisti. Tasima boyunca Vercel'in yedekte
 * calismaya devam etmesi gerektigi icin ikisi de destekleniyor: hangisinin
 * kullanilacagi DATABASE_URL'in basindaki semadan anlasiliyor.
 *
 *   mysql://...      -> MySQL   (Hostinger)
 *   postgres://...   -> Postgres (Neon/Vercel)
 *
 * Cagri yerleri degismedi: her iki surucu de ayni etiketli sablon bicimini
 * (sql()`SELECT ... ${deger}`) kullaniyor. MySQL tarafinda sablondaki
 * ${} yerlerine `?` konup degerler parametre olarak geciriliyor — yani
 * SQL enjeksiyonuna karsi Postgres tarafiyla ayni korumadayiz.
 */
export function isMysql(): boolean {
  const u = dbUrl() ?? "";
  return u.startsWith("mysql://") || u.startsWith("mysql2://");
}

let _sql: Sql | null = null;
let _mysqlHavuz: import("mysql2/promise").Pool | null = null;

function mysqlSurucu(url: string): Sql {
  const fn = (async (parcalar: TemplateStringsArray, ...degerler: unknown[]) => {
    if (!_mysqlHavuz) {
      const mysql = await import("mysql2/promise");
      _mysqlHavuz = mysql.createPool({
        uri: url,
        connectionLimit: 5,
        // Paylasimli hostingde baglanti sayisi sinirli; bosta kalanlar birakilsin.
        idleTimeout: 30_000,
        enableKeepAlive: true,
      });
    }
    const metin = parcalar.join("?");
    const [satirlar] = await _mysqlHavuz.query(metin, degerler);
    return Array.isArray(satirlar) ? satirlar : [];
  }) as unknown as Sql;
  return fn;
}

export function sql(): Sql {
  const url = dbUrl();
  if (!url) throw new Error("DATABASE_URL tanimli degil");
  if (!_sql) _sql = isMysql() ? mysqlSurucu(url) : (neon(url) as Sql);
  return _sql as Sql;
}
