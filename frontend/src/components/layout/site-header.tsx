"use client";

import Link from "next/link";

import { useNavbarVariant } from "../../hooks/use-navbar-variant";

const navMuted =
	"text-base font-medium text-stone-100 transition duration-200 hover:[text-shadow:0_0_10px_rgba(255,255,255,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700/40";

function resolveHeaderClassName(variant: "primary" | "secondary" | "tertiary"): string {
	switch (variant) {
		case "primary":
			return "fixed inset-x-0 top-0 z-50 border-b border-stone-800/55 bg-stone-950/72 backdrop-blur-xl backdrop-saturate-150";
		case "secondary":
			return "fixed inset-x-0 top-0 z-50 border-b border-stone-800 bg-stone-950";
		case "tertiary":
		default:
			return "fixed inset-x-0 top-0 z-50 border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md";
	}
}

function resolveLoginButtonClassName(variant: "primary" | "secondary" | "tertiary"): string {
	switch (variant) {
		case "primary":
			return "inline-flex items-center justify-center rounded-md bg-stone-500 px-4 py-2 text-sm font-semibold text-stone-50 shadow-sm ring-1 ring-stone-500/40 transition hover:bg-stone-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/50 sm:px-5";
		case "secondary":
			return "inline-flex items-center justify-center rounded-md border border-stone-600/90 bg-stone-900 px-4 py-2 text-sm font-semibold text-stone-100 shadow-sm transition hover:border-stone-500 hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/50 sm:px-5";
		case "tertiary":
		default:
			return "inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 shadow-sm transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 sm:px-5";
	}
}

export function SiteHeader() {
	const variant = useNavbarVariant();
	const shouldHideMenuLinks = variant === "primary" || variant === "secondary";

	return (
		<header className={resolveHeaderClassName(variant)}>
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
					{shouldHideMenuLinks ? null : (
						<div className="hidden items-center gap-8 md:flex">
							<Link className={navMuted} href="/">
								Ana sayfa
							</Link>
							<Link className={navMuted} href="/restaurants">
								Restoranlar
							</Link>
						</div>
					)}
					<div className="flex items-center gap-2 sm:gap-3">
						<Link className={resolveLoginButtonClassName(variant)} href="/login">
							Giriş Yap / Kayıt Ol
						</Link>
					</div>
				</nav>
			</div>
		</header>
	);
}
