"use client";

import Link from "next/link";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Badge } from "@/components/ui/badge";
import { buttonClassNames } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { useRestaurant } from "@/hooks/use-restaurant";

type Props = {
	restaurantId: number;
};

export function RestaurantDetailView({ restaurantId }: Props) {
	const query = useRestaurant(restaurantId);

	if (query.isLoading) {
		return <LoadingState title="Restoran yükleniyor" message="Detay bilgileri getiriliyor…" />;
	}

	if (query.isError) {
		return (
			<ErrorState
				message={
					query.error instanceof Error ? query.error.message : "Detay alınamadı veya restoran pasif."
				}
				action={
					<Link className={cn(buttonClassNames.outline)} href="/restaurants">
						Listeye dön
					</Link>
				}
			/>
		);
	}

	const restaurant = query.data;
	if (!restaurant) {
		return null;
	}

	return (
		<div className="flex flex-col gap-8">
			<Card className="overflow-hidden">
				<div className="relative aspect-[21/9] min-h-[160px] w-full bg-gradient-to-br from-zinc-100 via-stone-50 to-zinc-100 sm:aspect-[2.4/1]">
					<div className="absolute inset-0 flex items-center justify-center text-xs font-medium uppercase tracking-widest text-zinc-400">
						Restoran görseli (placeholder)
					</div>
					<div className="absolute left-4 top-4 sm:left-6 sm:top-6">
						<Badge variant={restaurant.active ? "success" : "muted"}>
							{restaurant.active ? "Açık rezervasyona uygun" : "Şu an kapalı"}
						</Badge>
					</div>
				</div>
				<CardContent className="flex flex-col gap-4 pt-6 sm:pt-8">
					<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex min-w-0 flex-col gap-1">
							<h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
								{restaurant.name}
							</h2>
							<p className="text-sm text-zinc-500 sm:text-base">{restaurant.city}</p>
						</div>
						<div className="rounded-lg bg-zinc-50 px-4 py-3 text-right ring-1 ring-zinc-200/80">
							<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Saatlik</p>
							<p className="text-lg font-semibold tabular-nums text-zinc-900">
								{restaurant.pricePerHour} ₺
							</p>
						</div>
					</div>
					<p className="max-w-2xl text-sm leading-relaxed text-zinc-600">
						Rezervasyon için tarih ve saat aralığını seçebilirsiniz. Toplam süre ve fiyat sunucu tarafında
						hesaplanır.
					</p>
				</CardContent>
				<CardFooter className="flex flex-col gap-3 border-t border-zinc-100 bg-zinc-50/50 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-zinc-500">Restoran kimliği: {restaurant.id}</p>
					<Link className={cn(buttonClassNames.primary, "w-full text-center sm:w-auto")} href="/rezervasyon">
						Rezervasyon formuna git
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
