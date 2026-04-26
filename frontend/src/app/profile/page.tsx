"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { ProfilePasswordInputs } from "@/components/auth/profile-password-inputs";
import { HomeFooter } from "@/features/home/components/home-footer";
import { PageContainer } from "@/components/layout/page-container";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import { updateMe, updatePassword } from "@/services/auth";
import {
	FEATURE_FLAG_PROFILE_PASSWORD_CHANGE,
	FEATURE_FLAG_PROFILE_PASSWORD_VISIBILITY,
	isFeatureEnabled,
} from "@/lib/feature-flags";
import { queryKeys } from "@/lib/query-keys";
import { useToast } from "@/components/feedback/toast-center";
import { parseUserRolePath, UserRolePath } from "@/types/enums";

type ProfileFormValues = {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	currentPassword: string;
	newPassword: string;
};

export default function ProfilePage() {
	const queryClient = useQueryClient();
	const toast = useToast();
	const currentUserQuery = useCurrentUser();

	const user = currentUserQuery.data;
	const featureFlagsQuery = useFeatureFlags();
	const passwordVisibilityToggle = isFeatureEnabled(
		featureFlagsQuery.data,
		FEATURE_FLAG_PROFILE_PASSWORD_VISIBILITY
	);
	const profilePasswordChangeEnabled = isFeatureEnabled(
		featureFlagsQuery.data,
		FEATURE_FLAG_PROFILE_PASSWORD_CHANGE
	);
	const canRenderPasswordFields = Boolean(user) && user?.role === UserRolePath.CUSTOMER && profilePasswordChangeEnabled;
	const initialProfileValues = useMemo(
		() => ({
			firstName: user?.firstName ?? "",
			lastName: user?.lastName ?? "",
			email: user?.email ?? "",
			phone: user?.phone ?? "",
		}),
		[user]
	);
	const [formValues, setFormValues] = useState<ProfileFormValues>({
		currentPassword: "",
		newPassword: "",
	});
	const resolvedValues = {
		firstName: formValues.firstName ?? initialProfileValues.firstName,
		lastName: formValues.lastName ?? initialProfileValues.lastName,
		email: formValues.email ?? initialProfileValues.email,
		phone: formValues.phone ?? initialProfileValues.phone,
	};

	const saveMutation = useMutation({
		mutationFn: async () => {
			const payload = {
				firstName: resolvedValues.firstName.trim(),
				lastName: resolvedValues.lastName.trim(),
				email: resolvedValues.email.trim(),
				phone: resolvedValues.phone.trim(),
			};
			const isProfileChanged =
				payload.firstName !== initialProfileValues.firstName ||
				payload.lastName !== initialProfileValues.lastName ||
				payload.email !== initialProfileValues.email ||
				payload.phone !== initialProfileValues.phone;
			const hasAnyPasswordInput =
				canRenderPasswordFields &&
				(formValues.currentPassword.length > 0 || formValues.newPassword.length > 0);
			const shouldUpdatePassword = canRenderPasswordFields && formValues.currentPassword.trim().length > 0 && formValues.newPassword.trim().length > 0;

			if (hasAnyPasswordInput && !shouldUpdatePassword) {
				throw new Error("Mevcut şifre ve yeni şifre zorunludur");
			}
			if (!isProfileChanged && !shouldUpdatePassword) {
				return;
			}

			let updatedProfile = null as Awaited<ReturnType<typeof updateMe>> | null;
			if (isProfileChanged) {
				updatedProfile = await updateMe(payload);
			}
			if (shouldUpdatePassword) {
				await updatePassword({
					currentPassword: formValues.currentPassword,
					newPassword: formValues.newPassword,
				});
			}
			return { updatedProfile, isProfileChanged, shouldUpdatePassword };
		},
		onSuccess: (result) => {
			if (result == null) {
				return;
			}
			if (result.updatedProfile != null) {
				queryClient.setQueryData(queryKeys.auth.currentUser(), {
					...result.updatedProfile,
					role: parseUserRolePath(result.updatedProfile.role) ?? UserRolePath.CUSTOMER,
				});
			}
			const nextInitialValues = {
				firstName: result.updatedProfile?.firstName ?? initialProfileValues.firstName,
				lastName: result.updatedProfile?.lastName ?? initialProfileValues.lastName,
				email: result.updatedProfile?.email ?? initialProfileValues.email,
				phone: result.updatedProfile?.phone ?? initialProfileValues.phone,
			};
			setFormValues({
				firstName: nextInitialValues.firstName,
				lastName: nextInitialValues.lastName,
				email: nextInitialValues.email,
				phone: nextInitialValues.phone,
				currentPassword: "",
				newPassword: "",
			});
			if (result.isProfileChanged && result.shouldUpdatePassword) {
				toast.showSuccess("Profil ve şifre bilgileri güncellendi");
				return;
			}
			if (result.isProfileChanged) {
				toast.showSuccess("Profil bilgileri güncellendi");
				return;
			}
			if (result.shouldUpdatePassword) {
				toast.showSuccess("Şifreniz güncellendi");
			}
		},
		onError: (error) => {
			toast.showError(error.message);
		},
	});

	const normalizedValues = {
		firstName: resolvedValues.firstName.trim(),
		lastName: resolvedValues.lastName.trim(),
		email: resolvedValues.email.trim(),
		phone: resolvedValues.phone.trim(),
	};
	const isProfileChanged =
		normalizedValues.firstName !== initialProfileValues.firstName ||
		normalizedValues.lastName !== initialProfileValues.lastName ||
		normalizedValues.email !== initialProfileValues.email ||
		normalizedValues.phone !== initialProfileValues.phone;
	const hasAnyPasswordInput =
		canRenderPasswordFields &&
		(formValues.currentPassword.length > 0 || formValues.newPassword.length > 0);
	const hasFullPasswordInput =
		formValues.currentPassword.trim().length > 0 && formValues.newPassword.trim().length > 0;
	const hasInvalidPasswordInput = hasAnyPasswordInput && !hasFullPasswordInput;
	const isSubmitDisabled =
		saveMutation.isPending || (!isProfileChanged && !hasAnyPasswordInput) || hasInvalidPasswordInput;

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-stone-950">
			<PageContainer maxWidth="site" className="flex flex-1 items-center py-10 sm:py-14">
				<section className="w-full rounded-2xl border border-stone-800 bg-stone-900/80 p-8 shadow-xl">
					<p className="text-sm font-semibold uppercase tracking-wide text-stone-400">Müşteri alanı</p>
					<h1 className="mt-2 text-3xl font-semibold text-stone-50">Profil Bilgileri</h1>
					<form
						className="mt-8 grid gap-4 sm:grid-cols-2"
						onSubmit={(event) => {
							event.preventDefault();
							if (isSubmitDisabled) {
								if (hasInvalidPasswordInput) {
									toast.showError("Mevcut şifre ve yeni şifre zorunludur");
								}
								return;
							}
							saveMutation.mutate();
						}}
					>
						<label className="flex flex-col gap-2 text-sm text-stone-300">
							Ad
							<input
								className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
								value={resolvedValues.firstName}
								onChange={(event) =>
									setFormValues((previous) => ({ ...previous, firstName: event.target.value }))
								}
								name="firstName"
							/>
						</label>
						<label className="flex flex-col gap-2 text-sm text-stone-300">
							Soyad
							<input
								className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
								value={resolvedValues.lastName}
								onChange={(event) =>
									setFormValues((previous) => ({ ...previous, lastName: event.target.value }))
								}
								name="lastName"
							/>
						</label>
						<label className="flex flex-col gap-2 text-sm text-stone-300 sm:col-span-2">
							E-posta
							<input
								className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
								value={resolvedValues.email}
								onChange={(event) =>
									setFormValues((previous) => ({ ...previous, email: event.target.value }))
								}
								name="email"
								type="email"
							/>
						</label>
						<label className="flex flex-col gap-2 text-sm text-stone-300 sm:col-span-2">
							Telefon
							<input
								className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
								value={resolvedValues.phone}
								onChange={(event) => {
									const nextPhone = event.target.value.replace(/\D/g, "").slice(0, 11);
									setFormValues((previous) => ({ ...previous, phone: nextPhone }));
								}}
								name="phone"
								type="tel"
								inputMode="numeric"
								maxLength={11}
							/>
						</label>
						{canRenderPasswordFields ? (
							<>
								<h2 className="mt-4 text-lg font-semibold text-stone-100 sm:col-span-2">Şifre güncelle</h2>
								<ProfilePasswordInputs
									visibilityToggleEnabled={passwordVisibilityToggle}
									currentPassword={formValues.currentPassword}
									newPassword={formValues.newPassword}
									onCurrentPasswordChange={(value) =>
										setFormValues((previous) => ({ ...previous, currentPassword: value }))
									}
									onNewPasswordChange={(value) =>
										setFormValues((previous) => ({ ...previous, newPassword: value }))
									}
								/>
							</>
						) : null}
						<div className="flex gap-2 sm:col-span-2">
							<button
								className="inline-flex min-h-10 items-center justify-center rounded-md bg-stone-200 px-5 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
								disabled={isSubmitDisabled}
								type="submit"
							>
								{saveMutation.isPending ? "Kaydediliyor…" : "Kaydet"}
							</button>
							<button
								className="inline-flex min-h-10 items-center justify-center rounded-md border border-stone-600 bg-stone-900 px-5 py-2 text-sm font-semibold text-stone-100 transition hover:bg-stone-800"
								onClick={() =>
									setFormValues({
										currentPassword: "",
										newPassword: "",
									})
								}
								type="button"
							>
								İptal
							</button>
						</div>
					</form>
				</section>
			</PageContainer>
			<HomeFooter />
		</div>
	);
}
