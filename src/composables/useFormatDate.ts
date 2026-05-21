/**
 * Accepts: "2026-05-21", "2026-05-21T12:00:00", "...Z", "...+03:00", "...0000".
 */
const ISO_DATE_PATTERN =
	/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;

function tryParseIso(iso: string): Date | null {
	if (!iso) return null;

	if (!ISO_DATE_PATTERN.test(iso)) return null;

	const date = new Date(iso);

	return isNaN(date.getTime()) ? null : date;
}

/** "21 мая 2026 г." */
export function formatDate(iso: string): string {
	const date = tryParseIso(iso);

	if (!date) return '';

	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}

/** "21.05.2026" */
export function formatDateShort(iso: string): string {
	const date = tryParseIso(iso);

	if (!date) return '';

	return date.toLocaleDateString('ru-RU');
}
