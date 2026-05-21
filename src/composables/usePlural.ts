const ruPluralRules = new Intl.PluralRules('ru-RU');

export interface PluralForms {
	one: string;
	few: string;
	many: string;
}

export function plural(count: number, forms: PluralForms): string {
	const key = ruPluralRules.select(count);
	if (key === 'one') return forms.one;
	if (key === 'few') return forms.few;
	return forms.many;
}

export function pluralize(count: number, forms: PluralForms): string {
	return `${count} ${plural(count, forms)}`;
}

export const ACHIEVEMENT_FORMS: PluralForms = {
	one: 'ачивка',
	few: 'ачивки',
	many: 'ачивок',
};
