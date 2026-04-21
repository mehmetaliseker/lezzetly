import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminPage() {
	return (
		<PageContainer maxWidth="narrow" className="flex flex-1 flex-col py-12 sm:py-16">
			<PageHeader
				backHref="/"
				backLabel="Ana sayfa"
				title="Yönetim"
				description="ADMIN rolü ve yönetim API’leri tanımlandığında bu alan korunmuş route olarak genişletilecek."
			/>
			<Card className="mt-2">
				<CardContent className="py-8">
					<p className="text-center text-sm text-zinc-600">İskelet — admin API sonrası.</p>
				</CardContent>
			</Card>
		</PageContainer>
	);
}
