import Link from "next/link";

import { ReservationFlow } from "@/features/reservation/components/ReservationFlow";

export default function ReservationPage() {
	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
			<header className="flex flex-col gap-2">
				<Link className="text-sm text-zinc-600 hover:text-zinc-900" href="/">
					← Ana sayfa
				</Link>
				<h1 className="text-2xl font-semibold text-zinc-900">Rezervasyon</h1>
				<p className="text-sm text-zinc-600">
					Restoran, tarih ve saat aralığını seçin; süre ve fiyat sunucuda hesaplanır.
				</p>
			</header>
			<ReservationFlow />
		</main>
	);
}
