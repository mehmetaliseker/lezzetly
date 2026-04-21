"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useCallback, useState } from "react";

import { resolveApiMediaUrl } from "@/lib/media-url";

type ReservationRestaurantGalleryProps = {
	restaurantName: string;
	mainImageUrl: string | null;
	detailImageUrls: string[];
};

type ThumbCellState = {
	layers: [string | null, string | null];
	active: 0 | 1;
};

type GalleryState = {
	heroOverride: string | null;
	heroLayers: [string | null, string | null];
	heroActive: 0 | 1;
	thumbCells: ThumbCellState[];
};

function isNonEmptyUrl(value: string | null | undefined): value is string {
	return value != null && value.length > 0;
}

/** Login (SmoothImageSwap) ile aynı mantık; süre daha kısa — iki katman aynı anda, çapraz solukluk. */
const galleryCrossfade = {
	duration: 0.52,
	ease: [0.22, 1, 0.36, 1] as const,
};

const thumbCrossfade = {
	duration: 0.42,
	ease: [0.22, 1, 0.36, 1] as const,
};

function buildInitialGallery(mainImageUrl: string | null, detailImageUrls: string[]): GalleryState {
	const main = isNonEmptyUrl(mainImageUrl) ? mainImageUrl : null;
	const thumbCells: ThumbCellState[] = detailImageUrls.map((url) => {
		const v = isNonEmptyUrl(url) ? url : null;
		return { layers: [v, v], active: 0 as const };
	});
	return {
		heroOverride: null,
		heroLayers: [main, main],
		heroActive: 0,
		thumbCells,
	};
}

function GalleryImageLayer({
	isActive,
	resolvedSrc,
	alt,
	unoptimized,
	transition,
}: {
	isActive: boolean;
	resolvedSrc: string | null;
	alt: string;
	unoptimized: boolean;
	transition: typeof galleryCrossfade;
}) {
	return (
		<motion.div
			className="absolute inset-0"
			initial={false}
			style={{
				pointerEvents: "none",
				willChange: "opacity, filter, transform",
				zIndex: isActive ? 2 : 1,
			}}
			animate={{
				opacity: isActive ? 1 : 0,
				filter: isActive ? "blur(0px) brightness(1)" : "blur(12px) brightness(0.9)",
				scale: isActive ? 1 : 1.03,
			}}
			transition={transition}
		>
			{resolvedSrc ? (
				<Image alt={alt} className="object-cover" fill src={resolvedSrc} unoptimized={unoptimized} />
			) : (
				<div className="flex h-full items-center justify-center bg-stone-900 text-6xl text-stone-600">🖼</div>
			)}
		</motion.div>
	);
}

export function ReservationRestaurantGallery({
	restaurantName,
	mainImageUrl,
	detailImageUrls,
}: ReservationRestaurantGalleryProps) {
	const [gallery, setGallery] = useState<GalleryState>(() =>
		buildInitialGallery(mainImageUrl, detailImageUrls)
	);

	const swapWithThumb = useCallback(
		(index: number) => {
			setGallery((previous) => {
				const heroBefore = previous.heroOverride ?? mainImageUrl;
				const cell = previous.thumbCells[index];
				if (!cell) {
					return previous;
				}
				const picked = cell.layers[cell.active];
				if (!isNonEmptyUrl(picked) && !isNonEmptyUrl(heroBefore)) {
					return previous;
				}
				const newHeroOverride = isNonEmptyUrl(picked) ? picked : null;
				const heroInactive: 0 | 1 = previous.heroActive === 0 ? 1 : 0;
				const newHeroLayers: [string | null, string | null] = [...previous.heroLayers];
				newHeroLayers[heroInactive] = newHeroOverride ?? mainImageUrl;

				const thumbInactive: 0 | 1 = cell.active === 0 ? 1 : 0;
				const newThumbLayers: [string | null, string | null] = [...cell.layers];
				newThumbLayers[thumbInactive] = isNonEmptyUrl(heroBefore) ? heroBefore : null;

				const nextThumbCells = previous.thumbCells.map((c, i) => {
					if (i !== index) {
						return c;
					}
					return { layers: newThumbLayers, active: thumbInactive };
				});

				return {
					heroOverride: newHeroOverride,
					heroLayers: newHeroLayers,
					heroActive: heroInactive,
					thumbCells: nextThumbCells,
				};
			});
		},
		[mainImageUrl]
	);

	return (
		<div className="mt-4 grid gap-4 lg:grid-cols-2">
			<div className="relative h-80 overflow-hidden rounded-2xl border border-stone-800 bg-stone-900">
				{[0, 1].map((layerIdx) => {
					const raw = gallery.heroLayers[layerIdx];
					const resolved = isNonEmptyUrl(raw) ? resolveApiMediaUrl(raw) : null;
					const isActive = layerIdx === gallery.heroActive;
					return (
						<GalleryImageLayer
							key={`hero-layer-${layerIdx}`}
							alt={`${restaurantName} — seçili görsel`}
							isActive={isActive}
							resolvedSrc={resolved}
							transition={galleryCrossfade}
							unoptimized
						/>
					);
				})}
			</div>
			{detailImageUrls.length > 0 ? (
				<div className="grid grid-cols-2 gap-3 rounded-2xl border border-stone-800 bg-stone-900 p-3">
					{gallery.thumbCells.map((cell, index) => (
						<button
							key={`thumb-slot-${index}`}
							type="button"
							className="relative h-32 overflow-hidden rounded-xl border border-stone-700 transition hover:border-amber-500/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/60"
							onClick={() => swapWithThumb(index)}
						>
							{[0, 1].map((layerIdx) => {
								const raw = cell.layers[layerIdx];
								const resolved = isNonEmptyUrl(raw) ? resolveApiMediaUrl(raw) : null;
								const isActive = layerIdx === cell.active;
								return (
									<motion.div
										key={`thumb-${index}-layer-${layerIdx}`}
										className="absolute inset-0"
										initial={false}
										style={{
											pointerEvents: "none",
											willChange: "opacity, filter, transform",
											zIndex: isActive ? 2 : 1,
										}}
										animate={{
											opacity: isActive ? 1 : 0,
											filter: isActive ? "blur(0px) brightness(1)" : "blur(10px) brightness(0.92)",
											scale: isActive ? 1 : 1.025,
										}}
										transition={thumbCrossfade}
									>
										{resolved ? (
											<Image
												alt={`${restaurantName} — galeri ${index + 1}`}
												className="object-cover"
												fill
												src={resolved}
												unoptimized
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center bg-stone-800/90 text-4xl text-stone-600">
												🖼
											</div>
										)}
									</motion.div>
								);
							})}
						</button>
					))}
				</div>
			) : null}
		</div>
	);
}
