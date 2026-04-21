"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { type FileUploadSelectEvent } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { useCallback, useMemo, useRef, useState } from "react";

import { OwnerProfileImageUpload } from "@/components/owner/owner-profile-image-upload";
import { RestaurantHourSelect } from "@/components/owner/restaurant-hour-select";
import { PageContainer } from "@/components/layout/page-container";
import { useToast } from "@/components/feedback/toast-center";
import { HomeFooter } from "@/features/home/components/home-footer";
import { queryKeys } from "@/lib/query-keys";
import { normalizeRestaurantHourToSelectValue } from "@/lib/restaurant-hours";
import { resolveApiMediaUrl } from "@/lib/media-url";
import {
	createOwnerRestaurantProfile,
	fetchOwnerRestaurantProfile,
	updateOwnerRestaurantProfile,
	uploadOwnerRestaurantImages,
	type OwnerRestaurantProfileResponse,
	type UpdateOwnerRestaurantProfilePayload,
} from "@/services/restaurants";

const MAX_IMAGE_BYTES = 1_000_000;

function revokeIfBlob(url: string | null): void {
	if (url != null && url.startsWith("blob:")) {
		URL.revokeObjectURL(url);
	}
}

function buildProfilePayload(formData: FormData): UpdateOwnerRestaurantProfilePayload {
	return {
		name: String(formData.get("name") ?? "").trim(),
		city: String(formData.get("city") ?? "").trim(),
		description: String(formData.get("description") ?? "").trim(),
		address: String(formData.get("address") ?? "").trim(),
		phone: String(formData.get("phone") ?? "").trim(),
		capacity: Number(formData.get("capacity") ?? "1"),
		pricePerHour: Number(formData.get("pricePerHour") ?? "0"),
		openingTime: String(formData.get("openingTime") ?? "").trim(),
		closingTime: String(formData.get("closingTime") ?? "").trim(),
	};
}

function profileToBaselinePayload(profile: OwnerRestaurantProfileResponse): UpdateOwnerRestaurantProfilePayload {
	return {
		name: (profile.name ?? "").trim(),
		city: (profile.city ?? "").trim(),
		description: (profile.description ?? "").trim(),
		address: (profile.address ?? "").trim(),
		phone: (profile.phone ?? "").trim(),
		capacity: Number(profile.capacity ?? 1),
		pricePerHour: Number(profile.pricePerHour ?? 0),
		openingTime: normalizeRestaurantHourToSelectValue(profile.openingTime, 9),
		closingTime: normalizeRestaurantHourToSelectValue(profile.closingTime, 22),
	};
}

type PendingImageFiles = {
	main?: File | null;
	detail1?: File | null;
	detail2?: File | null;
};

function payloadsEqual(
	a: UpdateOwnerRestaurantProfilePayload,
	b: UpdateOwnerRestaurantProfilePayload
): boolean {
	return (
		a.name === b.name &&
		a.city === b.city &&
		a.description === b.description &&
		a.address === b.address &&
		a.phone === b.phone &&
		Number(a.capacity) === Number(b.capacity) &&
		Number(a.pricePerHour) === Number(b.pricePerHour) &&
		a.openingTime === b.openingTime &&
		a.closingTime === b.closingTime
	);
}

export default function OwnerRestaurantProfilePage() {
	const queryClient = useQueryClient();
	const toast = useToast();
	const formRef = useRef<HTMLFormElement>(null);
	const [mainFile, setMainFile] = useState<File | null>(null);
	const [detail1File, setDetail1File] = useState<File | null>(null);
	const [detail2File, setDetail2File] = useState<File | null>(null);
	const [mainBlobUrl, setMainBlobUrl] = useState<string | null>(null);
	const [detail1BlobUrl, setDetail1BlobUrl] = useState<string | null>(null);
	const [detail2BlobUrl, setDetail2BlobUrl] = useState<string | null>(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	const ownerProfileQuery = useQuery({
		queryKey: queryKeys.owner.restaurantProfile(),
		queryFn: fetchOwnerRestaurantProfile,
		retry: false,
	});

	const createMutation = useMutation({
		mutationFn: createOwnerRestaurantProfile,
	});

	const updateMutation = useMutation({
		mutationFn: updateOwnerRestaurantProfile,
	});

	const uploadMutation = useMutation({
		mutationFn: (formData: FormData) => uploadOwnerRestaurantImages(formData),
	});

	const ownerProfile: OwnerRestaurantProfileResponse | undefined = ownerProfileQuery.data;

	const lacksRestaurant = ownerProfile?.restaurantId == null;
	const submitLabel = lacksRestaurant ? "İşletmeyi oluştur" : "İşletmeyi güncelle";

	const formIdentityKey =
		ownerProfile?.restaurantId != null
			? `restaurant-${ownerProfile.restaurantId}-${ownerProfileQuery.dataUpdatedAt}`
			: `new-profile-${ownerProfileQuery.dataUpdatedAt}`;

	const { serverMainPreview, serverDetail1Preview, serverDetail2Preview } = useMemo(() => {
		if (ownerProfile == null) {
			return {
				serverMainPreview: null as string | null,
				serverDetail1Preview: null as string | null,
				serverDetail2Preview: null as string | null,
			};
		}
		const d1 = ownerProfile.detailImageUrls[0];
		const d2 = ownerProfile.detailImageUrls[1];
		return {
			serverMainPreview:
				ownerProfile.mainImageUrl != null && ownerProfile.mainImageUrl.length > 0
					? resolveApiMediaUrl(ownerProfile.mainImageUrl)
					: null,
			serverDetail1Preview: d1 != null && d1.length > 0 ? resolveApiMediaUrl(d1) : null,
			serverDetail2Preview: d2 != null && d2.length > 0 ? resolveApiMediaUrl(d2) : null,
		};
	}, [ownerProfile]);

	const mainPreview = mainBlobUrl ?? serverMainPreview;
	const detail1Preview = detail1BlobUrl ?? serverDetail1Preview;
	const detail2Preview = detail2BlobUrl ?? serverDetail2Preview;

	const updateDirtyFlag = useCallback(
		(pendingFiles?: PendingImageFiles) => {
			const profile =
				queryClient.getQueryData<OwnerRestaurantProfileResponse>(queryKeys.owner.restaurantProfile()) ??
				ownerProfile;
			const hasRow = profile?.restaurantId != null;
			if (!hasRow || profile == null) {
				setHasUnsavedChanges(true);
				return;
			}
			const el = formRef.current;
			if (el == null) {
				setHasUnsavedChanges(false);
				return;
			}
			const current = buildProfilePayload(new FormData(el));
			const baseline = profileToBaselinePayload(profile);
			const main = pendingFiles?.main !== undefined ? pendingFiles.main : mainFile;
			const d1 = pendingFiles?.detail1 !== undefined ? pendingFiles.detail1 : detail1File;
			const d2 = pendingFiles?.detail2 !== undefined ? pendingFiles.detail2 : detail2File;
			const filesChanged = main != null || d1 != null || d2 != null;
			const textsMatch = payloadsEqual(current, baseline);
			setHasUnsavedChanges(filesChanged || !textsMatch);
		},
		[detail1File, detail2File, mainFile, ownerProfile, queryClient]
	);

	const bumpFormInteraction = useCallback(() => {
		updateDirtyFlag();
	}, [updateDirtyFlag]);

	const assignFormRef = useCallback(
		(element: HTMLFormElement | null) => {
			formRef.current = element;
			if (element != null) {
				queueMicrotask(() => {
					updateDirtyFlag();
				});
			}
		},
		[updateDirtyFlag]
	);

	const onSelectMain = useCallback(
		(event: FileUploadSelectEvent) => {
			const file = event.files?.[0];
			if (!file) {
				return;
			}
			if (file.size > MAX_IMAGE_BYTES) {
				toast.showError("Dosya boyutu en fazla 1 MB olabilir");
				return;
			}
			setMainFile(file);
			setMainBlobUrl((previous) => {
				revokeIfBlob(previous);
				return URL.createObjectURL(file);
			});
			updateDirtyFlag({ main: file });
		},
		[toast, updateDirtyFlag]
	);

	const onSelectDetail1 = useCallback(
		(event: FileUploadSelectEvent) => {
			const file = event.files?.[0];
			if (!file) {
				return;
			}
			if (file.size > MAX_IMAGE_BYTES) {
				toast.showError("Dosya boyutu en fazla 1 MB olabilir");
				return;
			}
			setDetail1File(file);
			setDetail1BlobUrl((previous) => {
				revokeIfBlob(previous);
				return URL.createObjectURL(file);
			});
			updateDirtyFlag({ detail1: file });
		},
		[toast, updateDirtyFlag]
	);

	const onSelectDetail2 = useCallback(
		(event: FileUploadSelectEvent) => {
			const file = event.files?.[0];
			if (!file) {
				return;
			}
			if (file.size > MAX_IMAGE_BYTES) {
				toast.showError("Dosya boyutu en fazla 1 MB olabilir");
				return;
			}
			setDetail2File(file);
			setDetail2BlobUrl((previous) => {
				revokeIfBlob(previous);
				return URL.createObjectURL(file);
			});
			updateDirtyFlag({ detail2: file });
		},
		[toast, updateDirtyFlag]
	);

	const saveRestaurant = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const form = event.currentTarget;
			const formData = new FormData(form);
			const payload = buildProfilePayload(formData);

			if (payload.openingTime >= payload.closingTime) {
				toast.showError("Kapanış saati, açılış saatinden sonra olmalıdır.");
				return;
			}

			const imageFormData = new FormData();
			if (mainFile) {
				imageFormData.append("mainImage", mainFile);
			}
			if (detail1File) {
				imageFormData.append("detailImage1", detail1File);
			}
			if (detail2File) {
				imageFormData.append("detailImage2", detail2File);
			}
			const hasImages = mainFile != null || detail1File != null || detail2File != null;

			const snapshot = queryClient.getQueryData<OwnerRestaurantProfileResponse>(
				queryKeys.owner.restaurantProfile()
			);
			const hadRestaurant = snapshot?.restaurantId != null;

			try {
				let createdInThisSubmit = false;
				if (hadRestaurant) {
					await updateMutation.mutateAsync(payload);
				} else {
					await createMutation.mutateAsync(payload);
					createdInThisSubmit = true;
				}
				if (hasImages) {
					await uploadMutation.mutateAsync(imageFormData);
				}
				await queryClient.invalidateQueries({ queryKey: queryKeys.owner.restaurantProfile() });
				await queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.all });
				await queryClient.fetchQuery({
					queryKey: queryKeys.owner.restaurantProfile(),
					queryFn: fetchOwnerRestaurantProfile,
				});
				setMainFile(null);
				setDetail1File(null);
				setDetail2File(null);
				setMainBlobUrl((previous) => {
					revokeIfBlob(previous);
					return null;
				});
				setDetail1BlobUrl((previous) => {
					revokeIfBlob(previous);
					return null;
				});
				setDetail2BlobUrl((previous) => {
					revokeIfBlob(previous);
					return null;
				});
				if (createdInThisSubmit) {
					toast.showSuccess(
						hasImages ? "İşletme oluşturuldu ve görseller yüklendi" : "İşletme profili oluşturuldu"
					);
				} else {
					toast.showSuccess(
						hasImages ? "İşletme güncellendi ve görseller yüklendi" : "İşletme bilgileri güncellendi"
					);
				}
				updateDirtyFlag({ main: null, detail1: null, detail2: null });
			} catch (error) {
				const message = error instanceof Error ? error.message : "Kayıt tamamlanamadı";
				toast.showError(message);
			}
		},
		[
			createMutation,
			detail1File,
			detail2File,
			mainFile,
			queryClient,
			toast,
			updateMutation,
			uploadMutation,
			updateDirtyFlag,
		]
	);

	const isSaving = createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;
	const submitDisabled = isSaving || (!lacksRestaurant && !hasUnsavedChanges);

	if (ownerProfileQuery.isLoading) {
		return (
			<div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-stone-950 text-stone-300">
				Yükleniyor…
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-stone-950">
			<PageContainer maxWidth="site" className="flex flex-1 py-10 sm:py-14">
				<section className="w-full rounded-2xl border border-stone-800 bg-stone-900/80 p-8 shadow-xl">
					<h1 className="text-3xl font-semibold text-stone-50">İşletme profili</h1>
					<p className="mt-2 text-sm text-stone-500">
						Restoran bilgileri ve görseller. Kişisel profil ve şifre için &quot;Profili Güncelle&quot; menüsünü
						kullanın.
					</p>
					{ownerProfileQuery.isError ? (
						<p className="mt-4 text-sm text-red-400">İşletme profili alınamadı.</p>
					) : null}
					{lacksRestaurant ? (
						<p className="mt-4 rounded-md border border-amber-700/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">
							Henüz kayıtlı işletme yok. Formu doldurup alttaki düğme ile oluşturabilirsiniz; dilerseniz aynı
							anda görsel de seçebilirsiniz.
						</p>
					) : null}

					<form
						key={formIdentityKey}
						ref={assignFormRef}
						className="mt-6 flex flex-col gap-6"
						onChange={bumpFormInteraction}
						onInput={bumpFormInteraction}
						onSubmit={saveRestaurant}
					>
						<div className="grid gap-4 sm:grid-cols-2">
							<label className="flex flex-col gap-2 text-sm text-stone-300">
								Restoran adı
								<input
									className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
									defaultValue={ownerProfile?.name ?? ""}
									name="name"
									required
								/>
							</label>
							<label className="flex flex-col gap-2 text-sm text-stone-300">
								Şehir
								<input
									className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
									defaultValue={ownerProfile?.city ?? ""}
									name="city"
									required
								/>
							</label>
							<label className="flex flex-col gap-2 text-sm text-stone-300">
								Adres
								<input
									className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
									defaultValue={ownerProfile?.address ?? ""}
									name="address"
								/>
							</label>
							<label className="flex flex-col gap-2 text-sm text-stone-300">
								İşletme telefonu
								<input
									className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
									defaultValue={ownerProfile?.phone ?? ""}
									name="phone"
								/>
							</label>
							<label className="flex flex-col gap-2 text-sm text-stone-300 sm:col-span-2">
								Açıklama
								<textarea
									className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
									defaultValue={ownerProfile?.description ?? ""}
									name="description"
								/>
							</label>
							<label className="flex flex-col gap-2 text-sm text-stone-300">
								Masa sayısı
								<input
									className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
									defaultValue={ownerProfile?.capacity ?? 1}
									min={1}
									name="capacity"
									required
									type="number"
								/>
							</label>
							<label className="flex flex-col gap-2 text-sm text-stone-300">
								Saatlik ücret (TL)
								<input
									className="rounded-md border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
									defaultValue={ownerProfile?.pricePerHour ?? 100}
									min={0}
									name="pricePerHour"
									required
									step="0.01"
									type="number"
								/>
							</label>
							<RestaurantHourSelect
								defaultStoredTime={ownerProfile?.openingTime}
								fallbackHour={9}
								label="Açılış saati"
								name="openingTime"
							/>
							<RestaurantHourSelect
								defaultStoredTime={ownerProfile?.closingTime}
								fallbackHour={22}
								label="Kapanış saati"
								name="closingTime"
							/>
						</div>

						<div className="border-t border-stone-800 pt-6">
							<h2 className="text-lg font-semibold text-stone-100">Görseller</h2>
							<p className="mt-1 text-sm text-stone-500">
								Soldan dosya seçin; sağdaki kutularda sunucudaki veya yeni seçtiğiniz önizleme görünür. En
								fazla 1 MB, yalnızca görsel.
							</p>
							<Tooltip target=".owner-upload-choose-main" content="Ana görsel seç" position="bottom" />
							<Tooltip target=".owner-upload-choose-d1" content="Detay 1 seç" position="bottom" />
							<Tooltip target=".owner-upload-choose-d2" content="Detay 2 seç" position="bottom" />
							<div className="mt-6 grid gap-6 lg:grid-cols-2">
								<div className="space-y-4 rounded-xl border border-stone-800 bg-stone-950/60 p-4">
									<OwnerProfileImageUpload
										chooseClass="owner-upload-choose-main"
										inputName="mainImage"
										label="Ana görsel"
										maxFileSize={MAX_IMAGE_BYTES}
										onSelect={onSelectMain}
									/>
									<OwnerProfileImageUpload
										chooseClass="owner-upload-choose-d1"
										inputName="detailImage1"
										label="Detay 1"
										maxFileSize={MAX_IMAGE_BYTES}
										onSelect={onSelectDetail1}
									/>
									<OwnerProfileImageUpload
										chooseClass="owner-upload-choose-d2"
										inputName="detailImage2"
										label="Detay 2"
										maxFileSize={MAX_IMAGE_BYTES}
										onSelect={onSelectDetail2}
									/>
								</div>
								<div className="grid min-h-[280px] grid-cols-2 gap-3 rounded-xl border border-stone-800 bg-stone-950/60 p-4">
									<div className="relative col-span-2 h-44 overflow-hidden rounded-lg border border-stone-700 bg-stone-900">
										{mainPreview ? (
											<Image
												alt="Ana önizleme"
												className="object-contain"
												fill
												sizes="(min-width: 1024px) 400px, 100vw"
												src={mainPreview}
												unoptimized
											/>
										) : (
											<span className="flex h-full items-center justify-center text-sm text-stone-500">
												Ana önizleme
											</span>
										)}
									</div>
									<div className="relative h-32 overflow-hidden rounded-lg border border-stone-700 bg-stone-900">
										{detail1Preview ? (
											<Image
												alt="Detay 1 önizleme"
												className="object-contain"
												fill
												sizes="(min-width: 1024px) 200px, 50vw"
												src={detail1Preview}
												unoptimized
											/>
										) : (
											<span className="flex h-full items-center justify-center text-xs text-stone-500">
												Detay 1
											</span>
										)}
									</div>
									<div className="relative h-32 overflow-hidden rounded-lg border border-stone-700 bg-stone-900">
										{detail2Preview ? (
											<Image
												alt="Detay 2 önizleme"
												className="object-contain"
												fill
												sizes="(min-width: 1024px) 200px, 50vw"
												src={detail2Preview}
												unoptimized
											/>
										) : (
											<span className="flex h-full items-center justify-center text-xs text-stone-500">
												Detay 2
											</span>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className="border-t border-stone-800 pt-6">
							<button
								className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
								disabled={submitDisabled}
								type="submit"
							>
								{isSaving ? "Kaydediliyor…" : submitLabel}
							</button>
						</div>
					</form>
				</section>
			</PageContainer>
			<HomeFooter />
		</div>
	);
}
