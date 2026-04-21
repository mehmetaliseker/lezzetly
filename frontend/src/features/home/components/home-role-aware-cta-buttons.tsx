"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useLogoutMutation } from "@/hooks/use-logout";
import { AppRoute, UserRolePath } from "@/types/enums";

type HomeRoleAwareCtaVariant = "hero" | "final";

type HomeRoleAwareCtaButtonsProps = {
	variant: HomeRoleAwareCtaVariant;
};

export function HomeRoleAwareCtaButtons({ variant }: HomeRoleAwareCtaButtonsProps) {
	const router = useRouter();
	const currentUserQuery = useCurrentUser();
	const logoutMutation = useLogoutMutation();

	const role = currentUserQuery.data?.role;
	const isCustomer = role === UserRolePath.CUSTOMER;
	const isOwner = role === UserRolePath.OWNER;

	const wrapClass =
		variant === "hero"
			? "mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
			: "mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4";

	const customerPrimaryClass =
		variant === "hero"
			? "inline-flex min-h-11 items-center justify-center rounded-md bg-stone-50 px-6 py-2.5 text-sm font-semibold text-stone-900 shadow-sm transition duration-200 hover:bg-white hover:shadow-md"
			: "inline-flex min-h-11 w-full items-center justify-center rounded-md bg-stone-50 px-8 py-2.5 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-white sm:w-auto";

	const ownerSecondaryClass =
		variant === "hero"
			? "inline-flex min-h-11 items-center justify-center rounded-md border border-stone-400/60 bg-transparent px-6 py-2.5 text-sm font-semibold text-stone-50 transition duration-200 hover:border-amber-200/50 hover:bg-stone-950/40"
			: "inline-flex min-h-11 w-full items-center justify-center rounded-md border border-stone-500 px-8 py-2.5 text-sm font-semibold text-stone-100 transition hover:border-amber-200/40 hover:bg-stone-800/80 sm:w-auto";

	const customerPrimaryLabel = variant === "hero" ? "Masa bul" : "Şimdi rezervasyon yap";
	const ownerSecondaryLabel = variant === "hero" ? "Restoranını kaydet" : "İşletmemi kaydet";

	const handleOwnerClickCustomerFlow = async (): Promise<void> => {
		try {
			await logoutMutation.mutateAsync();
		} catch {
			/* Oturum yine de temizlenir; yönlendirme her durumda */
		} finally {
			router.push(`${AppRoute.LOGIN}?type=customer`);
		}
	};

	const handleCustomerClickOwnerFlow = async (): Promise<void> => {
		try {
			await logoutMutation.mutateAsync();
		} catch {
			/* Oturum yine de temizlenir; yönlendirme her durumda */
		} finally {
			router.push(`${AppRoute.LOGIN}?type=owner`);
		}
	};

	const customerFlowHref = AppRoute.RESERVATION;
	const ownerFlowRegisterHref = `${AppRoute.LOGIN}?type=owner&tab=register`;
	const ownerProfileHref = AppRoute.OWNER_PROFILE;

	return (
		<div className={wrapClass}>
			{isOwner ? (
				<button
					type="button"
					disabled={logoutMutation.isPending}
					className={`${customerPrimaryClass} disabled:cursor-wait disabled:opacity-60`}
					onClick={() => void handleOwnerClickCustomerFlow()}
				>
					{logoutMutation.isPending ? "Yönlendiriliyor…" : customerPrimaryLabel}
				</button>
			) : (
				<Link className={customerPrimaryClass} href={customerFlowHref}>
					{customerPrimaryLabel}
				</Link>
			)}

			{isCustomer ? (
				<button
					type="button"
					disabled={logoutMutation.isPending}
					className={`${ownerSecondaryClass} disabled:cursor-wait disabled:opacity-60`}
					onClick={() => void handleCustomerClickOwnerFlow()}
				>
					{logoutMutation.isPending ? "Yönlendiriliyor…" : ownerSecondaryLabel}
				</button>
			) : isOwner ? (
				<Link className={ownerSecondaryClass} href={ownerProfileHref}>
					{ownerSecondaryLabel}
				</Link>
			) : (
				<Link className={ownerSecondaryClass} href={ownerFlowRegisterHref}>
					{ownerSecondaryLabel}
				</Link>
			)}
		</div>
	);
}
