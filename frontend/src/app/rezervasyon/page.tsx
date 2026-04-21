"use client";

import Link from "next/link";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { HomeFooter } from "@/features/home/components/home-footer";
import { useRestaurants } from "@/hooks/use-restaurants";

export default function ReservationPage() {
	const restaurantsQuery = useRestaurants();

	if (restaurantsQuery.isLoading) {
		return <LoadingState title="Restoranlar yükleniyor" message="Liste hazırlanıyor…" />;
	}
	if (restaurantsQuery.isError) {
		return <ErrorState message="Restoran listesi alınamadı." />;
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-stone-950">
			<PageContainer maxWidth="site" className="flex flex-1 flex-col py-10 sm:py-12">
				<h1 className="text-2xl font-semibold text-stone-50">Bir restoran seç</h1>
				<p className="mt-2 text-sm text-stone-400">Detay sayfasına geçerek masa ve saat seçimi yapabilirsiniz.</p>
				<div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{(restaurantsQuery.data ?? []).map((restaurant) => (
						<Link
							key={restaurant.id}
							href={`/rezervasyon/${restaurant.id}`}
							className="rounded-xl border border-stone-800 bg-stone-900 p-5 transition hover:border-stone-600"
						>
							<p className="text-lg font-semibold text-stone-100">{restaurant.name}</p>
							<p className="mt-1 text-sm text-stone-400">{restaurant.city}</p>
							<p className="mt-3 text-sm text-stone-300">
								Saatlik {restaurant.pricePerHour.toFixed(2)} TL
							</p>
						</Link>
					))}
				</div>
			</PageContainer>
			<HomeFooter />
		</div>
	);
}
