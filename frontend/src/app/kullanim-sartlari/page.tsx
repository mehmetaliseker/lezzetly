import { PageContainer } from "@/components/layout/page-container";
import { HomeFooter } from "@/features/home/components/home-footer";

export default function TermsPage() {
	return (
		<>
			<main className="bg-brand-light py-12 sm:py-16">
				<PageContainer maxWidth="xl" className="max-w-4xl">
					<section className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-sm ring-1 ring-stone-950/5 sm:p-8 lg:p-10">
						<h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
							Kullanim Sartlari
						</h1>
						<p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
							Bu sartlar, Lezzetly platformunu kullanan tum ziyaretci ve uyeler icin baglayicidir.
							Platformu kullanmaya devam etmeniz, asagidaki maddeleri kabul ettiginiz anlamina gelir.
						</p>

						<div className="mt-8 space-y-6">
							<div>
								<h2 className="text-lg font-semibold text-stone-900">1. Hizmet kapsami</h2>
								<p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
									Lezzetly, restoran kesfi ve rezervasyon sureclerini dijital ortamda yonetmek icin
									aracilik eden bir platformdur. Platform, restoranlar ile kullanicilar arasindaki
									iletisimi kolaylastirir; nihai hizmet kalitesi ilgili isletmenin sorumlulugundadir.
								</p>
							</div>

							<div>
								<h2 className="text-lg font-semibold text-stone-900">2. Hesap sorumlulugu</h2>
								<p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
									Kullanicilar hesap bilgilerinin dogrulugundan ve guvenliginden sorumludur.
									Hesabiniz uzerinden gerceklesen islemler tarafinizdan yapilmis kabul edilir. Supheli
									durumlarda hizli sekilde destek kanallarina bildirim yapmaniz gerekir.
								</p>
							</div>

							<div>
								<h2 className="text-lg font-semibold text-stone-900">3. Rezervasyon kurallari</h2>
								<p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
									Rezervasyon saatleri, kapasite sinirlari ve ozel kosullar restoran bazinda
									farklilik gosterebilir. Kullanici, onayladigi rezervasyon bilgisini kontrol etmekle
									yukumludur. Isletme kaynakli degisikliklerde platform bilgilendirme saglar.
								</p>
							</div>

							<div>
								<h2 className="text-lg font-semibold text-stone-900">4. Yasakli kullanimlar</h2>
								<p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
									Sisteme zarar verecek teknik girisimler, sahte hesap kullanimi, manipule edici
									icerik paylasimi ve hukuka aykiri faaliyetler kesinlikle yasaktir. Bu tur
									durumlarda hesaplar gecici veya kalici olarak kisitlanabilir.
								</p>
							</div>

							<div>
								<h2 className="text-lg font-semibold text-stone-900">5. Degisiklik hakki</h2>
								<p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
									Lezzetly, urun kapsaminda ve yasal gerekliliklerde meydana gelen degisimlere bagli
									olarak kullanim sartlarini guncelleyebilir. Guncel metin yayinlandigi tarih
									itibariyla yururluge girer.
								</p>
							</div>

							<div>
								<h2 className="text-lg font-semibold text-stone-900">6. Iletisim ve uyusmazlik</h2>
								<p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
									Sartlarla ilgili sorulariniz icin platform destek kanallarini kullanabilirsiniz.
									Uyusmazlik durumunda taraflar once iyi niyetli cozum surecini isletmeyi kabul eder.
									Gecerli mevzuat kapsaminda yetkili merciler esas alinir.
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
