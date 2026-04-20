import Link from "next/link";
import { cn } from "@/lib/cn";

const navMuted =
	"text-base font-medium text-stone-100 transition duration-200 hover:[text-shadow:0_0_10px_rgba(255,255,255,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700/40";

export function SiteHeader() {
	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-stone-800/55 bg-stone-950/72 backdrop-blur-xl backdrop-saturate-150">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
				<Link
					className="font-display text-lg font-semibold tracking-tight text-stone-50 transition-opacity hover:opacity-80"
					href="/"
				>
					Lezzetly
				</Link>
				<nav
					aria-label="Ana menü"
					className="flex items-center gap-1 sm:gap-6"
				>
					<div className="hidden items-center gap-8 md:flex">
						<Link className={navMuted} href="/">
							Ana sayfa
						</Link>
						<Link className={navMuted} href="/restaurants">
							Restoranlar
						</Link>
					</div>
					<div className="flex items-center gap-2 sm:gap-3">
						<Link
							className={cn(
								"inline-flex items-center justify-center rounded-md bg-stone-600 px-4 py-2 text-sm font-semibold text-stone-50 shadow-sm ring-1 ring-stone-500/40 transition hover:bg-stone-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/50 sm:px-5"
							)}
							href="/login"
						>
							Giriş Yap / Kayıt Ol
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
}
