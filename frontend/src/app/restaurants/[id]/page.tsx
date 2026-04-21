import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { RestaurantDetailView } from "@/features/restaurant/components/RestaurantDetailView";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function RestaurantDetailPage({ params }: Props) {
	const { id } = await params;
	const numericId = Number(id);

	if (!Number.isFinite(numericId) || numericId <= 0) {
		notFound();
	}

	return (
		<PageContainer maxWidth="medium" className="flex flex-1 flex-col py-10 sm:py-12">
			<PageHeader
				backHref="/restaurants"
				backLabel="Restoranlar"
				title="Restoran detayı"
				description="Fiyat ve konum bilgisi sunucudan gelir; rezervasyon için formu kullanın."
			/>
			<div className="pt-2">
				<RestaurantDetailView restaurantId={numericId} />
			</div>
		</PageContainer>
	);
}
