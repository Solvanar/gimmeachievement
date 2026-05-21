import { describe, it, expect } from 'vitest';
import { formatDate, formatDateShort } from '../useFormatDate';

type Case = { name: string; input: string; expected: string };

// Inputs that should never produce a valid date — shared between both functions.
const invalidCases: Case[] = [
	{ name: 'empty string', input: '', expected: '' },
	{ name: 'random text', input: 'hello world', expected: '' },
	{
		name: 'date with garbage suffix (2026-99-99-junk)',
		input: '2026-99-99-junk',
		expected: '',
	},
	{
		name: 'compact ISO without dashes (20260521)',
		input: '20260521',
		expected: '',
	},
	{
		name: 'space separator instead of T',
		input: '2026-05-21 12:00:00',
		expected: '',
	},
	{
		name: 'invalid month (2026-99-21)',
		input: '2026-99-21',
		expected: '',
	},
	{
		name: 'invalid day (2026-05-99)',
		input: '2026-05-99',
		expected: '',
	},
];

// Midday UTC ⇒ the calendar date is the 21st in every real timezone.
const VALID_ISO = '2026-05-21T12:00:00Z';

describe('formatDate', () => {
	it.each<Case>([
		...invalidCases,
		{
			name: 'valid ISO with time',
			input: VALID_ISO,
			expected: '21 мая 2026 г.',
		},
	])('$name → "$expected"', ({ input, expected }) => {
		expect(formatDate(input)).toBe(expected);
	});
});

describe('formatDateShort', () => {
	it.each<Case>([
		...invalidCases,
		{
			name: 'valid ISO with time',
			input: VALID_ISO,
			expected: '21.05.2026',
		},
	])('$name → "$expected"', ({ input, expected }) => {
		expect(formatDateShort(input)).toBe(expected);
	});
});
