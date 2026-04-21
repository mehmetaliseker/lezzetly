"use client";

import { useMemo, useState } from "react";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, nativeFieldClassName } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionTitle } from "@/components/ui/section-title";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { useCreateReservation } from "@/hooks/use-create-reservation";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import { useRestaurants } from "@/hooks/use-restaurants";

import { ReservationSummary } from "./reservation-summary";

export function ReservationFlow() {
	const restaurantsQuery = useRestaurants();
	const featureFlagsQuery = useFeatureFlags();
	const createReservation = useCreateReservation();

	const [restaurantId, setRestaurantId] = useState<string>("");
	const [date, setDate] = useState<string>("");
	const [tableNo, setTableNo] = useState<string>("1");
	const [hourInput, setHourInput] = useState<string>("12");

	const flowEnabled = useMemo(
		() => isFeatureEnabled(featureFlagsQuery.data, "RESERVATION_FLOW_V1"),
		[featureFlagsQuery.data]
	);

	if (featureFlagsQuery.isLoading) {
		return <LoadingState title="Akış hazırlanıyor" message="Özellik bayrakları kontrol ediliyor…" />;
	}

	if (!flowEnabled) {
		return (
			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex min-w-0 flex-col gap-1">
							<h2 className="text-lg font-semibold tracking-tight text-zinc-900">
								Rezervasyon geçici olarak kapalı
							</h2>
							<p className="text-sm leading-relaxed text-zinc-600">
								Bu ortamda RESERVATION_FLOW_V1 bayrağı kapalı. Backend’de bayrağı açtıktan sonra sayfayı
								yenileyin.
							</p>
						</div>
						<Badge className="shrink-0" variant="warning">
							Kapalı
						</Badge>
					</div>
				</CardHeader>
			</Card>
		);
	}

	if (restaurantsQuery.isLoading) {
		return <LoadingState title="Restoranlar yükleniyor" message="Seçim listesi hazırlanıyor…" />;
	}

	if (restaurantsQuery.isError) {
		return (
			<ErrorState
				message="Restoranlar alınamadı. Backend çalışıyor mu ve CORS açık mı kontrol edin."
			/>
		);
	}

	const restaurants = restaurantsQuery.data ?? [];

	return (
		<div className="flex flex-col gap-8">
			<Card>
				<CardHeader>
					<SectionTitle
						title="Rezervasyon formu"
						description="Restoran, tarih ve saat aralığını seçin. Süre ve toplam tutar sunucuda hesaplanır."
					/>
				</CardHeader>
				<CardContent>
					<form
						className="flex flex-col gap-6"
						onSubmit={(event) => {
							event.preventDefault();
							if (!restaurantId || !date || !tableNo || !hourInput) {
								return;
							}

							createReservation.mutate({
								restaurantId: Number(restaurantId),
								date,
								tableNo: Number(tableNo),
								selectedHours: [Number(hourInput)],
							});
						}}
					>
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							<div className="flex flex-col gap-2">
								<Label htmlFor="restaurant">Restoran</Label>
								<select
									className={nativeFieldClassName}
									id="restaurant"
									value={restaurantId}
									onChange={(event) => setRestaurantId(event.target.value)}
									required
								>
									<option value="">Seçiniz</option>
									{restaurants.map((restaurant) => (
										<option key={restaurant.id} value={restaurant.id}>
											{restaurant.name} — {restaurant.city}
										</option>
									))}
								</select>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="date">Tarih</Label>
								<Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
							</div>
						</div>

						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div className="flex flex-col gap-2">
								<Label htmlFor="table">Masa numarası</Label>
								<Input
									id="table"
									type="number"
									min={1}
									value={tableNo}
									onChange={(e) => setTableNo(e.target.value)}
									required
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="hour">Saat (0-23)</Label>
								<Input
									id="hour"
									type="number"
									min={0}
									max={23}
									value={hourInput}
									onChange={(e) => setHourInput(e.target.value)}
									required
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							{createReservation.isError ? (
								<p className="text-sm text-red-600">{createReservation.error.message}</p>
							) : (
								<span className="text-xs text-zinc-500">Gönderim sonrası özet aşağıda görünür.</span>
							)}
							<Button className="w-full sm:w-auto" disabled={createReservation.isPending} type="submit">
								{createReservation.isPending ? "Gönderiliyor…" : "Rezervasyonu oluştur"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{createReservation.isSuccess && createReservation.data ? (
				<ReservationSummary data={createReservation.data} />
			) : null}
		</div>
	);
}
