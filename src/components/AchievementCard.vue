<script setup lang="ts">
import { computed, type Component } from 'vue';
import type { Achievement } from '@/types/achievement';
import BaseDecor from './decor/BaseDecor.vue';
import CyberDecor from './decor/CyberDecor.vue';
import RetroDecor from './decor/RetroDecor.vue';
import CozyDecor from './decor/CozyDecor.vue';
import ForestDecor from './decor/ForestDecor.vue';

interface Props {
	achievement: Achievement;
	size?: 'normal' | 'large';
	interactive?: boolean;
}

const {
	achievement,
	size = 'normal',
	interactive = true,
} = defineProps<Props>();

const themeCardMap: Record<string, Component> = {
	cyber: CyberDecor,
	retro: RetroDecor,
	cozy: CozyDecor,
	forest: ForestDecor,
};

const ThemeCard = computed(() => themeCardMap[achievement.theme] ?? BaseDecor);
</script>

<template>
	<component
		:is="ThemeCard"
		:achievement="achievement"
		:size="size"
		:interactive="interactive"
	/>
</template>
