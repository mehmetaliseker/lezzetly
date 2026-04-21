import { PageContainer } from "@/components/layout/page-container";
import { HomeRoleAwareCtaButtons } from "@/features/home/components/home-role-aware-cta-buttons";

export function HomeFinalCta() {
	return (
		<section className="home-section home-section-compact relative overflow-hidden">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{ backgroundImage: "url('/side5.jpeg')" }}
			/>
			<div aria-hidden className="pointer-events-none absolute inset-0 bg-black/50" />
			<PageContainer maxWidth="xl" className="relative z-10 flex w-full max-w-7xl flex-col justify-center">
				<div className="mx-auto max-w-3xl text-center">
					<h2 className="font-display text-3xl font-semibold tracking-tight text-stone-50 sm:text-4xl">
						Hazır olduğunuzda bir sonraki adım sizin
					</h2>
					<p className="mt-4 text-base leading-relaxed text-stone-300 sm:text-lg">
						Masa ayırtın veya işletmenizi platforma taşıyın. Akışlar ürünle birlikte gelişecek; bugün
						atacağınız adım yarınki deneyimin temelidir.
					</p>
					<HomeRoleAwareCtaButtons variant="final" />
				</div>
			</PageContainer>
		</section>
	);
}
