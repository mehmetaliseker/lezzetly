"use client";

import Image from "next/image";
import Link from "next/link";

import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { useRestaurants } from "@/hooks/use-restaurants";
import { cn } from "@/lib/cn";

const accentImages = ["/side1.jpg", "/side2.jpg"] as const;

export function HomeFeaturedRestaurants() {
	const query = useRestaurants();
	const items = (query.data ?? []).slice(0, 3);

	if (query.isLoading) {
		return (
			<section className="home-section border-b border-stone-200/80 bg-white">
				<PageContainer maxWidth="xl" className="flex w-full max-w-7xl items-center">
					<LoadingState title="Öne çıkanlar yükleniyor" message="Restoran listesi getiriliyor…" />
				</PageContainer>
			</section>
		);
	}

	if (query.isError) {
		return (
			<section className="home-section border-b border-stone-200/80 bg-white">
				<PageContainer maxWidth="xl" className="flex w-full max-w-7xl items-center">
					<ErrorState
						message={
							query.error instanceof Error
								? query.error.message
								: "Liste şu an yüklenemiyor. Bağlantınızı veya API adresini kontrol edin."
						}
					/>
				</PageContainer>
			</section>
		);
	}

	if (items.length === 0) {
		return (
			<section className="home-section border-b border-stone-200/80 bg-white">
				<PageContainer maxWidth="xl" className="flex w-full max-w-7xl items-center">
					<EmptyState
						title="Henüz vitrin restoranı yok"
						description="Veritabanında aktif işletme görünmüyor. Yine de tüm listeyi görmek için restoranlar sayfasına gidebilirsiniz."
						action={
							<Link
								className="inline-flex rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
								href="/restaurants"
							>
								Tüm restoranlar
							</Link>
						}
					/>
				</PageContainer>
			</section>
		);
	}

	return (
		<section className="home-section border-b border-stone-200/80 bg-white">
			<PageContainer maxWidth="xl" className="flex w-full max-w-7xl flex-col justify-center">
				<div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
					<div className="max-w-xl">
						<h2 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
							Öne çıkan mekânlar
						</h2>
						<p className="mt-3 text-base leading-relaxed text-stone-600">
							Canlı veriden seçilen örnekler. Detay ve rezervasyon için kartı kullanın.
						</p>
					</div>
					<Link
						className="text-sm font-medium text-amber-900/90 underline-offset-4 transition hover:text-amber-950 hover:underline"
						href="/restaurants"
					>
						Tümünü gör →
					</Link>
				</div>
				<ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((restaurant, index) => {
						const imageSrc = accentImages[index % accentImages.length] ?? "/side1.jpg";
						return (
							<li key={restaurant.id}>
								<Link
									className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/40 focus-visible:ring-offset-2"
									href={`/restaurants/${restaurant.id}`}
								>
									<article className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-50/40 shadow-sm ring-1 ring-stone-950/4 transition duration-300 group-hover:border-stone-300 group-hover:shadow-lg">
										<div className="relative aspect-4/3 w-full overflow-hidden bg-stone-200">
											<Image
												alt={`${restaurant.name} — mekân atmosferi`}
												className="object-cover transition duration-500 group-hover:scale-[1.02]"
												fill
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												src={imageSrc}
											/>
											<div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-800 ring-1 ring-stone-200/80 backdrop-blur-sm">
												Öne çıkan
											</div>
										</div>
										<div className="flex flex-1 flex-col gap-3 p-6">
											<div>
												<h3 className="font-display text-xl font-semibold text-stone-900 group-hover:text-stone-800">
													{restaurant.name}
												</h3>
												<p className="mt-1 text-sm text-stone-500">{restaurant.city}</p>
											</div>
											<p className="text-xs font-medium uppercase tracking-wide text-stone-400">
												Saatlik ücret
											</p>
											<p className="text-lg font-semibold tabular-nums text-stone-900">
												{restaurant.pricePerHour} <span className="text-sm font-normal text-stone-500">₺</span>
											</p>
											<span
												className={cn(
													"mt-auto inline-flex w-fit items-center text-sm font-semibold text-amber-900/90",
													"transition group-hover:translate-x-0.5"
												)}
											>
												Masa ayırt →
											</span>
										</div>
									</article>
								</Link>
							</li>
						);
					})}
				</ul>
			</PageContainer>
		</section>
	);
}
