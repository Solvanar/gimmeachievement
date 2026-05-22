import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiGet, apiPost, apiDelete, messageForStatus } from '../api';

function mockResponse(body: unknown, init: ResponseInit = { status: 200 }) {
	return new Response(JSON.stringify(body), {
		...init,
		headers: { 'Content-Type': 'application/json', ...init.headers },
	});
}

describe('api service', () => {
	let fetchMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		fetchMock = vi.fn();
		globalThis.fetch = fetchMock as unknown as typeof fetch;
	});

	describe('apiGet', () => {
		it('hits the right URL and returns parsed JSON', async () => {
			fetchMock.mockResolvedValueOnce(mockResponse({ id: '1', title: 'Test' }));

			const result = await apiGet<{ id: string; title: string }>('/api/test');

			expect(fetchMock).toHaveBeenCalledOnce();
			const [url] = fetchMock.mock.calls[0];
			expect(url).toMatch(/\/api\/test$/);
			expect(result).toEqual({ id: '1', title: 'Test' });
		});

		it('sends Content-Type: application/json header', async () => {
			fetchMock.mockResolvedValueOnce(mockResponse({}));

			await apiGet('/api/anything');

			const [, init] = fetchMock.mock.calls[0];
			expect(init.headers['Content-Type']).toBe('application/json');
		});

		it('throws ApiError when response is not ok', async () => {
			fetchMock.mockResolvedValueOnce(
				new Response('not found', { status: 404 }),
			);

			await expect(apiGet('/api/missing')).rejects.toMatchObject({
				name: 'ApiError',
				status: 404,
			});
		});

		it('returns undefined on 204 No Content', async () => {
			fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

			const result = await apiGet('/api/empty');
			expect(result).toBeUndefined();
		});

		it('throws ApiError(0) on network failure', async () => {
			fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));

			await expect(apiGet('/api/anything')).rejects.toMatchObject({
				name: 'ApiError',
				status: 0,
			});
		});

		it('throws ApiError when body is not valid JSON', async () => {
			fetchMock.mockResolvedValueOnce(
				new Response('not-json-at-all', { status: 200 }),
			);

			await expect(apiGet('/api/broken')).rejects.toMatchObject({
				name: 'ApiError',
				status: 200,
			});
		});
	});

	describe('apiPost', () => {
		it('uses POST method and serialises the body', async () => {
			fetchMock.mockResolvedValueOnce(mockResponse({ ok: true }));

			await apiPost('/api/claim', { code: 'ABCD-1234' });

			const [, init] = fetchMock.mock.calls[0];
			expect(init.method).toBe('POST');
			expect(init.body).toBe(JSON.stringify({ code: 'ABCD-1234' }));
		});

		it('sends no body when none is provided', async () => {
			fetchMock.mockResolvedValueOnce(mockResponse({}));

			await apiPost('/api/ping');

			const [, init] = fetchMock.mock.calls[0];
			expect(init.body).toBeUndefined();
		});
	});

	describe('apiDelete', () => {
		it('uses DELETE method', async () => {
			fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

			await apiDelete('/api/items/1');

			const [, init] = fetchMock.mock.calls[0];
			expect(init.method).toBe('DELETE');
		});
	});

	describe('query params', () => {
		it('appends query string when query is provided', async () => {
			fetchMock.mockResolvedValueOnce(mockResponse([]));

			await apiGet('/api/items', { query: { page: 1, q: 'test' } });

			const [url] = fetchMock.mock.calls[0];
			expect(url).toMatch(/\/api\/items\?/);
			expect(url).toContain('page=1');
			expect(url).toContain('q=test');
		});

		it('skips undefined and null values from the query', async () => {
			fetchMock.mockResolvedValueOnce(mockResponse([]));

			await apiGet('/api/items', {
				query: { a: 'x', b: undefined, c: null, d: 0 },
			});

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain('a=x');
			expect(url).toContain('d=0');
			expect(url).not.toContain('b=');
			expect(url).not.toContain('c=');
		});
	});

	describe('custom headers', () => {
		it('merges custom headers with defaults', async () => {
			fetchMock.mockResolvedValueOnce(mockResponse({}));

			await apiGet('/api/anything', {
				headers: { 'X-Custom': 'value' },
			});

			const [, init] = fetchMock.mock.calls[0];
			expect(init.headers['Content-Type']).toBe('application/json');
			expect(init.headers['X-Custom']).toBe('value');
		});

		it('allows custom header to override the default', async () => {
			fetchMock.mockResolvedValueOnce(mockResponse({}));

			await apiGet('/api/anything', {
				headers: { 'Content-Type': 'text/plain' },
			});

			const [, init] = fetchMock.mock.calls[0];
			expect(init.headers['Content-Type']).toBe('text/plain');
		});
	});
});

describe('messageForStatus', () => {
	it.each([
		[0, 'Не удалось соединиться с сервером'],
		[401, 'Требуется авторизация'],
		[404, 'Не найдено'],
		[500, 'Внутренняя ошибка сервера'],
	])(
		'maps status %d to a human-readable Russian message',
		(status, expected) => {
			expect(messageForStatus(status)).toBe(expected);
		},
	);

	it('falls back to a generic message for unknown 4xx', () => {
		expect(messageForStatus(418)).toBe('Ошибка запроса (418)');
	});

	it('falls back to a generic 5xx message for unknown server errors', () => {
		expect(messageForStatus(599)).toBe('Ошибка сервера');
	});
});
