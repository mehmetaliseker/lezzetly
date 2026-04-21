"use client";

import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { HomeFooter } from "@/features/home/components/home-footer";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function OwnerWelcomePage() {
	const currentUserQuery = useCurrentUser();
	const fullName = currentUserQuery.data
		? `${currentUserQuery.data.firstName} ${currentUserQuery.data.lastName}`
		: "İşletme sahibi";

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-stone-950">
			<PageContainer maxWidth="site" className="flex flex-1 items-center py-10 sm:py-14">
				<section className="w-full rounded-2xl border border-stone-800 bg-stone-900/80 p-8 shadow-xl">
					<p className="text-sm font-semibold uppercase tracking-wide text-stone-400">Owner Landing</p>
					<h1 className="mt-2 text-3xl font-semibold text-stone-50">Hoş geldiniz, {fullName}</h1>
					<p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-400">
						İşletme profilinizi düzenleyebilir, görsellerinizi yönetebilir ve müşteri görünümünüzü iyileştirebilirsiniz.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<Link
							className="inline-flex min-h-11 items-center justify-center rounded-md bg-stone-200 px-6 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
							href="/owner/profile"
						>
							İşletme profilini yönet
						</Link>
					</div>
				</section>
			</PageContainer>
			<HomeFooter />
		</div>
	);
}
