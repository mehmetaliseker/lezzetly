"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileUpload, type FileUploadSelectEvent } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { useCallback, useState } from "react";

import { RestaurantHourSelect } from "@/components/owner/restaurant-hour-select";
import { ApiError } from "@/lib/api-client";
import { PageContainer } from "@/components/layout/page-container";
import { useToast } from "@/components/feedback/toast-center";
import { HomeFooter } from "@/features/home/components/home-footer";
import { queryKeys } from "@/lib/query-keys";
import {
	createOwnerRestaurantProfile,
	fetchOwnerRestaurantProfile,
	updateOwnerRestaurantProfile,
	uploadOwnerRestaurantImages,
	type OwnerRestaurantProfileResponse,
	type UpdateOwnerRestaurantProfilePayload,
} from "@/services/restaurants";

const MAX_IMAGE_BYTES = 1_000_000;

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

export default function OwnerRestaurantProfilePage() {
	const queryClient = useQueryClient();
	const toast = useToast();
	const [mainFile, setMainFile] = useState<File | null>(null);
	const [detail1File, setDetail1File] = useState<File | null>(null);
	const [detail2File, setDetail2File] = useState<File | null>(null);
	const [mainPreview, setMainPreview] = useState<string | null>(null);
	const [detail1Preview, setDetail1Preview] = useState<string | null>(null);
	const [detail2Preview, setDetail2Preview] = useState<string | null>(null);

	const ownerProfileQuery = useQuery({
		queryKey: queryKeys.owner.restaurantProfile(),
		queryFn: fetchOwnerRestaurantProfile,
		retry: false,
	});

	const isNotFound = ownerProfileQuery.error instanceof ApiError && ownerProfileQuery.error.status === 404;

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

	const clearImageSelection = useCallback(() => {
		if (mainPreview) {
			URL.revokeObjectURL(mainPreview);
		}
		if (detail1Preview) {
			URL.revokeObjectURL(detail1Preview);
		}
		if (detail2Preview) {
			URL.revokeObjectURL(detail2Preview);
		}
		setMainFile(null);
		setDetail1File(null);
		setDetail2File(null);
		setMainPreview(null);
		setDetail1Preview(null);
		setDetail2Preview(null);
	}, [detail1Preview, detail2Preview, mainPreview]);

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
			setMainPreview((previous) => {
				if (previous) {
					URL.revokeObjectURL(previous);
				}
				return URL.createObjectURL(file);
			});
		},
		[toast]
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
			setDetail1Preview((previous) => {
				if (previous) {
					URL.revokeObjectURL(previous);
				}
				return URL.createObjectURL(file);
			});
		},
		[toast]
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
			setDetail2Preview((previous) => {
				if (previous) {
					URL.revokeObjectURL(previous);
				}
				return URL.createObjectURL(file);
			});
		},
		[toast]
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

			try {
				let createdInThisSubmit = false;
				let profileExists = !isNotFound;
				if (profileExists) {
					try {
						await updateMutation.mutateAsync(payload);
					} catch (error) {
						if (error instanceof ApiError && error.status === 404) {
							profileExists = false;
						} else {
							throw error;
						}
					}
				}
				if (!profileExists) {
					await createMutation.mutateAsync(payload);
					createdInThisSubmit = true;
				}
				if (hasImages) {
					await uploadMutation.mutateAsync(imageFormData);
				}
				await queryClient.invalidateQueries({ queryKey: queryKeys.owner.restaurantProfile() });
				await queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.all });
				clearImageSelection();
				if (createdInThisSubmit) {
					toast.showSuccess(
						hasImages ? "İşletme oluşturuldu ve görseller yüklendi" : "İşletme profili oluşturuldu"
					);
				} else {
					toast.showSuccess(
						hasImages ? "İşletme güncellendi ve görseller yüklendi" : "İşletme bilgileri güncellendi"
					);
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "Kayıt tamamlanamadı";
				toast.showError(message);
			}
		},
		[
			clearImageSelection,
			createMutation,
			detail1File,
			detail2File,
			isNotFound,
			mainFile,
			queryClient,
			toast,
			updateMutation,
			uploadMutation,
		]
	);

	const formKey = isNotFound ? "new-restaurant" : String(ownerProfile?.restaurantId ?? "loaded");
	const isSaving = createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

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
					{ownerProfileQuery.isError && !isNotFound ? (
						<p className="mt-4 text-sm text-red-400">İşletme profili alınamadı.</p>
					) : null}
					{isNotFound ? (
						<p className="mt-4 rounded-md border border-amber-700/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">
							Henüz kayıtlı işletme yok. Formu doldurup alttaki düğme ile oluşturabilirsiniz; dilerseniz aynı
							anda görsel de seçebilirsiniz.
						</p>
					) : null}

					<form key={formKey} className="mt-6 flex flex-col gap-6" onSubmit={saveRestaurant}>
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
								İsteğe bağlı. Sürükle-bırak veya seç; en fazla 1 MB, yalnızca görsel. Kayıt sırasında profil
								ile birlikte yüklenir.
							</p>
							<Tooltip target=".owner-upload-choose-main" content="Ana görsel seç" position="bottom" />
							<Tooltip target=".owner-upload-choose-d1" content="Detay 1 seç" position="bottom" />
							<Tooltip target=".owner-upload-choose-d2" content="Detay 2 seç" position="bottom" />
							<div className="mt-6 grid gap-6 lg:grid-cols-2">
								<div className="space-y-4 rounded-xl border border-stone-800 bg-stone-950/60 p-4">
									<div>
										<p className="text-sm font-medium text-stone-200">Ana görsel</p>
										<FileUpload
											accept="image/*"
											chooseOptions={{ className: "owner-upload-choose-main" }}
											maxFileSize={MAX_IMAGE_BYTES}
											mode="basic"
											name="mainImage"
											onSelect={onSelectMain}
										/>
									</div>
									<div>
										<p className="text-sm font-medium text-stone-200">Detay 1</p>
										<FileUpload
											accept="image/*"
											chooseOptions={{ className: "owner-upload-choose-d1" }}
											maxFileSize={MAX_IMAGE_BYTES}
											mode="basic"
											name="detailImage1"
											onSelect={onSelectDetail1}
										/>
									</div>
									<div>
										<p className="text-sm font-medium text-stone-200">Detay 2</p>
										<FileUpload
											accept="image/*"
											chooseOptions={{ className: "owner-upload-choose-d2" }}
											maxFileSize={MAX_IMAGE_BYTES}
											mode="basic"
											name="detailImage2"
											onSelect={onSelectDetail2}
										/>
									</div>
								</div>
								<div className="grid min-h-[280px] grid-cols-2 gap-3 rounded-xl border border-stone-800 bg-stone-950/60 p-4">
									<div className="relative col-span-2 flex min-h-[140px] items-center justify-center overflow-hidden rounded-lg border border-stone-700 bg-stone-900">
										{mainPreview ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img alt="Ana önizleme" className="max-h-48 object-contain" src={mainPreview} />
										) : (
											<span className="text-sm text-stone-500">Ana önizleme</span>
										)}
									</div>
									<div className="relative flex min-h-[100px] items-center justify-center overflow-hidden rounded-lg border border-stone-700 bg-stone-900">
										{detail1Preview ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img alt="Detay 1 önizleme" className="max-h-32 object-contain" src={detail1Preview} />
										) : (
											<span className="text-xs text-stone-500">Detay 1</span>
										)}
									</div>
									<div className="relative flex min-h-[100px] items-center justify-center overflow-hidden rounded-lg border border-stone-700 bg-stone-900">
										{detail2Preview ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img alt="Detay 2 önizleme" className="max-h-32 object-contain" src={detail2Preview} />
										) : (
											<span className="text-xs text-stone-500">Detay 2</span>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className="border-t border-stone-800 pt-6">
							<button
								className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 sm:w-auto"
								disabled={isSaving}
								type="submit"
							>
								{isSaving
									? "Kaydediliyor…"
									: isNotFound
										? "İşletmeyi oluştur"
										: "İşletmeyi kaydet"}
							</button>
						</div>
					</form>
				</section>
			</PageContainer>
			<HomeFooter />
		</div>
	);
}
