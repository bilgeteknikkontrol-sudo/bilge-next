import { menuOku } from "@/lib/menu";
import HeaderIstemci from "./HeaderIstemci";

/**
 * Header — sunucu sarmalayicisi.
 *
 * Menu artik panelden yonetildigi icin veriyi burada okuyup istemci
 * bilesenine gecıriyoruz. Sayfalar `<Header />` cagirmaya devam ediyor;
 * hicbir sayfada degisiklik gerekmedi (17 sayfanin hepsi sunucu bileseni).
 *
 * Menu okunamazsa menuOku() zaten varsayilana duser — header asla bos kalmaz.
 */
export default async function Header() {
  const menu = await menuOku().catch(() => []);
  const { VARSAYILAN_MENU } = await import("@/lib/menu");
  return <HeaderIstemci menu={menu.length ? menu : VARSAYILAN_MENU} />;
}
