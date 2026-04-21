import Image from "next/image";

import { PageContainer } from "@/components/layout/page-container";

const bullets = [
	"Şeffaf saatlik ücret gösterimi ve net rezervasyon özeti",
	"Özellik bayrakları ile kontrollü ürün açılımı",
	"Mobil uyumlu arayüz; hızlı yükleme için optimize görseller",
	"İşletmeler için ölçeklenebilir talep yönetimi vizyonu",
];

export function HomeTrust() {
	return (
		<section className="home-section border-b border-stone-200/80 bg-white">
			<PageContainer maxWidth="xl" className="flex w-full max-w-7xl flex-col justify-center">
				<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
					<div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-stone-200 shadow-md ring-1 ring-stone-950/5">
						<Image
							alt="Sakin ve zarif bir yemek deneyimi ortamı"
							className="object-cover"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							src="/side2.jpg"
						/>
					</div>
					<div>
						<h2 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
							Güven veren deneyim
						</h2>
						<p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
							Lezzetly; yoğun renkler veya dikkat dağıtan animasyonlar yerine, okunabilir tipografi ve
							dengeli boşluklarla üst segment rezervasyon hissi sunar.
						</p>
						<ul className="mt-8 flex flex-col gap-4">
							{bullets.map((line) => (
								<li className="flex gap-3 text-sm leading-relaxed text-stone-700 sm:text-base" key={line}>
									<span
										aria-hidden
										className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700/80"
									/>
									{line}
								</li>
							))}
						</ul>
					</div>
				</div>
			</PageContainer>
		</section>
	);
}
