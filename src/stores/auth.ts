import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { User } from '@/types/user';
import {
	login as apiLogin,
	register as apiRegister,
	logout as apiLogout,
	fetchMe,
} from '@/services/auth';
import { setAccessToken } from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
	const user = ref<User | null>(null);
	const ready = ref(false);

	const isAuthenticated = computed(() => user.value !== null);

	async function restoreSession() {
		if (ready.value) return;

		try {
			user.value = await fetchMe();
		} catch {
			user.value = null;
		} finally {
			ready.value = true;
		}
	}

	async function login(loginName: string, password: string) {
		const response = await apiLogin(loginName, password);
		setAccessToken(response.accessToken);
		user.value = response.user;
	}

	async function register(
		loginName: string,
		password: string,
		displayName: string,
	) {
		const response = await apiRegister(loginName, password, displayName);
		setAccessToken(response.accessToken);
		user.value = response.user;
	}

	async function logout() {
		try {
			await apiLogout();
		} finally {
			setAccessToken(null);
			user.value = null;
		}
	}

	function clearSession() {
		user.value = null;
	}

	return {
		user,
		ready,
		isAuthenticated,
		restoreSession,
		login,
		register,
		logout,
		clearSession,
	};
});
