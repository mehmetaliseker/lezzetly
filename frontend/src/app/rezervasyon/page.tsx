import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ReservationFlow } from "@/features/reservation/components/ReservationFlow";

export default function ReservationPage() {
	return (
		<PageContainer maxWidth="medium" className="flex flex-1 flex-col py-10 sm:py-12">
			<PageHeader
				backHref="/"
				backLabel="Ana sayfa"
				title="Rezervasyon"
				description="Restoran, tarih ve saat aralığını seçin; süre ve toplam tutar sunucuda hesaplanır."
			/>
			<div className="pt-2">
				<ReservationFlow />
			</div>
		</PageContainer>
	);
}
