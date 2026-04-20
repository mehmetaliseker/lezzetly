import Link from "next/link";

import { cn } from "@/lib/cn";

const navMuted =
	"text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700/40";

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 border-b border-stone-200/90 bg-stone-50/85 backdrop-blur-md supports-[backdrop-filter]:bg-stone-50/70 dark:border-stone-800 dark:bg-stone-950/90">
			<div className="mx-auto flex h-[3.75rem] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
				<Link
					className="font-display text-lg font-semibold tracking-tight text-stone-900 transition-opacity hover:opacity-80 dark:text-stone-100"
					href="/"
				>
					Lezzetly
				</Link>
				<nav
					aria-label="Ana menü"
					className="flex items-center gap-1 sm:gap-6"
				>
					<div className="hidden items-center gap-6 md:flex">
						<Link className={navMuted} href="/">
							Ana sayfa
						</Link>
						<Link className={navMuted} href="/restaurants">
							Restoranlar
						</Link>
						<Link className={navMuted} href="/#nasil-calisir">
							Nasıl çalışır?
						</Link>
					</div>
					<div className="flex items-center gap-2 sm:gap-3">
						<Link
							className={cn(navMuted, "hidden rounded-md px-2 py-1.5 sm:inline-flex")}
							href="/login"
						>
							Giriş
						</Link>
						<Link
							className="inline-flex items-center justify-center rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-stone-50 shadow-sm ring-1 ring-stone-900/10 transition hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600/50 sm:px-4"
							href="/register"
						>
							Başlayın
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
}
