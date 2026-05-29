<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Achievement } from '@/types/achievement';
import ACard from '@/components/achievement/ACard.vue';

defineProps<{ achievements: Achievement[] }>();

const router = useRouter();

function openAchievement(id: string) {
	router.push(`/achievement/${id}`);
}
</script>

<template>
	<div class="achievement-list">
		<div v-if="achievements.length === 0" class="empty-state">
			<span class="empty-icon">👀</span>
			<p>Нет ачивок, подходящих под выбранные фильтры.</p>
		</div>
		<div
			v-for="achievement in achievements"
			:key="achievement.id"
			class="achievement-item"
			@click="openAchievement(achievement.id)"
		>
			<ACard :achievement="achievement" :interactive="false" />
		</div>
	</div>
</template>

<style scoped>
.achievement-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.achievement-item {
	cursor: pointer;
}

.empty-state {
	padding: 48px 24px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 20px;
	text-align: center;
}

.empty-icon {
	font-size: 2rem;
}

.empty-state p {
	margin: 8px 0 0;
	color: var(--text-muted);
	font-size: 0.9rem;
}
</style>
