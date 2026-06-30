import { ApiError, messageForStatus } from './errors';
import { getAccessToken, setAccessToken } from './authToken';
import { notifySessionExpired } from './session';

const API_BASE = import.meta.env.VITE_API_URL;

// Эндпоинты, для которых НЕ пытаемся авто-рефрешить токен при 401:
// для login/register 401 — это неверные данные, а refresh сам себя не чинит.
const NO_REFRESH_PATHS = new Set([
	'/api/auth/login',
	'/api/auth/register',
	'/api/auth/refresh',
]);

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

	const token = getAccessToken();

	if (token) headers.Authorization = `Bearer ${token}`;

	if (custom) Object.assign(headers, custom);

	return headers;
}

// Один общий промис на все параллельные рефреши, чтобы при пачке
// одновременных 401 не дёргать /refresh несколько раз.
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
	if (!refreshPromise) {
		refreshPromise = doRefresh().finally(() => {
			refreshPromise = null;
		});
	}

	return refreshPromise;
}

async function doRefresh(): Promise<boolean> {
	try {
		const res = await fetch(`${API_BASE}/api/auth/refresh`, {
			method: 'POST',
			credentials: 'include',
		});

		// Сессия мертва (refresh-токен протух/отозван) — чистим access-токен
		// и оповещаем приложение, чтобы сбросить юзера и увести на логин.
		if (!res.ok) {
			setAccessToken(null);
			notifySessionExpired();

			return false;
		}

		const data = (await res.json()) as { accessToken: string };
		setAccessToken(data.accessToken);

		return true;
	} catch {
		// Сетевая ошибка — возможно временная, токен не трогаем
		return false;
	}
}

export async function request<T>(
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	return doRequest<T>(path, options, false);
}

async function doRequest<T>(
	path: string,
	options: RequestOptions,
	isRetry: boolean,
): Promise<T> {
	const { method = 'GET', body, query, headers, signal } = options;

	const init: RequestInit = {
		method,
		headers: buildHeaders(headers),
		signal,
		credentials: 'include',
	};

	if (body !== undefined) init.body = JSON.stringify(body);

	let res: Response;

	try {
		res = await fetch(buildUrl(path, query), init);
	} catch {
		throw new ApiError(0, messageForStatus(0));
	}

	// Истёк access-токен → разово пробуем обновить его и повторить запрос.
	if (res.status === 401 && !isRetry && !NO_REFRESH_PATHS.has(path)) {
		const refreshed = await tryRefresh();

		if (refreshed) return doRequest<T>(path, options, true);
	}

	if (!res.ok) throw new ApiError(res.status, messageForStatus(res.status));

	if (res.status === 204) return undefined as T;

	try {
		return await res.json();
	} catch {
		throw new ApiError(res.status, 'Не удалось разобрать ответ сервера');
	}
}
