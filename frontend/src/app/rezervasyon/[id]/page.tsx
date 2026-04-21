"use client";

import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { Calendar } from "@heroui/react";
import { use, useMemo, useState } from "react";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { useToast } from "@/components/feedback/toast-center";
import { HomeFooter } from "@/features/home/components/home-footer";
import { ReservationRestaurantGallery } from "@/features/reservation/components/reservation-restaurant-gallery";
import { useCreateReservation } from "@/hooks/use-create-reservation";
import { useRecentReservationsForRestaurant } from "@/hooks/use-recent-reservations-for-restaurant";
import { useReservationAvailability } from "@/hooks/use-reservation-availability";
import { useReservationTableGridColumnCount } from "@/hooks/use-reservation-table-grid-column-count";
import { useRestaurant } from "@/hooks/use-restaurant";
import { ApiError } from "@/lib/api-client";
import { RESERVATION_TABLE_GRID_MIN_HEIGHT, RESERVATION_TABLE_GRID_ROW_COUNT } from "@/lib/reservation-table-grid";
import { firstBookableHourInclusive, lastBookableHourInclusive } from "@/lib/restaurant-booking-hours";
import { parseReservationStatusPath, ReservationStatusPath } from "@/types/enums";

type ReservationDetailPageProps = {
	params: Promise<{
		id: string;
	}>;
};

export default function ReservationDetailPage({ params }: ReservationDetailPageProps) {
	const resolvedParams = use(params);
	const restaurantId = Number(resolvedParams.id);
	const restaurantQuery = useRestaurant(restaurantId);
	const createReservation = useCreateReservation();
	const toast = useToast();
	const timeZone = useMemo(() => getLocalTimeZone(), []);
	const [selectedCalendarDate, setSelectedCalendarDate] = useState<CalendarDate>(() => today(timeZone));
	const selectedDate = selectedCalendarDate.toString();
	const [selectedTableNo, setSelectedTableNo] = useState<number | null>(null);
	const [selectedHours, setSelectedHours] = useState<number[]>([]);
	const [tablePage, setTablePage] = useState<number>(1);
	const availabilityQuery = useReservationAvailability(
		Number.isFinite(restaurantId) ? restaurantId : null,
		selectedDate
	);
	const recentReservationsQuery = useRecentReservationsForRestaurant(
		Number.isFinite(restaurantId) ? restaurantId : null,
		5
	);
	const tableGridColumns = useReservationTableGridColumnCount();
	const tablePageSize = RESERVATION_TABLE_GRID_ROW_COUNT * tableGridColumns;

	if (restaurantQuery.isLoading) {
		return <LoadingState title="Restoran yükleniyor" message="Detay sayfası hazırlanıyor…" />;
	}
	if (restaurantQuery.isError || !restaurantQuery.data) {
		return <ErrorState message="Restoran bulunamadı." />;
	}

	const restaurant = restaurantQuery.data;
	const detailImages = restaurant.detailImageUrls ?? [];
	const restaurantGalleryKey = `${restaurant.id}-${restaurant.mainImageUrl ?? ""}-${detailImages.join("\u0001")}`;
	const availability = availabilityQuery.data;
	const tableOptions = availability?.tables ?? [];
	const activeTable = tableOptions.find((item) => item.tableNo === selectedTableNo) ?? null;
	const todayDate = today(timeZone);
	const isSelectedDateToday = selectedCalendarDate.compare(todayDate) === 0;
	const currentHour = isSelectedDateToday ? new Date().getHours() : -1;
	const firstHour = firstBookableHourInclusive(restaurant.openingTime);
	const lastHour = lastBookableHourInclusive(restaurant.closingTime);
	const bookableHours =
		firstHour <= lastHour
			? Array.from({ length: lastHour - firstHour + 1 }, (_, index) => firstHour + index)
			: [];
	const tablePageCount = Math.max(1, Math.ceil(tableOptions.length / tablePageSize));
	const effectiveTablePage = Math.min(Math.max(1, tablePage), tablePageCount);
	const visibleTables = tableOptions.slice(
		(effectiveTablePage - 1) * tablePageSize,
		effectiveTablePage * tablePageSize
	);

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-stone-950">
			<PageContainer maxWidth="site" className="flex flex-1 flex-col py-8">
				<h1 className="text-2xl font-semibold text-stone-50">Restoranı detaylı inceleyin</h1>
				<ReservationRestaurantGallery
					key={restaurantGalleryKey}
					restaurantName={restaurant.name}
					mainImageUrl={restaurant.mainImageUrl}
					detailImageUrls={detailImages}
				/>

				<div className="mt-6 grid gap-6 lg:grid-cols-3">
					<div className="flex flex-col gap-4">
						<div className="rounded-2xl border border-stone-800 bg-stone-900 p-4">
							<p className="mb-2 text-sm font-semibold text-stone-300">Tarih seçin</p>
							<div className="reservation-calendar grid w-full justify-items-center">
								<Calendar
									aria-label="Rezervasyon tarihi"
									className="mx-auto max-w-full shrink-0"
									minValue={todayDate}
									value={selectedCalendarDate}
									onChange={(next) => {
										if (next == null) {
											return;
										}
										setSelectedCalendarDate(next);
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
						</div>
						<div className="rounded-2xl border border-stone-800 bg-stone-900 p-4">
							<p className="text-sm font-semibold text-stone-300">Bu restorandaki rezervasyonlarım</p>
							<p className="mt-1 text-xs text-stone-500">
								Son 5 kayıt (geçmiş ve yaklaşan). Giriş yapmanız gerekir.
							</p>
							{recentReservationsQuery.isLoading ? (
								<p className="mt-2 text-xs text-stone-500">Yükleniyor…</p>
							) : recentReservationsQuery.isError || !recentReservationsQuery.data?.length ? (
								<p className="mt-2 text-xs text-stone-500">
									Kayıt yok veya oturum kapalı. Rezervasyon oluşturduğunuzda burada görünür.
								</p>
							) : (
								<ul className="mt-3 space-y-2">
									{recentReservationsQuery.data.map((item) => (
										<li
											key={item.id}
											className="rounded-md border border-stone-800 bg-stone-950/80 px-3 py-2 text-xs text-stone-300"
										>
											<div className="flex items-start justify-between gap-2">
												<div>
													<p className="font-medium text-stone-100">{item.date}</p>
													<p className="mt-0.5 flex flex-col leading-tight text-stone-400">
														<span>Masa</span>
														<span className="text-sm font-semibold text-stone-200">{item.tableNo}</span>
													</p>
												</div>
												<p className="shrink-0 text-right text-[0.65rem] text-stone-500">
													{(item.selectedHours ?? []).map((h) => `${h}:00`).join(", ")}
												</p>
											</div>
											<p className="mt-1 text-[0.65rem] text-stone-500">
												{parseReservationStatusPath(item.status) === ReservationStatusPath.CANCELLED
													? "İptal"
													: item.status}
											</p>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
					<div className="rounded-2xl border border-stone-800 bg-stone-900 p-4 lg:col-span-2">
						<p className="text-sm font-semibold text-stone-300">Masa seçin</p>
						<div
							className="mt-3 grid min-h-0 grid-cols-2 grid-rows-6 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10"
							style={{ height: RESERVATION_TABLE_GRID_MIN_HEIGHT }}
						>
							{visibleTables.map((table) => (
								<button
									key={table.tableNo}
									className={`flex h-full min-h-0 w-full flex-col items-center justify-center gap-0.5 rounded-md px-1 py-1.5 text-center ${
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
									<span
										className={`text-[0.65rem] font-medium uppercase tracking-wide ${
											selectedTableNo === table.tableNo ? "text-stone-600" : "text-stone-400"
										}`}
									>
										Masa
									</span>
									<span className="text-base font-semibold tabular-nums leading-none">{table.tableNo}</span>
								</button>
							))}
						</div>
						<div className="mt-3 flex min-h-[2.25rem] shrink-0 items-center justify-end gap-2">
							{tableOptions.length > tablePageSize ? (
								<>
									<button
										type="button"
										disabled={effectiveTablePage <= 1}
										className="rounded-md bg-stone-800 px-3 py-1 text-xs text-stone-200 disabled:opacity-40"
										onClick={() =>
											setTablePage((previous) => {
												const current = Math.min(Math.max(1, previous), tablePageCount);
												return Math.max(1, current - 1);
											})
										}
									>
										Önceki
									</button>
									<span className="text-xs text-stone-400">
										Sayfa {effectiveTablePage} / {tablePageCount}
									</span>
									<button
										type="button"
										disabled={effectiveTablePage >= tablePageCount}
										className="rounded-md bg-stone-800 px-3 py-1 text-xs text-stone-200 disabled:opacity-40"
										onClick={() =>
											setTablePage((previous) => {
												const current = Math.min(Math.max(1, previous), tablePageCount);
												return Math.min(tablePageCount, current + 1);
											})
										}
									>
										Sonraki
									</button>
								</>
							) : null}
						</div>
						<p className="mt-4 text-sm font-semibold text-stone-300">Saat seçimi (çoklu)</p>
						<div className="mt-3 grid grid-cols-4 gap-2 md:grid-cols-6 justify-items-stretch">
							{bookableHours.length === 0 ? (
								<p className="col-span-full text-sm text-stone-500">
									Bu restoran için geçerli saat aralığı bulunamadı.
								</p>
							) : (
								bookableHours.map((hour) => {
									const disabledByPast = hour <= currentHour;
									const disabledByReservation = activeTable?.disabledHours.includes(hour) ?? false;
									const isDisabled = disabledByPast || disabledByReservation || selectedTableNo == null;
									const isSelected = selectedHours.includes(hour);
									return (
										<button
											key={hour}
											type="button"
											disabled={isDisabled}
											className={`min-h-[2.625rem] rounded-md px-2 py-2 text-sm ${
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
								})
							)}
						</div>
						<div className="mt-5 flex items-center justify-between">
							<p className="text-sm text-stone-300">
								Toplam: {(selectedHours.length * restaurant.pricePerHour).toFixed(2)} TL
							</p>
							<button
								type="button"
								disabled={selectedTableNo == null || selectedHours.length === 0 || createReservation.isPending}
								className="rounded-md bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-900 disabled:opacity-50"
								onClick={async () => {
									if (selectedTableNo == null) {
										return;
									}
									try {
										await createReservation.mutateAsync({
											restaurantId,
											date: selectedDate,
											tableNo: selectedTableNo,
											selectedHours,
										});
										toast.showSuccess("Rezervasyon oluşturuldu");
										setSelectedHours([]);
										createReservation.reset();
									} catch (error) {
										const message =
											error instanceof ApiError
												? error.message
												: error instanceof Error
													? error.message
													: "Rezervasyon oluşturulamadı";
										toast.showError(message);
									}
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
