"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

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

const TOAST_DURATION_MS = 4000;

type TimerHandle = ReturnType<typeof setTimeout>;

type ToastSingleProps = {
	item: ToastItem;
	onRemove: (id: number) => void;
};

function ToastSingle({ item, onRemove }: ToastSingleProps) {
	const timeoutRef = useRef<TimerHandle | null>(null);
	const intervalRef = useRef<TimerHandle | null>(null);
	const [elapsedMs, setElapsedMs] = useState(0);
	const [reduceMotion] = useState(() => {
		if (typeof window === "undefined") {
			return false;
		}
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	});

	const dismiss = useCallback(() => {
		if (timeoutRef.current != null) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		if (intervalRef.current != null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		onRemove(item.id);
	}, [item.id, onRemove]);

	useEffect(() => {
		const startedAt = Date.now();

		timeoutRef.current = setTimeout(() => dismiss(), TOAST_DURATION_MS);
		intervalRef.current = setInterval(() => {
			setElapsedMs(Date.now() - startedAt);
		}, 80);

		return () => {
			if (timeoutRef.current != null) {
				clearTimeout(timeoutRef.current);
			}
			if (intervalRef.current != null) {
				clearInterval(intervalRef.current);
			}
		};
	}, [dismiss]);

	const clamped = Math.min(TOAST_DURATION_MS, elapsedMs);
	const remainingRatio = 1 - clamped / TOAST_DURATION_MS;
	const opacity = reduceMotion ? 1 : remainingRatio;

	return (
		<div
			role="alert"
			tabIndex={0}
			onClick={dismiss}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					dismiss();
				}
			}}
			title="Kapatmak için tıklayın"
			className={`pointer-events-auto w-[min(22rem,calc(100vw-2.5rem))] cursor-pointer rounded-lg px-5 py-3 text-left shadow-lg outline-none ring-offset-2 transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-amber-400/60 ${
				item.kind === "success" ? "bg-emerald-600/95 ring-offset-emerald-950" : "bg-red-600/95 ring-offset-red-950"
			}`}
			style={{ opacity }}
		>
			<p className="line-clamp-2 min-h-[2.75rem] break-words text-sm font-medium leading-snug text-white">
				{item.message}
			</p>
			<div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
				<div className="h-full rounded-full bg-white/75" style={{ width: `${remainingRatio * 100}%` }} />
			</div>
		</div>
	);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<ToastItem[]>([]);

	const remove = useCallback((id: number) => {
		setItems((previous) => previous.filter((item) => item.id !== id));
	}, []);

	const push = useCallback((kind: ToastKind, message: string) => {
		const id = Date.now() + Math.floor(Math.random() * 1000);
		setItems((previous) => [...previous, { id, kind, message }]);
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
			<div
				aria-live="polite"
				className="pointer-events-none fixed left-4 top-[calc(var(--header-height)+0.75rem)] z-[90] flex w-auto max-w-none flex-col items-start gap-2 sm:left-6"
			>
				{items.map((item) => (
					<ToastSingle key={item.id} item={item} onRemove={remove} />
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
