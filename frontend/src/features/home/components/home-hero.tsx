import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

export function HomeHero() {
	return (
		<section className="relative isolate min-h-[min(88vh,52rem)] w-full overflow-hidden bg-stone-950">
			<Image
				alt="Şık ve sıcak bir yemek mekânı atmosferi"
				className="object-cover object-center opacity-95"
				fill
				priority
				sizes="100vw"
				src="/hero_section.webp"
			/>
			<div
				aria-hidden
				className="absolute inset-0 bg-gradient-to-r from-stone-950/92 via-stone-950/75 to-stone-950/25 sm:via-stone-950/65"
			/>
			<div className="relative mx-auto flex min-h-[min(88vh,52rem)] w-full max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:justify-center lg:px-8 lg:pb-24 lg:pt-20">
				<div className="max-w-xl lg:max-w-2xl">
					<p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/90">
						Rezervasyon platformu
					</p>
					<h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-stone-50 sm:text-5xl lg:text-[3.25rem]">
						Seçkin mekânlarda yerinizi önceden ayırtın
					</h1>
					<p className="mt-5 max-w-lg text-base leading-relaxed text-stone-200/95 sm:text-lg">
						Misafirler için şeffaf rezervasyon; işletmeler için düzenli talep yönetimi. Tek platform,
						profesyonel deneyim.
					</p>
					<div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
						<Link
							className={cn(
								"inline-flex min-h-11 items-center justify-center rounded-md bg-stone-50 px-6 py-2.5 text-sm font-semibold text-stone-900 shadow-sm transition duration-200 hover:bg-white hover:shadow-md"
							)}
							href="/restaurants"
						>
							Masa bul
						</Link>
						<Link
							className="inline-flex min-h-11 items-center justify-center rounded-md border border-stone-400/60 bg-transparent px-6 py-2.5 text-sm font-semibold text-stone-50 transition duration-200 hover:border-amber-200/50 hover:bg-stone-950/40"
							href="/register"
						>
							Restoranını kaydet
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
