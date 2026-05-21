/** "21 мая 2026 г." */
export function formatDate(iso: string): string {
	if (!iso) return '—';
	const d = new Date(iso);
	if (isNaN(d.getTime())) return iso.slice(0, 10);
	return d.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}

/** "21.05.2026" */
export function formatDateShort(iso: string): string {
	if (!iso) return '—';
	const d = new Date(iso);
	if (isNaN(d.getTime())) return iso.slice(0, 10);
	return d.toLocaleDateString('ru-RU');
}
