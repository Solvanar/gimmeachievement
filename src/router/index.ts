import { createRouter, createWebHistory } from 'vue-router';
import Catalog from '@/layouts/Catalog.vue';
import Achievement from '@/layouts/Achievement.vue';
import Profile from '@/layouts/Profile.vue';

export default createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', redirect: '/catalog' },
		{ path: '/catalog', component: Catalog },
		{ path: '/profile', component: Profile },
		{ path: '/achievement/:id', component: Achievement, props: true },
	],
});
