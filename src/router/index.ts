import { createRouter, createWebHistory } from 'vue-router';
import AchievementList from '@/views/AchievementList.vue';
import AchievementDetail from '@/views/AchievementDetail.vue';

export default createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: AchievementList },
		{ path: '/achievement/:id', component: AchievementDetail, props: true },
	],
});
