import { PageContainer } from "@/components/layout/page-container";
import { HomeFooter } from "@/features/home/components/home-footer";

export default function PrivacyPage() {
	return (
		<>
			<main className="bg-brand-light py-12 sm:py-16">
				<PageContainer maxWidth="xl" className="max-w-4xl">
					<section className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-sm ring-1 ring-stone-950/5 sm:p-8 lg:p-10">
						<h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
							Gizlilik Politikasi
						</h1>
						<p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
							Lezzetly olarak kullanicilarimizin kisisel verilerini guvenli, seffaf ve amacla sinirli sekilde
							islemeyi temel ilke kabul ederiz. Bu metin; platform uzerindeki veri toplama, kullanma, saklama
							ve koruma adimlarimizi aciklar.
						</p>

						<div className="mt-8 space-y-6">
							<div>
								<h2 className="text-lg font-semibold text-stone-900">1. Toplanan veriler</h2>
								<p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
									Hesap acilisinda ad, soyad, e-posta, telefon ve giris bilgileri gibi temel hesap
									verileri toplanabilir. Rezervasyon sureclerinde tarih-saat secimi, mekan tercihleri
									ve islem gecmisi gibi hizmeti dogrudan etkileyen veriler islenir.
								</p>
							</div>

							<div>
								<h2 className="text-lg font-semibold text-stone-900">2. Veri kullanma amaci</h2>
								<p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
									Veriler; rezervasyon islemlerinin dogru calismasi, kullanici deneyiminin iyilestirilmesi,
									guvenlik kontrollerinin saglanmasi ve yasal yukumluluklerin yerine getirilmesi
									amaclariyla kullanilir. Bu kapsam disinda kalan kullanimlara izin verilmez.
								</p>
							</div>

							<div>
								<h2 className="text-lg font-semibold text-stone-900">3. Saklama suresi</h2>
								<p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
									Kisisel veriler, ilgili hizmetin gerektirdigi sure boyunca ve yasal saklama
									yukumlulukleri dikkate alinarak tutulur. Gerekliligi ortadan kalkan veriler guvenli
									bicimde silinir, anonimlestirilir veya imha edilir.
								</p>
							</div>

							<div>
								<h2 className="text-lg font-semibold text-stone-900">4. Ucuncu taraflarla paylasim</h2>
								<p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
									Verileriniz yalnizca hizmetin ifasi icin zorunlu oldugunda, yasal zorunluluk
									bulundugunda veya acik rizaniz kapsaminda paylasilir. Yetkisiz ticari paylasim
									yapilmaz.
								</p>
							</div>

							<div>
								<h2 className="text-lg font-semibold text-stone-900">5. Haklariniz</h2>
								<p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
									Mevzuat kapsaminda; verilerinize erisim talep etme, duzeltme, silme, islemeyi
									sinirlandirma ve itiraz etme haklarina sahipsiniz. Talepleriniz makul surede
									degerlendirilir ve sonuclandirilir.
								</p>
							</div>

							<div>
								<h2 className="text-lg font-semibold text-stone-900">6. Guvenlik yaklasimi</h2>
								<p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
									Sistemlerimizde yetki kontrolu, kayit izleme, baglanti guvenligi ve veri butunlugu
									onlemleri uygulanir. Ekiplerimiz guvenlik ve veri koruma ilkelerine uygun sekilde
									surekli iyilestirme yapar.
								</p>
							</div>
						</div>
					</section>
				</PageContainer>
			</main>
			<HomeFooter />
		</>
	);
}
