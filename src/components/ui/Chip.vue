<script setup lang="ts">
type Size = 'sm' | 'md';

interface Props {
	active?: boolean;
	count?: number;
	size?: Size;
	disabled?: boolean;
}

const {
	active = false,
	count,
	size = 'md',
	disabled = false,
} = defineProps<Props>();
</script>

<template>
	<button
		type="button"
		class="ui-chip"
		:class="[`size-${size}`, { active, disabled }]"
		:disabled="disabled"
	>
		<span class="chip-label"><slot /></span>
		<span v-if="count !== undefined" class="chip-count">{{ count }}</span>
	</button>
</template>

<style scoped>
.ui-chip {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	background: transparent;
	border: none;
	border-radius: 999px;
	color: var(--text-secondary);
	font-family: inherit;
	cursor: pointer;
	transition:
		background 0.15s ease,
		color 0.15s ease;
}

.size-sm {
	padding: 4px 10px;
	font-size: 0.72rem;
}
.size-md {
	padding: 5px 12px;
	font-size: 0.78rem;
}

.ui-chip:hover:not(:disabled):not(.active) {
	color: var(--text-primary);
}

.ui-chip.active {
	background: var(--text-primary);
	color: var(--page-bg);
}

.ui-chip:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.chip-count {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 18px;
	padding: 0 5px;
	border-radius: 999px;
	background: var(--surface-elevated-border);
	color: var(--text-muted);
	font-size: 0.66rem;
	font-weight: 600;
	line-height: 1.5;
}
.ui-chip.active .chip-count {
	background: var(--page-bg);
	color: var(--text-primary);
}
</style>
