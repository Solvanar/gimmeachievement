import { describe, it, expect } from 'vitest';
import { plural, pluralize, ACHIEVEMENT_FORMS } from './usePlural';

describe('plural', () => {
	const forms = ACHIEVEMENT_FORMS; // { one: 'ачивка', few: 'ачивки', many: 'ачивок' }

	it('returns the "one" form for 1', () => {
		expect(plural(1, forms)).toBe('ачивка');
	});

	it('returns the "few" form for 2–4', () => {
		expect(plural(2, forms)).toBe('ачивки');
		expect(plural(3, forms)).toBe('ачивки');
		expect(plural(4, forms)).toBe('ачивки');
	});

	it('returns the "many" form for 5–20', () => {
		expect(plural(5, forms)).toBe('ачивок');
		expect(plural(10, forms)).toBe('ачивок');
		expect(plural(20, forms)).toBe('ачивок');
	});

	it('treats 0 as the "many" form (Russian rule)', () => {
		expect(plural(0, forms)).toBe('ачивок');
	});

	it('treats 11–14 as the "many" form (special case)', () => {
		expect(plural(11, forms)).toBe('ачивок');
		expect(plural(12, forms)).toBe('ачивок');
		expect(plural(13, forms)).toBe('ачивок');
		expect(plural(14, forms)).toBe('ачивок');
	});

	it('handles numbers > 20 by their last digit', () => {
		expect(plural(21, forms)).toBe('ачивка'); // ends in 1
		expect(plural(22, forms)).toBe('ачивки'); // ends in 2
		expect(plural(25, forms)).toBe('ачивок'); // ends in 5
		expect(plural(101, forms)).toBe('ачивка');
		expect(plural(111, forms)).toBe('ачивок'); // hundred-and-eleven → many
	});
});

describe('pluralize', () => {
	it('combines the number and the inflected noun', () => {
		expect(pluralize(1, ACHIEVEMENT_FORMS)).toBe('1 ачивка');
		expect(pluralize(3, ACHIEVEMENT_FORMS)).toBe('3 ачивки');
		expect(pluralize(7, ACHIEVEMENT_FORMS)).toBe('7 ачивок');
	});
});
