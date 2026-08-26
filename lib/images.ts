// OTOMATIK URETILDI: scratchpad/build-images.js
// Gorseller sitenin onceki PHP surumunden alindi (WebP). Static import kullaniliyor:
// next/image genislik/yukseklik ve blur placeholder'i derleme aninda cozuyor.
import type { StaticImageData } from "next/image";
import img_basincli_kaplarin_periyodik_kontrolu from "../public/img/basincli-kaplarin-periyodik-kontrolu.webp";
import img_dairesel_testere from "../public/img/dairesel-testere.webp";
import img_delme_matkap from "../public/img/delme-matkap.webp";
import img_demir_bukme from "../public/img/demir-bukme.webp";
import img_demir_kesme from "../public/img/demir-kesme.webp";
import img_dikey_panel_ebatlama from "../public/img/dikey-panel-ebatlama.webp";
import img_dilme_makinesi from "../public/img/dilme-makinesi.webp";
import img_egitim from "../public/img/egitim.webp";
import img_elektirik_olcumleri from "../public/img/elektirik-olcumleri.webp";
import img_elektirik_tesisati_olcum_kontrolleri from "../public/img/elektirik-tesisati-olcum-kontrolleri.webp";
import img_form_verme from "../public/img/form-verme.webp";
import img_havalandirma_sistemleri from "../public/img/havalandirma-sistemleri.webp";
import img_is_makineleri_kontrolleri from "../public/img/is-makineleri-kontrolleri.webp";
import img_istif_makinesi from "../public/img/istif-makinesi.webp";
import img_kaldirma_araclari_teknik_kontrolu from "../public/img/kaldirma-araclari-teknik-kontrolu.webp";
import img_katodik_koruma from "../public/img/katodik-koruma.webp";
import img_kaynak_makinesi from "../public/img/kaynak-makinesi.webp";
import img_kenar_bukme_kesme from "../public/img/kenar-bukme-kesme.webp";
import img_kurutma_makinesi from "../public/img/kurutma-makinesi.webp";
import img_makarali_pnomatik from "../public/img/makarali-pnomatik.webp";
import img_makina_tezgah from "../public/img/makina-tezgah.webp";
import img_makina_yerlesim from "../public/img/makina-yerlesim.webp";
import img_paratoner_tesisat_kontrolleri from "../public/img/paratoner-tesisat-kontrolleri.webp";
import img_patlamadan_karunma_kokumani from "../public/img/patlamadan-karunma-kokumani.webp";
import img_punta_tabanca from "../public/img/punta-tabanca.webp";
import img_raf_sistemleri_kontrolu1 from "../public/img/raf-sistemleri-kontrolu1.webp";
import img_satih_taslama from "../public/img/satih-taslama.webp";
import img_serit_testere from "../public/img/serit-testere.webp";
import img_serit_zimpara from "../public/img/serit-zimpara.webp";
import img_taslama_motoru from "../public/img/taslama-motoru.webp";
import img_termal_kamera_incelemesi from "../public/img/termal-kamera-incelemesi.webp";
import img_topraklama from "../public/img/topraklama.webp";
import img_yangin_algilama_uyari_sistemlerin_periyodik_kontrolu from "../public/img/yangin-algilama-uyari-sistemlerin-periyodik-kontrolu.webp";
import img_yangin_kontrolu from "../public/img/yangin-kontrolu.webp";
import img_yangin10 from "../public/img/yangin10.webp";
import img_yangin11 from "../public/img/yangin11.webp";
import img_yangin12 from "../public/img/yangin12.webp";
import img_yangin13 from "../public/img/yangin13.webp";
import img_yangin14 from "../public/img/yangin14.webp";
import img_yangin17 from "../public/img/yangin17.webp";
import img_yangin18 from "../public/img/yangin18.webp";
import img_yangin4 from "../public/img/yangin4.webp";
import img_yangin5 from "../public/img/yangin5.webp";
import img_yangin6 from "../public/img/yangin6.webp";
import img_yangin8 from "../public/img/yangin8.webp";
import img_yangin9 from "../public/img/yangin9.webp";
import img_yuruyen_merdiven_bant_kontrolleri from "../public/img/yuruyen-merdiven-bant-kontrolleri.webp";

/** Hizmet/ekipman slug -> genis gorsel (kahraman ve kartlar icin, ~780x400) */
export const EKIPMAN_GORSEL: Record<string, StaticImageData> = {
  "abkant-pres": img_makina_tezgah,
  "arac-ustu-servis-lifti": img_kaldirma_araclari_teknik_kontrolu,
  "asfalt-serici-finiser": img_is_makineleri_kontrolleri,
  "basincli-kaplar": img_basincli_kaplarin_periyodik_kontrolu,
  "beton-pompasi": img_is_makineleri_kontrolleri,
  "borverk-tezgahi": img_makina_tezgah,
  "buhar-kazani": img_basincli_kaplarin_periyodik_kontrolu,
  "dairesel-testere": img_dairesel_testere,
  "delme-makinalari-matkap": img_delme_matkap,
  "demir-bukme": img_demir_bukme,
  "demir-kesme": img_demir_kesme,
  "dikey-panel-ebatlama": img_dikey_panel_ebatlama,
  "dilme-makinasi": img_dilme_makinesi,
  "dozer": img_is_makineleri_kontrolleri,
  "duman-tahliye-sistemi": img_havalandirma_sistemleri,
  "egitim": img_egitim,
  "eksantrik-pres": img_makina_tezgah,
  "elektrik-tesisat": img_elektirik_olcumleri,
  "forklift": img_kaldirma_araclari_teknik_kontrolu,
  "form-verme": img_form_verme,
  "freze-tezgahi": img_makina_tezgah,
  "giyotin-makas": img_makina_tezgah,
  "greyder": img_is_makineleri_kontrolleri,
  "havalandirma": img_havalandirma_sistemleri,
  "hidrofor-ve-genlesme-tanki": img_basincli_kaplarin_periyodik_kontrolu,
  "hidrolik-pres": img_makina_tezgah,
  "insaat-cephe-asansoru": img_kaldirma_araclari_teknik_kontrolu,
  "is-hijyeni-olcumleri": img_termal_kamera_incelemesi,
  "is-makineleri": img_is_makineleri_kontrolleri,
  "isi-degistirici-esanjor": img_basincli_kaplarin_periyodik_kontrolu,
  "isleme-merkezi-cnc": img_makina_tezgah,
  "istif-makinasi": img_istif_makinesi,
  "kaldirma-iletme": img_kaldirma_araclari_teknik_kontrolu,
  "kalorifer-kazani": img_basincli_kaplarin_periyodik_kontrolu,
  "katodik-koruma": img_elektirik_olcumleri,
  "kaynak-makinasi": img_kaynak_makinesi,
  "kazici-yukleyici": img_is_makineleri_kontrolleri,
  "kenar-bukme-kesme": img_kenar_bukme_kesme,
  "kirma-eleme-tesisi": img_is_makineleri_kontrolleri,
  "kizgin-yag-kazani": img_basincli_kaplarin_periyodik_kontrolu,
  "kompresor-hava-tanki": img_basincli_kaplarin_periyodik_kontrolu,
  "konveyor-bantli-iletme": img_kaldirma_araclari_teknik_kontrolu,
  "kriko-ve-cektirme": img_kaldirma_araclari_teknik_kontrolu,
  "kriyojenik-tank": img_basincli_kaplarin_periyodik_kontrolu,
  "kurutma-makinasi": img_kurutma_makinesi,
  "lpg-depolama-tanki": img_basincli_kaplarin_periyodik_kontrolu,
  "makarali-pnomatik-bogma": img_makarali_pnomatik,
  "makina-tezgah": img_makina_tezgah,
  "makina-tezgahlar": img_makina_tezgah,
  "makina-yerlesim-projesi": img_makina_yerlesim,
  "makinalarda-elektriksel-kontrol": img_elektirik_olcumleri,
  "mekanik-periyodik-kontrol": img_kaldirma_araclari_teknik_kontrolu,
  "mobil-vinc": img_kaldirma_araclari_teknik_kontrolu,
  "monoray-vinc": img_kaldirma_araclari_teknik_kontrolu,
  "otoklav-ve-sterilizator": img_basincli_kaplarin_periyodik_kontrolu,
  "paratoner-yildirimdan-korunma": img_elektirik_olcumleri,
  "patlamadan-korunma": img_patlamadan_karunma_kokumani,
  "pedal-makinasi": img_makina_tezgah,
  "pipet-makinasi": img_makina_tezgah,
  "pipet-paketleme": img_makina_tezgah,
  "planya-ve-kalinlik-makinesi": img_makina_tezgah,
  "plastik-enjeksiyon-makinesi": img_makina_tezgah,
  "portatif-yangin-sondurme-cihazi": img_yangin_kontrolu,
  "punta-tabanca": img_punta_tabanca,
  "raf-sistemleri": img_raf_sistemleri_kontrolu1,
  "sapan-ve-kaldirma-aksesuarlari": img_kaldirma_araclari_teknik_kontrolu,
  "satih-taslama": img_satih_taslama,
  "serit-testere": img_serit_testere,
  "serit-zimpara": img_serit_zimpara,
  "sicak-su-ve-kizgin-su-kazani": img_basincli_kaplarin_periyodik_kontrolu,
  "silindir-sikistirma-makinesi": img_is_makineleri_kontrolleri,
  "sinai-ve-tibbi-gaz-tanki": img_basincli_kaplarin_periyodik_kontrolu,
  "sondaj-makinalari": img_makina_tezgah,
  "sprinkler-yagmurlama-sistemi": img_yangin_kontrolu,
  "sutunlu-calisma-platformu": img_kaldirma_araclari_teknik_kontrolu,
  "takim-bileme": img_makina_tezgah,
  "taslama-motoru": img_taslama_motoru,
  "tek-kafa-tabak": img_makina_tezgah,
  "tekli-pipet-kaplama": img_makina_tezgah,
  "telehandler": img_kaldirma_araclari_teknik_kontrolu,
  "topraklama-olcumu": img_elektirik_olcumleri,
  "torna-tezgahi": img_makina_tezgah,
  "transmikser": img_is_makineleri_kontrolleri,
  "transpalet": img_istif_makinesi,
  "yangin-algilama": img_yangin_algilama_uyari_sistemlerin_periyodik_kontrolu,
  "yangin-dolabi-ve-hidrant": img_yangin_kontrolu,
  "yangin-pompasi": img_yangin_kontrolu,
  "yangin-tesisati": img_yangin_kontrolu,
  "yaya-istif-makinasi": img_istif_makinesi,
  "yukleyici-loder": img_is_makineleri_kontrolleri,
  "yukseltilebilir-seyyar-is-platformu": img_kaldirma_araclari_teknik_kontrolu,
  "yuruyen-merdiven": img_yuruyen_merdiven_bant_kontrolleri,
};

/**
 * Ekipmana ozel fotograf. Kaynak dosyalar 250x250 kucuk resim oldugu icin
 * SADECE kucuk alanda kullanin (kenar cubugu ~160px); buyutulurse bulaniklasir.
 */
export const EKIPMAN_FOTO: Record<string, StaticImageData> = {
  "arac-ustu-servis-lifti": img_yangin4,
  "forklift": img_yangin13,
  "insaat-cephe-asansoru": img_yangin18,
  "istif-makinasi": img_yangin6,
  "katodik-koruma": img_katodik_koruma,
  "konveyor-bantli-iletme": img_yangin8,
  "kriko-ve-cektirme": img_yangin14,
  "makinalarda-elektriksel-kontrol": img_elektirik_tesisati_olcum_kontrolleri,
  "mobil-vinc": img_yangin9,
  "monoray-vinc": img_yangin5,
  "paratoner-yildirimdan-korunma": img_paratoner_tesisat_kontrolleri,
  "sapan-ve-kaldirma-aksesuarlari": img_yangin12,
  "sutunlu-calisma-platformu": img_yangin10,
  "topraklama-olcumu": img_topraklama,
  "transpalet": img_yangin17,
  "yukseltilebilir-seyyar-is-platformu": img_yangin11,
};

/** Yazi slug -> gorsel */
export const YAZI_GORSEL: Record<string, StaticImageData> = {
  "celik-halat-ne-zaman-degistirilir": img_kaldirma_araclari_teknik_kontrolu,
  "ekipnet-nedir": img_egitim,
  "elektrik-tesisat-projesi-zorunlu-mu": img_elektirik_olcumleri,
  "havalandirma-projesi-zorunlu-mu": img_havalandirma_sistemleri,
  "hidrostatik-test-nedir": img_basincli_kaplarin_periyodik_kontrolu,
  "isg-denetiminde-istenen-belgeler": img_raf_sistemleri_kontrolu1,
  "isg-katip-periyodik-kontrol-sozlesmesi": img_egitim,
  "kazan-dairesi-guvenlik-sartlari": img_basincli_kaplarin_periyodik_kontrolu,
  "kompresor-periyodik-kontrol": img_basincli_kaplarin_periyodik_kontrolu,
  "operator-belgesi-mi-periyodik-kontrol-mu": img_egitim,
  "periyodik-kontrol-nedir": img_makina_tezgah,
  "periyodik-kontrol-raporu-nasil-okunur": img_is_makineleri_kontrolleri,
  "periyodik-kontrol-sureleri": img_is_makineleri_kontrolleri,
  "periyodik-kontrol-yaptirmamanin-cezasi": img_egitim,
  "periyodik-kontrol-yeni-yonetmelik-2025": img_is_makineleri_kontrolleri,
  "periyodik-kontrolde-en-sik-cikan-uygunsuzluklar": img_makina_tezgah,
  "periyodik-kontrole-hazirlik": img_kaldirma_araclari_teknik_kontrolu,
  "periyodik-kontrolu-kimler-yapabilir": img_egitim,
  "preslerde-is-guvenligi": img_makina_tezgah,
  "rops-fops-nedir": img_is_makineleri_kontrolleri,
  "topraklama-direnci-kac-ohm-olmali": img_elektirik_olcumleri,
  "vinc-periyodik-kontrol": img_kaldirma_araclari_teknik_kontrolu,
  "yangin-algilama-projesi-zorunlu-mu": img_yangin_kontrolu,
  "yangin-pompasi-haftalik-test": img_yangin_kontrolu,
  "yangin-tesisati-projesi-zorunlu-mu": img_yangin_kontrolu,
  "yuk-testi-nedir": img_kaldirma_araclari_teknik_kontrolu,
};
