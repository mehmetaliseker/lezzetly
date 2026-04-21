import { HomeFooter } from "@/features/home/components/home-footer";
import { MyReservationsView } from "@/features/reservation/components/my-reservations-view";

export default function MyReservationsPage() {
	return (
		<div className="flex min-h-0 flex-1 flex-col bg-stone-950">
			<MyReservationsView />
			<HomeFooter />
		</div>
	);
}
