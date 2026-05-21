import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiGet, apiPost, apiDelete } from '../api';

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
});
