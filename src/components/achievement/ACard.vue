<script setup lang="ts">
import AchievementCard from '@/components/AchievementCard.vue';
import type { Achievement } from '@/types/achievement';

defineProps<{ achievement: Achievement }>();
</script>

<template>
	<div>
		<div class="category-tag-wrap">
			<span class="category-tag">
				{{ (achievement.category ?? achievement.theme).toUpperCase() }} //
				ACHIEVEMENT CARD
			</span>
		</div>
		<div class="large-card-wrap">
			<AchievementCard :achievement="achievement" size="large" :interactive="false" />
		</div>
	</div>
</template>

<style scoped>
.category-tag-wrap {
	text-align: center;
	margin-bottom: 24px;
}

.category-tag {
	font-family: monospace;
	font-size: 0.65rem;
	text-transform: uppercase;
	letter-spacing: 0.12em;
	padding: 5px 14px;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 9999px;
	color: rgba(255, 255, 255, 0.6);
}

.large-card-wrap {
	display: flex;
	justify-content: center;
	margin-bottom: 32px;
}
</style>
