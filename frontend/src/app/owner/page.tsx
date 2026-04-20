import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function OwnerPage() {
	return (
		<PageContainer maxWidth="narrow" className="flex flex-1 flex-col py-12 sm:py-16">
			<PageHeader
				backHref="/"
				backLabel="Ana sayfa"
				title="İşletme sahibi"
				description="Restoran oluşturma ve owner_user_id API’leri hazır olunca OWNER paneli burada oluşturulacak."
			/>
			<Card className="mt-2">
				<CardContent className="py-8">
					<p className="text-center text-sm text-zinc-600">İskelet — backend OWNER akışı sonrası.</p>
				</CardContent>
			</Card>
		</PageContainer>
	);
}
