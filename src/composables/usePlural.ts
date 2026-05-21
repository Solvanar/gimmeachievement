const ruPluralRules = new Intl.PluralRules('ru-RU');

export interface PluralForms {
	one: string;
	few: string;
	many: string;
}

/**
 * Pick the right plural form for a number using Intl.PluralRules.
 * @example plural(5, { one: 'ачивка', few: 'ачивки', many: 'ачивок' }) → 'ачивок'
 */
export function plural(n: number, forms: PluralForms): string {
	const key = ruPluralRules.select(n);
	if (key === 'one') return forms.one;
	if (key === 'few') return forms.few;
	return forms.many;
}

/**
 * Format a number together with its inflected noun.
 * @example pluralize(5, { one: 'ачивка', few: 'ачивки', many: 'ачивок' }) → '5 ачивок'
 */
export function pluralize(n: number, forms: PluralForms): string {
	return `${n} ${plural(n, forms)}`;
}

/* ── Reusable noun dictionaries ── */

export const ACHIEVEMENT_FORMS: PluralForms = {
	one: 'ачивка',
	few: 'ачивки',
	many: 'ачивок',
};
