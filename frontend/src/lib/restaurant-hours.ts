export function normalizeRestaurantHourToSelectValue(
	time: string | null | undefined,
	fallbackHour: number
): string {
	const safeFallback = Math.min(23, Math.max(0, fallbackHour));
	if (!time || !time.trim()) {
		return `${String(safeFallback).padStart(2, "0")}:00`;
	}
	const hourPart = time.trim().split(":")[0] ?? "0";
	const hour = parseInt(hourPart, 10);
	if (!Number.isFinite(hour)) {
		return `${String(safeFallback).padStart(2, "0")}:00`;
	}
	const clamped = Math.min(23, Math.max(0, hour));
	return `${String(clamped).padStart(2, "0")}:00`;
}

export const RESTAURANT_HOUR_OPTIONS: readonly string[] = Array.from({ length: 24 }, (_, index) => {
	const hour = String(index).padStart(2, "0");
	return `${hour}:00`;
});
