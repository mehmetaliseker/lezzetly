import { Suspense } from "react";

import { LoginView } from "./login-view";

function LoginFallback() {
	return (
		<div className="flex min-h-[60svh] flex-1 items-center justify-center bg-stone-950 px-4">
			<p className="text-sm text-stone-500">Yükleniyor…</p>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<LoginFallback />}>
			<LoginView />
		</Suspense>
	);
}
