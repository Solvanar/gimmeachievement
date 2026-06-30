import { apiGet, apiPost } from './api';
import type { User } from '@/types/user';

export interface AuthResponse {
	accessToken: string;
	user: User;
}

export function login(login: string, password: string): Promise<AuthResponse> {
	return apiPost<AuthResponse>('/api/auth/login', { login, password });
}

export function register(
	login: string,
	password: string,
	displayName: string,
): Promise<AuthResponse> {
	return apiPost<AuthResponse>('/api/auth/register', { login, password, displayName });
}

export function logout(): Promise<void> {
	return apiPost<void>('/api/auth/logout');
}

export function fetchMe(): Promise<User> {
	return apiGet<User>('/api/auth/me');
}
