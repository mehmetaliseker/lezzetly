"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastKind = "success" | "error";

type ToastItem = {
	id: number;
	kind: ToastKind;
	message: string;
};

type ToastContextValue = {
	showSuccess: (message: string) => void;
	showError: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<ToastItem[]>([]);

	const push = useCallback((kind: ToastKind, message: string) => {
		const id = Date.now() + Math.floor(Math.random() * 1000);
		setItems((prev) => [...prev, { id, kind, message }]);
		window.setTimeout(() => {
			setItems((prev) => prev.filter((item) => item.id !== id));
		}, 4000);
	}, []);

	const value = useMemo<ToastContextValue>(
		() => ({
			showSuccess: (message: string) => push("success", message),
			showError: (message: string) => push("error", message),
		}),
		[push]
	);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<div className="pointer-events-none fixed inset-x-0 top-4 z-[90] mx-auto flex w-full max-w-xl flex-col gap-2 px-4">
				{items.map((item) => (
					<div
						key={item.id}
						className={`rounded-md px-4 py-3 text-sm font-medium text-white shadow-lg transition-opacity duration-700 ${
							item.kind === "success" ? "bg-emerald-600/95" : "bg-red-600/95"
						}`}
					>
						{item.message}
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within ToastProvider");
	}
	return context;
}
