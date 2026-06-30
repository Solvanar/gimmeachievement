import { createRouter, createWebHistory } from 'vue-router';
import Profile from '@/layouts/Profile.vue';
import Achievement from '@/layouts/Achievement.vue';
import Shop from '@/layouts/Shop.vue';
import Guide from '@/layouts/Guide.vue';
import Login from '@/layouts/Login.vue';
import Register from '@/layouts/Register.vue';
import { useAuthStore } from '@/stores/auth';
import { onSessionExpired } from '@/services/api';

const PUBLIC_PATHS = new Set(['/login', '/register']);

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', redirect: '/profile' },
		{ path: '/login', component: Login },
		{ path: '/register', component: Register },
		{ path: '/profile', component: Profile },
		{ path: '/achievement/:id', component: Achievement, props: true },
		{ path: '/shop', component: Shop },
		{ path: '/guide', component: Guide },
	],
});

onSessionExpired(() => {
	useAuthStore().clearSession();

	if (!PUBLIC_PATHS.has(router.currentRoute.value.path)) {
		router.replace('/login');
	}
});

router.beforeEach(async (to) => {
	const authStore = useAuthStore();

	await authStore.restoreSession();

	const isPublic = PUBLIC_PATHS.has(to.path);

	if (!authStore.isAuthenticated && !isPublic) {
		return { path: '/login' };
	}

	if (authStore.isAuthenticated && isPublic) {
		return { path: '/profile' };
	}
});

export default router;
