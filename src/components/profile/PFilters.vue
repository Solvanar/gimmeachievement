<script setup lang="ts">
import type { AchievementTheme } from '@/constants/achievementThemes';
import CheckCircleIcon from '@/assets/icons/check-circle.svg?component';
import LockIcon from '@/assets/icons/lock.svg?component';
import FilterIcon from '@/assets/icons/filter.svg?component';

type FilterValue = AchievementTheme | 'all';
type StatusFilter = 'all' | 'unlocked' | 'locked';

interface Props {
	statusFilter: StatusFilter;
	themeFilter: FilterValue;
	totalCount: number;
	unlockedCount: number;
	themeOptions: Array<{ value: FilterValue; label: string }>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	'update:statusFilter': [value: StatusFilter];
	'update:themeFilter': [value: FilterValue];
}>();
</script>

<template>
	<div class="filters-section">
		<div class="filters-row">
			<div class="filter-group">
				<button
					class="filter-btn"
					:class="{ active: props.statusFilter === 'all' }"
					@click="emit('update:statusFilter', 'all')"
				>
					Все ({{ totalCount }})
				</button>
				<button
					class="filter-btn"
					:class="{ active: props.statusFilter === 'unlocked' }"
					@click="emit('update:statusFilter', 'unlocked')"
				>
					<CheckCircleIcon class="filter-icon filter-icon--success" />
					Полученные ({{ unlockedCount }})
				</button>
				<button
					class="filter-btn"
					:class="{ active: props.statusFilter === 'locked' }"
					@click="emit('update:statusFilter', 'locked')"
				>
					<LockIcon class="filter-icon filter-icon--danger" />
					Закрытые ({{ totalCount - unlockedCount }})
				</button>
			</div>

			<div class="theme-filter">
				<span class="theme-filter-label">
					<FilterIcon class="funnel-icon" />
					Вайб:
				</span>
				<button
					v-for="opt in themeOptions"
					:key="opt.value"
					class="theme-chip"
					:class="{ active: props.themeFilter === opt.value }"
					@click="emit('update:themeFilter', opt.value)"
				>
					{{ opt.label }}
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.filters-section {
	display: flex;
	flex-direction: column;
	gap: 14px;
}

.filters-row {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

@media (min-width: 768px) {
	.filters-row {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
}

.filter-group {
	display: inline-flex;
	align-items: center;
	gap: 2px;
	padding: 4px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 12px;
}

.filter-btn {
	display: inline-flex;
	align-items: center;
	gap: 5px;
	padding: 6px 12px;
	font-size: 0.75rem;
	font-weight: 600;
	border-radius: 8px;
	border: none;
	background: transparent;
	color: var(--text-muted);
	cursor: pointer;
	transition:
		background 0.15s ease,
		color 0.15s ease;
	white-space: nowrap;
}

.filter-btn:hover {
	color: var(--text-primary);
}

.filter-btn.active {
	background: #4338ca;
	color: #ffffff;
}

.filter-icon {
	width: 12px;
	height: 12px;
	flex-shrink: 0;
}

.filter-icon--success {
	color: #34d399;
}

.filter-icon--danger {
	color: #fb7185;
}

.theme-filter {
	display: flex;
	align-items: center;
	gap: 6px;
	flex-wrap: wrap;
}

.funnel-icon {
	width: 11px;
	height: 11px;
	flex-shrink: 0;
}

.theme-filter-label {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-family: monospace;
	font-size: 0.65rem;
	font-weight: 600;
	text-transform: uppercase;
	color: var(--text-muted);
}

.theme-chip {
	padding: 5px 10px;
	font-size: 0.72rem;
	font-weight: 600;
	border-radius: 8px;
	border: 1px solid transparent;
	background: transparent;
	color: var(--text-muted);
	cursor: pointer;
	transition:
		background 0.15s ease,
		border-color 0.15s ease,
		color 0.15s ease;
}

.theme-chip:hover {
	color: var(--text-primary);
}

.theme-chip.active {
	background: var(--surface-elevated);
	border-color: var(--surface-elevated-border);
	color: var(--text-primary);
}

.info-hint {
	display: flex;
	align-items: flex-start;
	gap: 8px;
	padding: 12px 14px;
	background: rgba(30, 27, 75, 0.2);
	border: 1px solid rgba(99, 102, 241, 0.2);
	border-radius: 14px;
	font-size: 0.78rem;
	color: #a5b4fc;
	line-height: 1.5;
}

.info-icon {
	width: 16px;
	height: 16px;
	flex-shrink: 0;
	margin-top: 1px;
	color: #818cf8;
}

.info-hint p {
	margin: 0;
}
</style>
