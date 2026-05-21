/** "21 мая 2026 г." */
export function formatDate(iso: string): string {
	if (!iso) return '—';

	const formattedDate = new Date(iso);
	if (isNaN(formattedDate.getTime())) return iso.slice(0, 10);

	return formattedDate.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}

/** "21.05.2026" */
export function formatDateShort(iso: string): string {
	if (!iso) return '—';

	const formattedDate = new Date(iso);
	if (isNaN(formattedDate.getTime())) return iso.slice(0, 10);

	return formattedDate.toLocaleDateString('ru-RU');
}
