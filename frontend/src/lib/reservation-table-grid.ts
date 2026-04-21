/** Rezervasyon masa ızgarası: dikey alan her zaman 6 satır (gap ile). */
export const RESERVATION_TABLE_GRID_ROW_COUNT = 6;
const RESERVATION_TABLE_CELL_MIN_HEIGHT_REM = 2.5;
const RESERVATION_TABLE_GRID_GAP_REM = 0.5;

export const RESERVATION_TABLE_GRID_MIN_HEIGHT = `calc(${RESERVATION_TABLE_GRID_ROW_COUNT} * ${RESERVATION_TABLE_CELL_MIN_HEIGHT_REM}rem + ${RESERVATION_TABLE_GRID_ROW_COUNT - 1} * ${RESERVATION_TABLE_GRID_GAP_REM}rem)`;

/**
 * Tailwind ile aynı kırılımlar: `grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10`
 * Sayfa başına en fazla `RESERVATION_TABLE_GRID_ROW_COUNT * sütun` masa → scroll olmadan 6 satır.
 */
const RESERVATION_TABLE_GRID_BREAKPOINTS = [
	{ minWidthPx: 1024, columns: 10 },
	{ minWidthPx: 768, columns: 6 },
	{ minWidthPx: 640, columns: 4 },
] as const;

export function resolveReservationTableGridColumnCount(viewportWidth: number): number {
	for (const entry of RESERVATION_TABLE_GRID_BREAKPOINTS) {
		if (viewportWidth >= entry.minWidthPx) {
			return entry.columns;
		}
	}
	return 2;
}
