const API_BASE = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
		this.name = 'ApiError';
	}
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	let res: Response;

	try {
		res = await fetch(`${API_BASE}${path}`, {
			...init,
			headers: {
				'Content-Type': 'application/json',
				...init?.headers,
			},
		});
	} catch {
		throw new ApiError(0, 'Не удалось соединиться с сервером');
	}

	if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`);

	if (res.status === 204) return undefined as T;

	try {
		return await res.json();
	} catch {
		throw new ApiError(res.status, 'Не удалось разобрать ответ сервера');
	}
}

export function apiGet<T>(path: string): Promise<T> {
	return request<T>(path);
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
	return request<T>(path, {
		method: 'POST',
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});
}

export function apiPut<T>(path: string, body?: unknown): Promise<T> {
	return request<T>(path, {
		method: 'PUT',
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});
}

export function apiDelete<T>(path: string): Promise<T> {
	return request<T>(path, { method: 'DELETE' });
}
