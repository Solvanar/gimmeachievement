<script setup lang="ts">
import AwardIcon from '@/assets/icons/award.svg?component';

interface Props {
	totalPoints: number;
	totalPointsAvailable: number;
	progressPercent: number;
	level: number;
	unlockPercent: number;
}

defineProps<Props>();
</script>

<template>
	<div class="gamerscore-card">
		<div class="gamerscore-header">
			<div class="gamerscore-label">
				<AwardIcon class="gamerscore-icon" />
				ПРОГРЕСС И ГЕЙМЕРСКОР
			</div>
			<div class="gamerscore-score">
				<span class="score-current">{{ totalPoints }}G</span>
				<span class="score-total">/ {{ totalPointsAvailable }}G</span>
			</div>
		</div>
		<div class="progress-track">
			<div class="progress-fill" :style="{ width: `${progressPercent}%` }" />
		</div>
		<div class="gamerscore-footer">
			<span>Уровень {{ level }} Hunter</span>
			<span>{{ unlockPercent }}% ачивок разблокировано</span>
		</div>
	</div>
</template>

<style scoped>
.gamerscore-card {
	padding: 20px 24px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 20px;
	box-shadow: var(--shadow-card);
}

.gamerscore-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12px;
}

.gamerscore-icon {
	width: 18px;
	height: 18px;
	flex-shrink: 0;
	color: #f59e0b;
}

.gamerscore-label {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-family: monospace;
	font-size: 0.7rem;
	font-weight: 700;
	color: var(--text-muted);
	text-transform: uppercase;
	letter-spacing: 0.08em;
}

.gamerscore-score {
	font-family: monospace;
	font-size: 0.85rem;
}

.score-current {
	font-weight: 800;
	color: #f59e0b;
}

.score-total {
	color: var(--text-muted);
}

.progress-track {
	width: 100%;
	height: 10px;
	background: var(--input-bg);
	border: 1px solid var(--input-border);
	border-radius: 9999px;
	overflow: hidden;
	padding: 2px;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(to right, #14b8a6, #10b981, #6366f1);
	border-radius: 9999px;
	transition: width 1s ease;
	min-width: 4px;
}

.gamerscore-footer {
	display: flex;
	justify-content: space-between;
	font-family: monospace;
	font-size: 0.65rem;
	color: var(--text-muted);
	margin-top: 8px;
}
</style>
