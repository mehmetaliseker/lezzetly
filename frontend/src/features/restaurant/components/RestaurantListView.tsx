"use client";

import Link from "next/link";

import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { buttonClassNames } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";
import { useRestaurants } from "@/hooks/use-restaurants";
import { cn } from "@/lib/cn";

import { RestaurantCard } from "./restaurant-card";

export function RestaurantListView() {
	const query = useRestaurants();

	if (query.isLoading) {
		return <LoadingState title="Restoranlar yükleniyor" message="Sunucudan güncel liste alınıyor…" />;
	}

	if (query.isError) {
		return (
			<ErrorState
				message={
					query.error instanceof Error
						? query.error.message
						: "Liste alınamadı. Backend, NEXT_PUBLIC_API_URL ve CORS ayarlarını kontrol edin."
				}
				action={
					<Link className={cn(buttonClassNames.outline)} href="/">
						Ana sayfaya dön
					</Link>
				}
			/>
		);
	}

	const items = query.data ?? [];

	if (items.length === 0) {
		return (
			<EmptyState
				title="Henüz restoran yok"
				description="Veritabanında aktif restoran bulunmuyor. Yönetim veya seed adımlarını tamamladıktan sonra sayfayı yenileyin."
			/>
		);
	}

	return (
		<div className="flex flex-col gap-8">
			<SectionTitle
				title="Keşfet"
				description={`${items.length} işletme listeleniyor.`}
			/>
			<ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{items.map((restaurant) => (
					<RestaurantCard key={restaurant.id} restaurant={restaurant} />
				))}
			</ul>
		</div>
	);
}
