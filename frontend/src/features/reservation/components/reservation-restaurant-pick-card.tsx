"use client";

import Image from "next/image";
import Link from "next/link";

import { resolveApiMediaUrl } from "@/lib/media-url";
import type { RestaurantResponse } from "@/types/api/restaurant";

type ReservationRestaurantPickCardProps = {
	restaurant: RestaurantResponse;
};

export function ReservationRestaurantPickCard({ restaurant }: ReservationRestaurantPickCardProps) {
	const mainImage = restaurant.mainImageUrl ? resolveApiMediaUrl(restaurant.mainImageUrl) : null;

	return (
		<Link
			href={`/rezervasyon/${restaurant.id}`}
			className="group block overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/90 shadow-sm ring-1 ring-stone-950/20 transition hover:border-stone-600 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
		>
			<article className="flex h-full flex-col">
				<div className="relative aspect-4/3 w-full overflow-hidden bg-stone-800">
					{mainImage ? (
						<Image
							src={mainImage}
							alt={`${restaurant.name} — ana görsel`}
							fill
							className="object-cover transition duration-500 group-hover:scale-[1.02]"
							sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
							unoptimized
						/>
					) : (
						<div className="flex h-full min-h-[10rem] w-full items-center justify-center bg-gradient-to-br from-stone-800 via-stone-800 to-stone-900 text-6xl text-stone-600">
							🖼
						</div>
					)}
				</div>
				<div className="flex flex-1 flex-col gap-2 p-5">
					<div>
						<h2 className="text-lg font-semibold tracking-tight text-stone-50 group-hover:text-stone-100">
							{restaurant.name}
						</h2>
						<p className="mt-1 text-sm text-stone-400">{restaurant.city}</p>
					</div>
					<p className="mt-auto text-sm font-medium text-stone-300">
						Saatlik {restaurant.pricePerHour.toFixed(2)} TL
					</p>
					<span className="text-sm font-semibold text-amber-400/95 transition group-hover:translate-x-0.5">
						Masa seç →
					</span>
				</div>
			</article>
		</Link>
	);
}
