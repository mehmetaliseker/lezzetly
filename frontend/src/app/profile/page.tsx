import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
	return (
		<PageContainer maxWidth="narrow" className="flex flex-1 flex-col py-12 sm:py-16">
			<PageHeader
				backHref="/"
				backLabel="Ana sayfa"
				title="Profil"
				description="Oturum açılmış kullanıcı bilgisi için useCurrentUser ve korumalı route yapısı sonraya bırakıldı."
			/>
			<Card className="mt-2">
				<CardContent className="py-8">
					<p className="text-center text-sm text-zinc-600">İskelet — auth sonrası doldurulacak.</p>
				</CardContent>
			</Card>
		</PageContainer>
	);
}
