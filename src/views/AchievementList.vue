<script setup lang="ts">
import { onMounted } from 'vue';
import { useAchievementsStore } from '@/stores/achievements';
import AchievementCard from '@/components/AchievementCard.vue';

const store = useAchievementsStore();
onMounted(() => store.fetchAll());
</script>

<template>
	<div class="list-page">
		<header class="list-header">
			<h1>Мои достижения</h1>
			<p class="subtitle">{{ store.achievements.length }} разблокировано</p>
		</header>

		<p v-if="store.loading" class="state-msg">Загрузка...</p>
		<p v-else-if="store.error" class="state-msg state-error">
			{{ store.error }}
		</p>

		<div v-else class="cards-grid">
			<AchievementCard
				v-for="achievement in store.achievements"
				:key="achievement.id"
				:achievement="achievement"
			/>
		</div>
	</div>
</template>

<style scoped>
.list-page {
	min-height: 100vh;
	padding: 60px 24px;
	display: grid;
	grid-template-columns: 1fr;
	justify-items: center;
	row-gap: 48px;
}

.list-header {
	text-align: center;
}

.list-header h1 {
	font-size: clamp(2rem, 5vw, 2.6rem);
	font-weight: 800;
	letter-spacing: -0.02em;
	margin: 0 0 8px;
	background: linear-gradient(
		135deg,
		var(--hero-text-from) 0%,
		var(--hero-text-to) 100%
	);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.subtitle {
	color: var(--text-muted);
	font-size: 0.85rem;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	margin: 0;
}

.state-msg {
	color: var(--text-muted);
	font-size: 0.95rem;
}
.state-error {
	color: var(--text-error);
}

/* ── Cards grid ── */
.cards-grid {
	display: grid;
	/* 320px fixed columns; auto-fill packs as many columns as fit; 80px gap leaves room for SVG decor */
	grid-template-columns: repeat(auto-fill, 320px);
	column-gap: 80px;
	row-gap: 40px;
	justify-content: center;
	width: 100%;
	max-width: 1280px;
}

@media (max-width: 480px) {
	.list-page {
		padding: 40px 16px;
		row-gap: 32px;
	}
	.cards-grid {
		grid-template-columns: 1fr;
		column-gap: 0;
		row-gap: 32px;
	}
}
</style>
