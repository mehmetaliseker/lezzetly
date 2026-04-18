import Link from "next/link";

export default function Home() {
	return (
		<main className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center gap-8 px-6 py-24">
			<div className="flex flex-col gap-3">
				<h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Lezzetly</h1>
				<p className="text-base leading-relaxed text-zinc-600">
					Öğrenme odaklı restoran rezervasyon iskeleti: Spring Boot API, Swagger, TanStack Query ve
					özellik bayrakları ile uçtan uca çekirdek akış.
				</p>
			</div>
			<div className="flex flex-wrap gap-3">
				<Link
					className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
					href="/rezervasyon"
				>
					Rezervasyon akışına git
				</Link>
				<a
					className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
					href="http://localhost:8080/swagger-ui.html"
					rel="noreferrer"
					target="_blank"
				>
					Swagger UI
				</a>
			</div>
		</main>
	);
}
