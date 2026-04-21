"use client";

import { Calendar } from "@heroui/react";
import Image from "next/image";
import { useState } from "react";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { HomeFooter } from "@/features/home/components/home-footer";
import { useCreateReservation } from "@/hooks/use-create-reservation";
import { useReservationAvailability } from "@/hooks/use-reservation-availability";
import { useRestaurant } from "@/hooks/use-restaurant";

type ReservationDetailPageProps = {
	params: {
		id: string;
	};
};

type CalendarValue = {
	toString(): string;
};

export default function ReservationDetailPage({ params }: ReservationDetailPageProps) {
	const restaurantId = Number(params.id);
	const restaurantQuery = useRestaurant(restaurantId);
	const createReservation = useCreateReservation();
	const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
	const [selectedTableNo, setSelectedTableNo] = useState<number | null>(null);
	const [selectedHours, setSelectedHours] = useState<number[]>([]);
	const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
	const availabilityQuery = useReservationAvailability(
		Number.isFinite(restaurantId) ? restaurantId : null,
		selectedDate
	);

	if (restaurantQuery.isLoading) {
		return <LoadingState title="Restoran yükleniyor" message="Detay sayfası hazırlanıyor…" />;
	}
	if (restaurantQuery.isError || !restaurantQuery.data) {
		return <ErrorState message="Restoran bulunamadı." />;
	}

	const restaurant = restaurantQuery.data;
	const detailImages = restaurant.detailImageUrls ?? [];
	const mainImage = activeImageUrl ?? restaurant.mainImageUrl;
	const availability = availabilityQuery.data;
	const tableOptions = availability?.tables ?? [];
	const activeTable = tableOptions.find((item) => item.tableNo === selectedTableNo) ?? null;
	const currentHour = selectedDate === new Date().toISOString().slice(0, 10) ? new Date().getHours() : -1;

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
										src={imageUrl}
										alt={`${restaurant.name} detay görsel ${index + 1}`}
										fill
										className="object-cover transition-transform duration-300 hover:scale-105"
									/>
								</button>
							))}
						</div>
					) : null}
				</div>

				<div className="mt-6 grid gap-6 lg:grid-cols-3">
					<div className="rounded-2xl border border-stone-800 bg-stone-900 p-4">
						<p className="mb-2 text-sm font-semibold text-stone-300">Tarih seçin</p>
						<Calendar
							aria-label="Rezervasyon tarihi"
							onChange={(value: CalendarValue) => {
								setSelectedDate(value.toString());
								setSelectedHours([]);
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
					<div className="rounded-2xl border border-stone-800 bg-stone-900 p-4 lg:col-span-2">
						<p className="text-sm font-semibold text-stone-300">Masa seçin</p>
						<div className="mt-3 flex flex-wrap gap-2">
							{tableOptions.map((table) => (
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
						<p className="mt-4 text-sm font-semibold text-stone-300">Saat seçimi (çoklu)</p>
						<div className="mt-3 grid grid-cols-4 gap-2 md:grid-cols-6">
							{Array.from({ length: 24 }, (_, hour) => {
								const disabledByPast = hour < currentHour;
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
						{createReservation.isError ? (
							<p className="mt-3 text-sm text-red-400">{createReservation.error.message}</p>
						) : null}
					</div>
				</div>
			</PageContainer>
			<HomeFooter />
		</div>
	);
}
