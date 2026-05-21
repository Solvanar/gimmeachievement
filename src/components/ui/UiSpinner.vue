<script setup lang="ts">
type Size = 'sm' | 'md' | 'lg';

const { size = 'md' } = defineProps<{ size?: Size }>();
</script>

<template>
	<span
		class="ui-spinner"
		:class="`size-${size}`"
		role="status"
		aria-label="Загрузка"
	/>
</template>

<style scoped>
.ui-spinner {
	display: inline-block;
	border: 2px solid currentColor;
	border-right-color: transparent;
	border-radius: 50%;
	animation: spin 0.7s linear infinite;
	color: var(--text-muted);
}

.size-sm {
	width: 14px;
	height: 14px;
	border-width: 2px;
}
.size-md {
	width: 22px;
	height: 22px;
	border-width: 2px;
}
.size-lg {
	width: 36px;
	height: 36px;
	border-width: 3px;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
