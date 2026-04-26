"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const mobileMenuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!isMobileMenuOpen) {
			return;
		}
		const handlePointerDown = (event: MouseEvent) => {
			const target = event.target as Node | null;
			if (mobileMenuRef.current != null && target != null && !mobileMenuRef.current.contains(target)) {
				setIsMobileMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handlePointerDown);
		return () => document.removeEventListener("mousedown", handlePointerDown);
	}, [isMobileMenuOpen]);

	const closeMobileMenu = () => setIsMobileMenuOpen(false);

	return (
		<header className={resolveHeaderClassName(variant)}>
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
				<Link
					className="font-display text-lg font-semibold tracking-tight text-stone-50 transition-opacity hover:opacity-80"
					href={AppRoute.HOME}
				>
					Lezzetly
				</Link>
				<nav aria-label="Ana menü" className="flex items-center gap-1 sm:gap-6">
					<div className="hidden items-center gap-4 sm:gap-8 md:flex">
						{isCustomer ? (
							<Link className={navMuted} href={AppRoute.RESERVATION}>
								Rezervasyon
							</Link>
						) : null}
						{isCustomer ? (
							<Link className={navMuted} href={AppRoute.MY_RESERVATIONS}>
								Rezervasyonlarım
							</Link>
						) : null}
						{isCustomer ? (
							<Link className={navMuted} href={AppRoute.PROFILE}>
								Profili Görüntüle
							</Link>
						) : null}
						{isOwner ? (
							<Link className={navMuted} href={AppRoute.OWNER_PROFILE}>
								İşletme Profili
							</Link>
						) : null}
						{isOwner ? (
							<Link className={navMuted} href={AppRoute.OWNER_ACCOUNT}>
								Kişisel Profil
							</Link>
						) : null}
						{!isAuthenticated && !shouldHideMenuLinks ? (
							<Link className={navMuted} href={AppRoute.HOME}>
								Ana sayfa
							</Link>
						) : null}
						{!isAuthenticated && !shouldHideMenuLinks ? (
							<Link className={navMuted} href={AppRoute.RESTAURANTS}>
								Restoranlar
							</Link>
						) : null}
					</div>
					<div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
						{isAuthenticated ? (
							<>
								<div className="relative md:hidden" ref={mobileMenuRef}>
									<button
										className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-600 bg-stone-900 text-stone-100 transition hover:bg-stone-800"
										type="button"
										aria-expanded={isMobileMenuOpen}
										aria-label="Menüyü aç veya kapat"
										onClick={() => setIsMobileMenuOpen((value) => !value)}
									>
										<span className="text-lg leading-none">{isMobileMenuOpen ? "×" : "☰"}</span>
									</button>
									{isMobileMenuOpen ? (
										<div className="absolute right-0 top-12 z-50 min-w-52 rounded-md border border-stone-700 bg-stone-900 p-2 shadow-xl">
											<div className="flex flex-col gap-1">
												{isCustomer ? (
													<Link className={navMuted} href={AppRoute.RESERVATION} onClick={closeMobileMenu}>
														Rezervasyon
													</Link>
												) : null}
												{isCustomer ? (
													<Link className={navMuted} href={AppRoute.MY_RESERVATIONS} onClick={closeMobileMenu}>
														Rezervasyonlarım
													</Link>
												) : null}
												{isCustomer ? (
													<Link className={navMuted} href={AppRoute.PROFILE} onClick={closeMobileMenu}>
														Profili Görüntüle
													</Link>
												) : null}
												{isOwner ? (
													<Link className={navMuted} href={AppRoute.OWNER_PROFILE} onClick={closeMobileMenu}>
														İşletme Profili
													</Link>
												) : null}
												{isOwner ? (
													<Link className={navMuted} href={AppRoute.OWNER_ACCOUNT} onClick={closeMobileMenu}>
														Kişisel Profil
													</Link>
												) : null}
											</div>
										</div>
									) : null}
								</div>
								<button
									className={logoutButtonClassName}
									onClick={async () => {
										closeMobileMenu();
										try {
											await logoutMutation.mutateAsync();
										} catch {
											/* Yerel oturum temizliği onSettled içinde garanti edilir */
										} finally {
											router.push(AppRoute.HOME);
										}
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
								onClick={() => {
									closeMobileMenu();
									router.push(AppRoute.LOGIN);
								}}
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
