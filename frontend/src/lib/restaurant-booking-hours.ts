/**
 * Backend `DefaultReservationService` ile aynı mantık:
 * `firstBookableHourInclusive` / `lastBookableHourInclusive`
 */
export function firstBookableHourInclusive(openingTime: string | null | undefined): number {
	if (!openingTime?.trim()) {
		return 0;
	}
	const hour = parseInt(openingTime.trim().split(":")[0] ?? "", 10);
	if (!Number.isFinite(hour)) {
		return 0;
	}
	return Math.min(23, Math.max(0, hour));
}

export function lastBookableHourInclusive(closingTime: string | null | undefined): number {
	if (!closingTime?.trim()) {
		return 23;
	}
	const parts = closingTime.trim().split(":");
	const hour = parseInt(parts[0] ?? "", 10);
	const minute = parseInt(parts[1] ?? "0", 10);
	const second = parts.length > 2 ? parseInt(parts[2] ?? "0", 10) : 0;
	if (!Number.isFinite(hour)) {
		return 23;
	}
	const safeMinute = Number.isFinite(minute) ? minute : 0;
	const safeSecond = Number.isFinite(second) ? second : 0;
	if (safeMinute === 0 && safeSecond === 0) {
		return Math.max(0, hour - 1);
	}
	return Math.max(0, hour - 1);
}
