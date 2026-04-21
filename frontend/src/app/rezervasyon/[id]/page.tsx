"use client";

import { Calendar } from "@heroui/react";
import Image from "next/image";
import { use, useEffect, useState } from "react";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { useToast } from "@/components/feedback/toast-center";
import { HomeFooter } from "@/features/home/components/home-footer";
import { useCreateReservation } from "@/hooks/use-create-reservation";
import { usePastReservations } from "@/hooks/use-past-reservations";
import { useReservationAvailability } from "@/hooks/use-reservation-availability";
import { useRestaurant } from "@/hooks/use-restaurant";
import { resolveApiMediaUrl } from "@/lib/media-url";
import { parseReservationStatusPath, ReservationStatusPath } from "@/types/enums";

type ReservationDetailPageProps = {
	params: Promise<{
		id: string;
	}>;
};

type CalendarValue = {
	toString(): string;
};

export default function ReservationDetailPage({ params }: ReservationDetailPageProps) {
	const resolvedParams = use(params);
	const restaurantId = Number(resolvedParams.id);
	const restaurantQuery = useRestaurant(restaurantId);
	const createReservation = useCreateReservation();
	const toast = useToast();
	const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
	const [selectedTableNo, setSelectedTableNo] = useState<number | null>(null);
	const [selectedHours, setSelectedHours] = useState<number[]>([]);
	const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
	const [tablePage, setTablePage] = useState<number>(1);
	const availabilityQuery = useReservationAvailability(
		Number.isFinite(restaurantId) ? restaurantId : null,
		selectedDate
	);
	const pastQuery = usePastReservations(Number.isFinite(restaurantId) ? restaurantId : null, 5);

	useEffect(() => {
		if (createReservation.isError) {
			toast.showError(createReservation.error.message);
		}
	}, [createReservation.error, createReservation.isError, toast]);

	useEffect(() => {
		if (!createReservation.isSuccess) {
			return;
		}
		toast.showSuccess("Rezervasyon oluşturuldu");
		createReservation.reset();
	}, [createReservation, createReservation.isSuccess, toast]);

	if (restaurantQuery.isLoading) {
		return <LoadingState title="Restoran yükleniyor" message="Detay sayfası hazırlanıyor…" />;
	}
	if (restaurantQuery.isError || !restaurantQuery.data) {
		return <ErrorState message="Restoran bulunamadı." />;
	}

	const restaurant = restaurantQuery.data;
	const detailImages = restaurant.detailImageUrls ?? [];
	const rawMain = activeImageUrl ?? restaurant.mainImageUrl;
	const mainImage = rawMain ? resolveApiMediaUrl(rawMain) : null;
	const availability = availabilityQuery.data;
	const tableOptions = availability?.tables ?? [];
	const activeTable = tableOptions.find((item) => item.tableNo === selectedTableNo) ?? null;
	const currentHour = selectedDate === new Date().toISOString().slice(0, 10) ? new Date().getHours() : -1;
	const tablePageSize = 60;
	const tablePageCount = Math.max(1, Math.ceil(tableOptions.length / tablePageSize));
	const visibleTables = tableOptions.slice((tablePage - 1) * tablePageSize, tablePage * tablePageSize);

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-stone-950">
			<PageContainer maxWidth="site" className="flex flex-1 flex-col py-8">
				<h1 className="text-2xl font-semibold text-stone-50">Restoranı detaylı inceleyin</h1>
				<div className="mt-4 grid gap-4 lg:grid-cols-2">
					<div className="relative h-80 overflow-hidden rounded-2xl border border-stone-800 bg-stone-900">
						{mainImage ? (
							<Image
								key={mainImage}
								src={mainImage}
								alt={`${restaurant.name} ana görsel`}
								fill
								className="object-cover transition-opacity duration-500"
								unoptimized
							/>
						) : (
							<div className="flex h-full items-center justify-center text-6xl text-stone-600">🖼</div>
						)}
					</div>
					{detailImages.length > 0 ? (
						<div className="grid grid-cols-2 gap-3 rounded-2xl border border-stone-800 bg-stone-900 p-3">
							{detailImages.map((imageUrl, index) => (
								<button
									key={`${imageUrl}-${index}`}
									type="button"
									className="relative h-32 overflow-hidden rounded-xl border border-stone-700"
									onClick={() => setActiveImageUrl(imageUrl)}
								>
									<Image
										src={resolveApiMediaUrl(imageUrl)}
										alt={`${restaurant.name} detay görsel ${index + 1}`}
										fill
										className="object-cover transition-transform duration-300 hover:scale-105"
										unoptimized
									/>
								</button>
							))}
						</div>
					) : null}
				</div>

				<div className="mt-6 grid gap-6 lg:grid-cols-3">
					<div className="flex flex-col gap-4">
						<div className="rounded-2xl border border-stone-800 bg-stone-900 p-4">
							<p className="mb-2 text-sm font-semibold text-stone-300">Tarih seçin</p>
							<Calendar
								aria-label="Rezervasyon tarihi"
								onChange={(value: CalendarValue) => {
									setSelectedDate(value.toString());
									setSelectedHours([]);
									setTablePage(1);
								}}
							>
								<Calendar.Header>
									<Calendar.Heading />
									<Calendar.NavButton slot="previous" />
									<Calendar.NavButton slot="next" />
								</Calendar.Header>
								<Calendar.Grid>
									<Calendar.GridHeader>
										{(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
									</Calendar.GridHeader>
									<Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
								</Calendar.Grid>
							</Calendar>
						</div>
						<div className="rounded-2xl border border-stone-800 bg-stone-900 p-4">
							<p className="text-sm font-semibold text-stone-300">Son geçmiş rezervasyonlar</p>
							{pastQuery.isLoading ? (
								<p className="mt-2 text-xs text-stone-500">Yükleniyor…</p>
							) : pastQuery.isError || !pastQuery.data?.length ? (
								<p className="mt-2 text-xs text-stone-500">Giriş yapılmışsa ve geçmiş kayıt varsa burada listelenir.</p>
							) : (
								<ul className="mt-3 space-y-2">
									{pastQuery.data.map((item) => (
										<li
											key={item.id}
											className="rounded-md border border-stone-800 bg-stone-950/80 px-3 py-2 text-xs text-stone-300"
										>
											<span className="font-medium text-stone-100">{item.date}</span> · Masa {item.tableNo} ·{" "}
											{(item.selectedHours ?? []).map((h) => `${h}:00`).join(", ")} ·{" "}
											{parseReservationStatusPath(item.status) === ReservationStatusPath.CANCELLED
												? "İptal"
												: item.status}
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
					<div className="rounded-2xl border border-stone-800 bg-stone-900 p-4 lg:col-span-2">
						<p className="text-sm font-semibold text-stone-300">Masa seçin</p>
						<div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10">
							{visibleTables.map((table) => (
								<button
									key={table.tableNo}
									className={`rounded-md px-3 py-2 text-sm ${
										selectedTableNo === table.tableNo
											? "bg-stone-200 text-stone-900"
											: "bg-stone-800 text-stone-200"
									}`}
									type="button"
									onClick={() => {
										setSelectedTableNo(table.tableNo);
										setSelectedHours([]);
									}}
								>
									Masa {table.tableNo}
								</button>
							))}
						</div>
						{tableOptions.length > tablePageSize ? (
							<div className="mt-3 flex items-center justify-end gap-2">
								<button
									type="button"
									disabled={tablePage <= 1}
									className="rounded-md bg-stone-800 px-3 py-1 text-xs text-stone-200 disabled:opacity-40"
									onClick={() => setTablePage((prev) => Math.max(1, prev - 1))}
								>
									Önceki
								</button>
								<span className="text-xs text-stone-400">
									Sayfa {tablePage} / {tablePageCount}
								</span>
								<button
									type="button"
									disabled={tablePage >= tablePageCount}
									className="rounded-md bg-stone-800 px-3 py-1 text-xs text-stone-200 disabled:opacity-40"
									onClick={() => setTablePage((prev) => Math.min(tablePageCount, prev + 1))}
								>
									Sonraki
								</button>
							</div>
						) : null}
						<p className="mt-4 text-sm font-semibold text-stone-300">Saat seçimi (çoklu)</p>
						<div className="mt-3 grid grid-cols-4 gap-2 md:grid-cols-6">
							{Array.from({ length: 24 }, (_, hour) => {
								const disabledByPast = hour <= currentHour;
								const disabledByReservation = activeTable?.disabledHours.includes(hour) ?? false;
								const isDisabled = disabledByPast || disabledByReservation || selectedTableNo == null;
								const isSelected = selectedHours.includes(hour);
								return (
									<button
										key={hour}
										type="button"
										disabled={isDisabled}
										className={`rounded-md px-2 py-2 text-sm ${
											isSelected
												? "bg-amber-400 text-stone-900"
												: "bg-stone-800 text-stone-200 disabled:cursor-not-allowed disabled:opacity-40"
										}`}
										onClick={() => {
											setSelectedHours((prev) =>
												prev.includes(hour)
													? prev.filter((value) => value !== hour)
													: [...prev, hour].sort((a, b) => a - b)
											);
										}}
									>
										{hour.toString().padStart(2, "0")}:00
									</button>
								);
							})}
						</div>
						<div className="mt-5 flex items-center justify-between">
							<p className="text-sm text-stone-300">
								Toplam: {(selectedHours.length * restaurant.pricePerHour).toFixed(2)} TL
							</p>
							<button
								type="button"
								disabled={selectedTableNo == null || selectedHours.length === 0 || createReservation.isPending}
								className="rounded-md bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-900 disabled:opacity-50"
								onClick={() => {
									if (selectedTableNo == null) {
										return;
									}
									createReservation.mutate({
										restaurantId,
										date: selectedDate,
										tableNo: selectedTableNo,
										selectedHours,
									});
								}}
							>
								{createReservation.isPending ? "Oluşturuluyor…" : "Rezervasyonu oluştur"}
							</button>
						</div>
					</div>
				</div>
			</PageContainer>
			<HomeFooter />
		</div>
	);
}
