import { request, type RequestOptions } from './request';

export { ApiError, messageForStatus } from './errors';
export { getAccessToken, setAccessToken } from './authToken';
export { onSessionExpired } from './session';
export type { Query, QueryValue, RequestOptions } from './request';

type PublicOptions = Omit<RequestOptions, 'method' | 'body'>;

export function apiGet<T>(path: string, options?: PublicOptions): Promise<T> {
	return request<T>(path, { ...options, method: 'GET' });
}

export function apiPost<T>(
	path: string,
	body?: unknown,
	options?: PublicOptions,
): Promise<T> {
	return request<T>(path, { ...options, method: 'POST', body });
}

export function apiPut<T>(
	path: string,
	body?: unknown,
	options?: PublicOptions,
): Promise<T> {
	return request<T>(path, { ...options, method: 'PUT', body });
}

export function apiPatch<T>(
	path: string,
	body?: unknown,
	options?: PublicOptions,
): Promise<T> {
	return request<T>(path, { ...options, method: 'PATCH', body });
}

export function apiDelete<T>(
	path: string,
	options?: PublicOptions,
): Promise<T> {
	return request<T>(path, { ...options, method: 'DELETE' });
}
