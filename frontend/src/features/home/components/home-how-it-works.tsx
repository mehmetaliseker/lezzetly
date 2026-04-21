import { PageContainer } from "@/components/layout/page-container";

function IconCalendar() {
	return (
		<svg aria-hidden className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
			<path
				d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function IconBuilding() {
	return (
		<svg aria-hidden className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
			<path
				d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-9H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function IconCheck() {
	return (
		<svg aria-hidden className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
			<path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function IconSpark() {
	return (
		<svg aria-hidden className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
			<path
				d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

const customerSteps = [
	{ title: "Mekân seçin", text: "Şehir ve saatlik ücret bilgisine göre karşılaştırın.", icon: IconBuilding },
	{ title: "Tarih ve saat", text: "Uygun zaman diliminde talebinizi iletin.", icon: IconCalendar },
	{ title: "Onay ve özet", text: "Süre ve tutar sunucuda hesaplanır; kayıt altına alınır.", icon: IconCheck },
];

const ownerSteps = [
	{ title: "Kayıt", text: "İşletmenizi tanımlayın; doğrulama adımları ürünle genişler.", icon: IconSpark },
	{ title: "Talepleri yönetin", text: "Gelen rezervasyonları tek akışta görün.", icon: IconCalendar },
	{ title: "Büyütün", text: "Doluluk ve müşteri deneyimini standartlaştırın.", icon: IconCheck },
];

export function HomeHowItWorks() {
	return (
		<section className="home-section border-b border-stone-200/80 bg-brand-light" id="nasil-calisir">
			<PageContainer maxWidth="xl" className="flex w-full max-w-7xl flex-col justify-center">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
						Nasıl çalışır?
					</h2>
					<p className="mt-4 text-base text-stone-600 sm:text-lg">
						Misafir ve işletme yolları birbirini tamamlar; karmaşık süreç yoktur.
					</p>
				</div>
				<div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-900/85">
							Misafirler için
						</h3>
						<ul className="mt-8 flex flex-col gap-8">
							{customerSteps.map((step, i) => {
								const StepIcon = step.icon;
								return (
								<li className="flex gap-5" key={step.title}>
									<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-amber-900/90 shadow-sm">
										<StepIcon />
									</span>
									<div>
										<p className="text-xs font-medium text-stone-400">Adım {i + 1}</p>
										<p className="mt-1 font-display text-lg font-semibold text-stone-900">{step.title}</p>
										<p className="mt-2 text-sm leading-relaxed text-stone-600">{step.text}</p>
									</div>
								</li>
								);
							})}
						</ul>
					</div>
					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-900/85">
							İşletmeler için
						</h3>
						<ul className="mt-8 flex flex-col gap-8">
							{ownerSteps.map((step, i) => {
								const StepIcon = step.icon;
								return (
								<li className="flex gap-5" key={step.title}>
									<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-amber-900/90 shadow-sm">
										<StepIcon />
									</span>
									<div>
										<p className="text-xs font-medium text-stone-400">Adım {i + 1}</p>
										<p className="mt-1 font-display text-lg font-semibold text-stone-900">{step.title}</p>
										<p className="mt-2 text-sm leading-relaxed text-stone-600">{step.text}</p>
									</div>
								</li>
								);
							})}
						</ul>
					</div>
				</div>
			</PageContainer>
		</section>
	);
}
