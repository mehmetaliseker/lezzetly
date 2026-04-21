import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";

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
					<div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
						<Link
							className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-stone-50 px-8 py-2.5 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-white sm:w-auto"
							href="/login?type=customer"
						>
							Şimdi rezervasyon yap
						</Link>
						<Link
							className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-stone-500 px-8 py-2.5 text-sm font-semibold text-stone-100 transition hover:border-amber-200/40 hover:bg-stone-800/80 sm:w-auto"
							href="/login?type=owner&tab=register"
						>
							İşletmemi kaydet
						</Link>
					</div>
				</div>
			</PageContainer>
		</section>
	);
}
