import Link from "next/link";

export function HomeFooter() {
	return (
		<footer className="border-t border-stone-800 bg-stone-950 text-stone-400">
			<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
				<div className="grid gap-10 sm:grid-cols-3">
					<div>
						<p className="font-display text-xl font-semibold text-stone-100">Lezzetly</p>
					</div>
					<div />
					<div />
				</div>
				<div className="mt-6 flex flex-col gap-4 border-t border-stone-800/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-stone-600">© {new Date().getFullYear()} Lezzetly. Tüm hakları saklıdır.</p>
					<div className="flex flex-wrap gap-x-6 gap-y-2">
						<Link className="text-xs text-stone-600 hover:text-stone-400" href="/gizlilik">
							Gizlilik Politikası
						</Link>
						<Link className="text-xs text-stone-600 hover:text-stone-400" href="/kullanim-sartlari">
							Kullanım şartları
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
