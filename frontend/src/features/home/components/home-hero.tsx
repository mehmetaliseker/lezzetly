import { HomeRoleAwareCtaButtons } from "@/features/home/components/home-role-aware-cta-buttons";

export function HomeHero() {
	return (
		<section className="relative isolate -mt-[var(--header-height)] h-svh w-full overflow-hidden bg-stone-950">
			<div
				aria-hidden
				className="absolute inset-0 bg-fixed bg-center bg-cover"
				style={{ backgroundImage: "url('/hero_section.webp')" }}
			/>
			<div
				aria-hidden
				className="absolute inset-0 bg-linear-to-r from-stone-950/92 via-stone-950/75 to-stone-950/25 sm:via-stone-950/65"
			/>
			<div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-(--brand-light)/10 to-transparent" />
			<div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col justify-end px-4 pb-12 pt-[calc(var(--header-height)+3rem)] sm:px-6 sm:pb-16 sm:pt-[calc(var(--header-height)+3.5rem)] lg:justify-center lg:px-8 lg:pb-20 lg:pt-[calc(var(--header-height)+4rem)]">
				<div className="max-w-xl lg:max-w-2xl">
					<p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/90">
						Rezervasyon platformu
					</p>
					<h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-stone-50 sm:text-5xl lg:text-[3.3rem]">
						Seçkin mekânlarda yerinizi önceden ayırtın
					</h1>
					<p className="mt-5 max-w-lg text-base leading-relaxed text-stone-200/95 sm:text-lg">
						Misafirler için şeffaf rezervasyon; işletmeler için düzenli talep yönetimi. Tek platform,
						profesyonel deneyim.
					</p>
					<HomeRoleAwareCtaButtons variant="hero" />
				</div>
			</div>
		</section>
	);
}
