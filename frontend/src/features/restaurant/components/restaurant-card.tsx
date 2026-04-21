import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { resolveApiMediaUrl } from "@/lib/media-url";
import type { RestaurantResponse } from "@/types/api/restaurant";

type RestaurantCardProps = {
	restaurant: RestaurantResponse;
};

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
	const mainImage = restaurant.mainImageUrl ? resolveApiMediaUrl(restaurant.mainImageUrl) : null;

	return (
		<li>
			<Link className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2" href={`/restaurants/${restaurant.id}`}>
				<Card className="h-full overflow-hidden transition group-hover:border-zinc-300 group-hover:shadow-md">
					<div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-200">
						{mainImage ? (
							<Image
								src={mainImage}
								alt={`${restaurant.name} — ana görsel`}
								fill
								className="object-cover transition duration-500 group-hover:scale-[1.02]"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								unoptimized
							/>
						) : (
							<div className="flex h-full min-h-[10rem] w-full items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-50 to-stone-100 text-6xl text-zinc-400">
								🖼
							</div>
						)}
						<div className="absolute right-3 top-3">
							<Badge variant={restaurant.active ? "success" : "muted"}>
								{restaurant.active ? "Açık" : "Kapalı"}
							</Badge>
						</div>
					</div>
					<CardContent className="flex flex-col gap-2 pt-5">
						<div className="flex flex-col gap-0.5">
							<h3 className="text-base font-semibold tracking-tight text-zinc-900 group-hover:text-zinc-700">
								{restaurant.name}
							</h3>
							<p className="text-sm text-zinc-500">{restaurant.city}</p>
						</div>
						<p className="text-sm font-medium text-zinc-700">
							{restaurant.pricePerHour} ₺ <span className="font-normal text-zinc-500">/ saat</span>
						</p>
					</CardContent>
				</Card>
			</Link>
		</li>
	);
}
