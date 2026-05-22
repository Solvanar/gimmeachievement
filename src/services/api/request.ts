import { ApiError, messageForStatus } from './errors';

const API_BASE = import.meta.env.VITE_API_URL;

export type QueryValue = string | number | boolean | undefined | null;
export type Query = Record<string, QueryValue>;

export interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: unknown;
	query?: Query;
	headers?: Record<string, string>;
	signal?: AbortSignal;
}

function buildUrl(path: string, query?: Query): string {
	if (!query) return `${API_BASE}${path}`;

	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(query)) {
		if (value === undefined || value === null) continue;

		params.set(key, String(value));
	}

	const queryString = params.toString();

	return queryString
		? `${API_BASE}${path}?${queryString}`
		: `${API_BASE}${path}`;
}

function buildHeaders(custom?: Record<string, string>): HeadersInit {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	// const token = useAuthStore().token;
	// if (token) headers.Authorization = `Bearer ${token}`;

	if (custom) Object.assign(headers, custom);

	return headers;
}

export async function request<T>(
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, signal } = options;

	const init: RequestInit = {
		method,
		headers: buildHeaders(headers),
		signal,
	};

	if (body !== undefined) init.body = JSON.stringify(body);

	let res: Response;

	try {
		res = await fetch(buildUrl(path, query), init);
	} catch {
		throw new ApiError(0, messageForStatus(0));
	}

	if (!res.ok) throw new ApiError(res.status, messageForStatus(res.status));

	if (res.status === 204) return undefined as T;

	try {
		return await res.json();
	} catch {
		throw new ApiError(res.status, 'Не удалось разобрать ответ сервера');
	}
}
