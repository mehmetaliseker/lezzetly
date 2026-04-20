import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
	return (
		<PageContainer maxWidth="narrow" className="flex flex-1 flex-col py-12 sm:py-16">
			<PageHeader
				backHref="/"
				backLabel="Ana sayfa"
				title="Kayıt"
				description="Kayıt endpoint’i ve roller (CUSTOMER / OWNER) netleşince bu sayfa doldurulacak."
			/>
			<Card className="mt-2">
				<CardContent className="py-8">
					<p className="text-center text-sm text-zinc-600">
						Şimdilik yalnızca iskelet.{" "}
						<Link className="font-medium text-zinc-900 underline-offset-2 hover:underline" href="/login">
							Giriş sayfası
						</Link>
					</p>
				</CardContent>
			</Card>
		</PageContainer>
	);
}
