/** `YYYY-MM-DD` (yerel iş günü) + seçilen saatler; backend’deki “geçmiş” mantığına yakın */
export function isReservationInPast(dateStr: string, selectedHours: number[], now: Date = new Date()): boolean {
	const pad = (value: number): string => value.toString().padStart(2, "0");
	const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
	if (dateStr < todayStr) {
		return true;
	}
	if (dateStr > todayStr) {
		return false;
	}
	if (selectedHours.length === 0) {
		return false;
	}
	const lastHour = Math.max(...selectedHours);
	return lastHour < now.getHours();
}
