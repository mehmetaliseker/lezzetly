import Image from "next/image";

import { PageContainer } from "@/components/layout/page-container";

export function HomeOverview() {
	return (
		<section className="border-b border-stone-200/80 bg-stone-50 py-16 sm:py-20 lg:py-24">
			<PageContainer maxWidth="xl" className="max-w-7xl">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
						İki taraf için tek çözüm
					</h2>
					<p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
						Lezzetly; misafir arayanlar ile masa yönetmek isteyen işletmeleri aynı güvenilir akışta
						bir araya getirir.
					</p>
				</div>
				<div className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl bg-stone-200 shadow-sm ring-1 ring-stone-950/5">
					<div className="relative aspect-[21/9] min-h-[11rem] w-full max-h-56 sm:max-h-64">
						<Image
							alt="Yemek deneyimi atmosferi"
							className="object-cover"
							fill
							sizes="(max-width: 1024px) 100vw, 56rem"
							src="/side1.jpg"
						/>
						<div
							aria-hidden
							className="absolute inset-0 bg-gradient-to-t from-stone-900/25 to-transparent"
						/>
					</div>
				</div>
				<div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-12">
					<article className="rounded-2xl border border-stone-200/90 bg-white p-8 shadow-sm ring-1 ring-stone-950/[0.03] transition duration-300 hover:border-stone-300/90 hover:shadow-md">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/80">
							Misafirler
						</p>
						<h3 className="mt-3 font-display text-2xl font-semibold text-stone-900">Keşfet, seç, onayla</h3>
						<p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
							Aktif restoranları inceleyin, uygun saat diliminde talep oluşturun. Süre ve tutar sunucuda
							netleşir; sürpriz ücret yoktur.
						</p>
					</article>
					<article className="rounded-2xl border border-stone-200/90 bg-white p-8 shadow-sm ring-1 ring-stone-950/[0.03] transition duration-300 hover:border-stone-300/90 hover:shadow-md">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/80">
							İşletmeler
						</p>
						<h3 className="mt-3 font-display text-2xl font-semibold text-stone-900">Doluluk ve düzen</h3>
						<p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
							Rezervasyon taleplerini tek ekranda görün, müşteri deneyimini standartlaştırın. Kayıt ve
							yönetim akışları ürünle birlikte genişler.
						</p>
					</article>
				</div>
			</PageContainer>
		</section>
	);
}
