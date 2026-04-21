"use client";

import Link from "next/link";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { useMyReservations } from "@/hooks/use-my-reservations";
import { isReservationInPast } from "@/lib/reservation-past";
import type { CustomerReservationCardResponse } from "@/services/reservations";
import { AppRoute, parseReservationStatusPath, ReservationStatusPath } from "@/types/enums";

function formatHours(hours: number[]): string {
	if (hours.length === 0) {
		return "—";
	}
	return [...hours].sort((a, b) => a - b).map((h) => `${h.toString().padStart(2, "0")}:00`).join(", ");
}

function resolveStatusLabel(status: string): string {
	const path = parseReservationStatusPath(status);
	if (path === ReservationStatusPath.CANCELLED) {
		return "İptal";
	}
	if (path === ReservationStatusPath.CONFIRMED) {
		return "Onaylı";
	}
	if (path === ReservationStatusPath.PENDING) {
		return "Beklemede";
	}
	return status;
}

function splitByPast(items: CustomerReservationCardResponse[]): {
	upcoming: CustomerReservationCardResponse[];
	past: CustomerReservationCardResponse[];
} {
	const upcoming: CustomerReservationCardResponse[] = [];
	const past: CustomerReservationCardResponse[] = [];
	const now = new Date();
	for (const item of items) {
		if (isReservationInPast(item.date, item.selectedHours ?? [], now)) {
			past.push(item);
		} else {
			upcoming.push(item);
		}
	}
	return { upcoming, past };
}

function ReservationCard({ item }: { item: CustomerReservationCardResponse }) {
	return (
		<li className="rounded-xl border border-stone-800 bg-stone-900/90 px-4 py-3 text-sm text-stone-200">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<div>
					<p className="font-semibold text-stone-50">{item.restaurantName}</p>
					<p className="mt-1 text-xs text-stone-400">
						{item.date} · Masa {item.tableNo} · {formatHours(item.selectedHours ?? [])}
					</p>
				</div>
				<div className="text-right text-xs text-stone-400">
					<p>{resolveStatusLabel(item.status)}</p>
					<p className="mt-1 font-medium text-stone-200">{Number(item.totalPrice).toFixed(2)} TL</p>
				</div>
			</div>
			<div className="mt-3">
				<Link
					className="text-xs font-medium text-amber-400 underline-offset-2 hover:underline"
					href={`${AppRoute.RESERVATION}/${item.restaurantId}`}
				>
					Restoran rezervasyon sayfası
				</Link>
			</div>
		</li>
	);
}

export function MyReservationsView() {
	const query = useMyReservations(100);

	if (query.isLoading) {
		return <LoadingState title="Rezervasyonlar" message="Kayıtlarınız yükleniyor…" />;
	}
	if (query.isError) {
		return <ErrorState message="Rezervasyonlar yüklenemedi. Oturum açık mı kontrol edin." />;
	}

	const items = query.data ?? [];
	const { upcoming, past } = splitByPast(items);

	return (
		<PageContainer maxWidth="site" className="flex flex-1 flex-col gap-8 py-10">
			<div>
				<h1 className="text-2xl font-semibold text-stone-50">Rezervasyonlarım</h1>
				<p className="mt-2 max-w-2xl text-sm text-stone-400">
					Yaklaşan ve geçmiş rezervasyonlarınızı burada görebilirsiniz. İptal edilen kayıtlar listelenmez.
				</p>
			</div>

			{items.length === 0 ? (
				<p className="text-sm text-stone-500">
					Henüz kayıtlı rezervasyon yok.{" "}
					<Link className="font-medium text-amber-400 underline-offset-2 hover:underline" href={AppRoute.RESTAURANTS}>
						Restoranlara göz atın
					</Link>
				</p>
			) : (
				<div className="grid gap-10 lg:grid-cols-2">
					<section>
						<h2 className="text-lg font-semibold text-stone-100">Yaklaşan</h2>
						{upcoming.length === 0 ? (
							<p className="mt-2 text-sm text-stone-500">Yaklaşan rezervasyon yok.</p>
						) : (
							<ul className="mt-3 space-y-3">
								{upcoming.map((item) => (
									<ReservationCard key={item.id} item={item} />
								))}
							</ul>
						)}
					</section>
					<section>
						<h2 className="text-lg font-semibold text-stone-100">Geçmiş</h2>
						{past.length === 0 ? (
							<p className="mt-2 text-sm text-stone-500">Geçmiş rezervasyon yok.</p>
						) : (
							<ul className="mt-3 space-y-3">
								{past.map((item) => (
									<ReservationCard key={item.id} item={item} />
								))}
							</ul>
						)}
					</section>
				</div>
			)}
		</PageContainer>
	);
}
