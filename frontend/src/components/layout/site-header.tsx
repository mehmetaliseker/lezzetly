"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useLogoutMutation } from "@/hooks/use-logout";
import { AppRoute, UserRolePath } from "@/types/enums";
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
			return "inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 shadow-sm transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 sm:px-5";
		case "secondary":
			return "inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 shadow-sm transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 sm:px-5";
		case "tertiary":
		default:
			return "inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 shadow-sm transition hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 sm:px-5";
	}
}

const logoutButtonClassName =
	"inline-flex items-center justify-center rounded-md bg-stone-700 px-4 py-2 text-sm font-semibold text-stone-100 shadow-sm transition hover:bg-red-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 sm:px-5";

const profileButtonClassName =
	"inline-flex items-center justify-center rounded-md border border-stone-600/90 bg-stone-900 px-4 py-2 text-sm font-semibold text-stone-100 shadow-sm transition hover:border-stone-500 hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/50 sm:px-5";

export function SiteHeader() {
	const router = useRouter();
	const variant = useNavbarVariant();
	const currentUserQuery = useCurrentUser();
	const logoutMutation = useLogoutMutation();
	const isAuthenticated = currentUserQuery.data != null;
	const isCustomer = currentUserQuery.data?.role === UserRolePath.CUSTOMER;
	const isOwner = currentUserQuery.data?.role === UserRolePath.OWNER;
	const shouldHideMenuLinks = variant === "primary" || variant === "secondary";
	const isAuthPage = variant === "secondary";

	return (
		<header className={resolveHeaderClassName(variant)}>
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
				<Link
					className="font-display text-lg font-semibold tracking-tight text-stone-50 transition-opacity hover:opacity-80"
					href={AppRoute.HOME}
				>
					Lezzetly
				</Link>
				<nav
					aria-label="Ana menü"
					className="flex items-center gap-1 sm:gap-6"
				>
					{shouldHideMenuLinks ? null : (
						<div className="hidden items-center gap-8 md:flex">
							{isCustomer ? (
								<Link className={navMuted} href={AppRoute.RESERVATION}>
									Rezervasyon
								</Link>
							) : isOwner ? (
								<>
									<Link className={navMuted} href={AppRoute.OWNER_PROFILE}>
										İşletme Profili
									</Link>
									<Link className={navMuted} href={AppRoute.OWNER_ACCOUNT}>
										Kişisel Profil
									</Link>
								</>
							) : (
								<>
									<Link className={navMuted} href={AppRoute.HOME}>
										Ana sayfa
									</Link>
									<Link className={navMuted} href={AppRoute.RESTAURANTS}>
										Restoranlar
									</Link>
								</>
							)}
						</div>
					)}
					<div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
						{isAuthenticated ? (
							<>
								{isOwner ? null : (
									<Link className={profileButtonClassName} href={AppRoute.PROFILE}>
										Profili Görüntüle
									</Link>
								)}
								<button
									className={logoutButtonClassName}
									onClick={async () => {
										await logoutMutation.mutateAsync();
										router.push(AppRoute.HOME);
									}}
									type="button"
								>
									Çıkış Yap
								</button>
							</>
						) : (
							<button
								disabled={isAuthPage}
								className={`${resolveLoginButtonClassName(variant)} disabled:cursor-not-allowed disabled:opacity-50`}
								onClick={() => router.push(AppRoute.LOGIN)}
								type="button"
							>
								Giriş Yap / Kayıt Ol
							</button>
						)}
					</div>
				</nav>
			</div>
		</header>
	);
}
