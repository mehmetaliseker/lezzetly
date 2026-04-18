"use client";

import { useMemo, useState } from "react";

import { isFeatureEnabled } from "@/lib/feature-flags";
import { useCreateReservation } from "@/hooks/use-create-reservation";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import { useRestaurants } from "@/hooks/use-restaurants";

export function ReservationFlow() {
	const restaurantsQuery = useRestaurants();
	const featureFlagsQuery = useFeatureFlags();
	const createReservation = useCreateReservation();

	const [restaurantId, setRestaurantId] = useState<string>("");
	const [date, setDate] = useState<string>("");
	const [startTime, setStartTime] = useState<string>("");
	const [endTime, setEndTime] = useState<string>("");

	const flowEnabled = useMemo(
		() => isFeatureEnabled(featureFlagsQuery.data, "RESERVATION_FLOW_V1"),
		[featureFlagsQuery.data]
	);

	if (featureFlagsQuery.isLoading) {
		return <p className="text-sm text-zinc-600">Özellik bayrakları yükleniyor…</p>;
	}

	if (!flowEnabled) {
		return (
			<p className="text-sm text-amber-700">
				Rezervasyon akışı bu ortamda devre dışı (feature flag: RESERVATION_FLOW_V1).
			</p>
		);
	}

	if (restaurantsQuery.isLoading) {
		return <p className="text-sm text-zinc-600">Restoranlar yükleniyor…</p>;
	}

	if (restaurantsQuery.isError) {
		return (
			<p className="text-sm text-red-600">
				Restoranlar alınamadı. Backend çalışıyor mu ve CORS açık mı kontrol edin.
			</p>
		);
	}

	const restaurants = restaurantsQuery.data ?? [];

	return (
		<div className="flex flex-col gap-6">
			<form
				className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
				onSubmit={(event) => {
					event.preventDefault();
					if (!restaurantId || !date || !startTime || !endTime) {
						return;
					}

					createReservation.mutate({
						restaurantId: Number(restaurantId),
						date,
						startTime: normalizeTime(startTime),
						endTime: normalizeTime(endTime),
					});
				}}
			>
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium text-zinc-800" htmlFor="restaurant">
						Restoran
					</label>
					<select
						className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
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
					<label className="text-sm font-medium text-zinc-800" htmlFor="date">
						Tarih
					</label>
					<input
						className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
						id="date"
						type="date"
						value={date}
						onChange={(event) => setDate(event.target.value)}
						required
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-zinc-800" htmlFor="start">
							Başlangıç saati
						</label>
						<input
							className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
							id="start"
							type="time"
							value={startTime}
							onChange={(event) => setStartTime(event.target.value)}
							required
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-zinc-800" htmlFor="end">
							Bitiş saati
						</label>
						<input
							className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
							id="end"
							type="time"
							value={endTime}
							onChange={(event) => setEndTime(event.target.value)}
							required
						/>
					</div>
				</div>

				<button
					className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
					type="submit"
					disabled={createReservation.isPending}
				>
					{createReservation.isPending ? "Gönderiliyor…" : "Rezervasyonu oluştur"}
				</button>
			</form>

			{createReservation.isError && (
				<p className="text-sm text-red-600">{createReservation.error.message}</p>
			)}

			{createReservation.isSuccess && createReservation.data && (
				<div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
					<p className="font-medium">Rezervasyon oluşturuldu</p>
					<ul className="mt-2 list-disc space-y-1 pl-5">
						<li>Rezervasyon no: {createReservation.data.id}</li>
						<li>Süre (dk): {createReservation.data.durationMinutes}</li>
						<li>Toplam: {createReservation.data.totalPrice}</li>
						<li>Durum: {createReservation.data.status}</li>
					</ul>
				</div>
			)}
		</div>
	);
}

function normalizeTime(value: string): string {
	if (value.length === 5) {
		return `${value}:00`;
	}
	return value;
}
