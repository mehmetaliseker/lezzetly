import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { RestaurantListView } from "@/features/restaurant/components/RestaurantListView";

export default function RestaurantsPage() {
	return (
		<PageContainer maxWidth="wide" className="flex flex-1 flex-col py-10 sm:py-12">
			<PageHeader
				backHref="/"
				backLabel="Ana sayfa"
				title="Restoranlar"
				description="Şu anda yayında olan işletmeleri listeleyin; bir kart seçerek detaylara ve rezervasyon adımına geçin."
			/>
			<div className="pt-2">
				<RestaurantListView />
			</div>
		</PageContainer>
	);
}
