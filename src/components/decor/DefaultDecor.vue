<script setup lang="ts">
import type { Achievement } from '@/types/achievement';
import CardShell from './CardShell.vue';

interface Props {
	achievement: Achievement;
	size?: 'normal' | 'large';
	interactive?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
	<CardShell class="default-shell" v-bind="props" />
</template>

<style scoped>
.default-shell {
	--card-bg: var(--default-card-bg);
	--card-border-color: var(--default-card-border);
	--card-text-color: var(--default-card-text);
	--circle-bg: var(--default-circle-bg);
	--circle-border-color: var(--default-circle-border);
	--circle-ring: var(--default-circle-ring);
	--circle-text-color: var(--default-circle-text);
	--title-color: var(--default-card-title);
	--badge-bg: var(--default-badge-bg);
	--badge-text-color: var(--default-badge-text);
	--badge-border-color: var(--default-badge-border);
}
</style>
