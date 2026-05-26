import { createRouter, createWebHistory } from 'vue-router';
import Profile from '@/layouts/Profile.vue';
import Achievement from '@/layouts/Achievement.vue';
import Shop from '@/layouts/Shop.vue';
import Guide from '@/layouts/Guide.vue';

export default createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', redirect: '/profile' },
		{ path: '/profile', component: Profile },
		{ path: '/achievement/:id', component: Achievement, props: true },
		{ path: '/shop', component: Shop },
		{ path: '/guide', component: Guide },
	],
});
