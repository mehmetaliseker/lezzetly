"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { ProfilePasswordInputs } from "@/components/auth/profile-password-inputs";
import { useToast } from "@/components/feedback/toast-center";
import { PageContainer } from "@/components/layout/page-container";
import { HomeFooter } from "@/features/home/components/home-footer";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import { FEATURE_FLAG_PROFILE_PASSWORD_VISIBILITY, isFeatureEnabled } from "@/lib/feature-flags";
import { queryKeys } from "@/lib/query-keys";
import { updateMe, updatePassword } from "@/services/auth";
import { parseUserRolePath, UserRolePath } from "@/types/enums";

export default function OwnerAccountPage() {
	const queryClient = useQueryClient();
	const toast = useToast();
	const currentUserQuery = useCurrentUser();
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [formKey, setFormKey] = useState<number>(0);

	const updateProfileMutation = useMutation({
		mutationFn: updateMe,
		onSuccess: (data) => {
			queryClient.setQueryData(queryKeys.auth.currentUser(), {
				...data,
				role: parseUserRolePath(data.role) ?? UserRolePath.CUSTOMER,
			});
			setIsEditing(false);
			setFormKey((k) => k + 1);
			toast.showSuccess("Profil bilgileri güncellendi");
		},
		onError: (error) => toast.showError(error.message),
	});

	const updatePasswordMutation = useMutation({
		mutationFn: (payload: { currentPassword: string; newPassword: string }) => updatePassword(payload),
		onSuccess: () => toast.showSuccess("Şifreniz güncellendi"),
		onError: (error) => toast.showError(error.message),
	});

	const user = currentUserQuery.data;
	const featureFlagsQuery = useFeatureFlags();
	const passwordVisibilityToggle = isFeatureEnabled(
		featureFlagsQuery.data,
		FEATURE_FLAG_PROFILE_PASSWORD_VISIBILITY
	);

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-stone-950">
			<PageContainer maxWidth="site" className="flex flex-1 py-10 sm:py-14">
				<section className="w-full rounded-2xl border border-stone-800 bg-stone-900/80 p-8 shadow-xl">
					<p className="text-sm font-semibold uppercase tracking-wide text-stone-400">İşletme hesabı</p>
					<div className="mt-2 flex items-center justify-between gap-3">
						<h1 className="text-3xl font-semibold text-stone-50">Profili güncelle</h1>
						<button
							type="button"
							className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-600 bg-stone-900 text-stone-200 transition hover:bg-stone-800"
							onClick={() => setIsEditing(true)}
						>
							<span className="text-base">✎</span>
						</button>
					</div>
					<p className="mt-2 text-sm text-stone-500">
						Kişisel bilgilerinizi buradan düzenleyin. İşletme ve görseller için üst menüden &quot;İşletme
						Profili&quot;ne gidin.
					</p>
					<form
						key={formKey}
						className="mt-8 grid gap-4 sm:grid-cols-2"
						onSubmit={(event) => {
							event.preventDefault();
							const formData = new FormData(event.currentTarget);
							updateProfileMutation.mutate({
								firstName: String(formData.get("firstName") ?? "").trim(),
								lastName: String(formData.get("lastName") ?? "").trim(),
								email: String(formData.get("email") ?? "").trim(),
								phone: String(formData.get("phone") ?? "").trim(),
							});
						}}
						onBlurCapture={(event) => {
							if (!isEditing) {
								return;
							}
							const next = event.relatedTarget as Node | null;
							if (event.currentTarget.contains(next)) {
								return;
							}
							window.requestAnimationFrame(() => {
								if (!isEditing) {
									return;
								}
								const active = document.activeElement;
								if (event.currentTarget.contains(active)) {
									return;
								}
								setIsEditing(false);
								setFormKey((k) => k + 1);
							});
						}}
					>
						<label className="flex flex-col gap-2 text-sm text-stone-300">
							Ad
							<input
								className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 disabled:opacity-60"
								defaultValue={user?.firstName ?? ""}
								disabled={!isEditing}
								name="firstName"
							/>
						</label>
						<label className="flex flex-col gap-2 text-sm text-stone-300">
							Soyad
							<input
								className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 disabled:opacity-60"
								defaultValue={user?.lastName ?? ""}
								disabled={!isEditing}
								name="lastName"
							/>
						</label>
						<label className="flex flex-col gap-2 text-sm text-stone-300 sm:col-span-2">
							E-posta
							<input
								className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 disabled:opacity-60"
								defaultValue={user?.email ?? ""}
								disabled={!isEditing}
								name="email"
								type="email"
							/>
						</label>
						<label className="flex flex-col gap-2 text-sm text-stone-300 sm:col-span-2">
							Telefon
							<input
								className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 disabled:opacity-60"
								defaultValue={user?.phone ?? ""}
								disabled={!isEditing}
								name="phone"
								type="tel"
							/>
						</label>
						{isEditing ? (
							<div className="flex gap-2 sm:col-span-2">
								<button
									className="inline-flex min-h-10 items-center justify-center rounded-md bg-stone-200 px-5 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
									disabled={updateProfileMutation.isPending}
									type="submit"
								>
									{updateProfileMutation.isPending ? "Kaydediliyor…" : "Kaydet"}
								</button>
								<button
									className="inline-flex min-h-10 items-center justify-center rounded-md border border-stone-600 bg-stone-900 px-5 py-2 text-sm font-semibold text-stone-100 transition hover:bg-stone-800"
									onClick={() => {
										setIsEditing(false);
										setFormKey((k) => k + 1);
									}}
									type="button"
								>
									İptal
								</button>
							</div>
						) : null}
					</form>

					<form
						className="mt-10 grid gap-4 border-t border-stone-800 pt-8 sm:grid-cols-2"
						onSubmit={(event) => {
							event.preventDefault();
							const formData = new FormData(event.currentTarget);
							updatePasswordMutation.mutate({
								currentPassword: String(formData.get("currentPassword") ?? ""),
								newPassword: String(formData.get("newPassword") ?? ""),
							});
							event.currentTarget.reset();
						}}
					>
						<h2 className="text-lg font-semibold text-stone-100 sm:col-span-2">Şifre güncelle</h2>
						<ProfilePasswordInputs visibilityToggleEnabled={passwordVisibilityToggle} />
						<div className="sm:col-span-2">
							<button
								className="inline-flex min-h-10 items-center justify-center rounded-md border border-stone-600 bg-stone-900 px-5 py-2 text-sm font-semibold text-stone-100 transition hover:bg-stone-800"
								disabled={updatePasswordMutation.isPending}
								type="submit"
							>
								{updatePasswordMutation.isPending ? "Güncelleniyor…" : "Şifreyi güncelle"}
							</button>
						</div>
					</form>
				</section>
			</PageContainer>
			<HomeFooter />
		</div>
	);
}
