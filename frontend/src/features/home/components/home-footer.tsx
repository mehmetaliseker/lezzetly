import Link from "next/link";

const footerLink = "text-sm text-stone-400 transition hover:text-stone-200";

export function HomeFooter() {
	return (
		<footer className="border-t border-stone-800 bg-stone-950 text-stone-400">
			<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
					<div className="lg:col-span-2">
						<p className="font-display text-xl font-semibold text-stone-100">Lezzetly</p>
						<p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-500">
							Seçkin restoranlarda rezervasyon deneyimini sadeleştirir; işletmelere düzenli talep
							yönetimi sunar.
						</p>
					</div>
					<div>
						<p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Ürün</p>
						<ul className="mt-4 flex flex-col gap-2">
							<li>
								<Link className={footerLink} href="/restaurants">
									Restoranlar
								</Link>
							</li>
							<li>
								<Link className={footerLink} href="/rezervasyon">
									Rezervasyon
								</Link>
							</li>
							<li>
								<Link className={footerLink} href="/#nasil-calisir">
									Nasıl çalışır?
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Hesap</p>
						<ul className="mt-4 flex flex-col gap-2">
							<li>
								<Link className={footerLink} href="/login">
									Giriş
								</Link>
							</li>
							<li>
								<Link className={footerLink} href="/register">
									Kayıt
								</Link>
							</li>
						</ul>
					</div>
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
