const API_BASE = 'http://localhost:8080';

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
	const res = await fetch(`${API_BASE}${path}`, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...init?.headers,
		},
	});

	if (!res.ok) {
		throw new ApiError(res.status, `HTTP ${res.status}`);
	}

	if (res.status === 204) return undefined as T;

	return res.json();
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

export function apiDelete<T>(path: string): Promise<T> {
	return request<T>(path, { method: 'DELETE' });
}
