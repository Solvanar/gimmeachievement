<script setup lang="ts">
import { computed, type Component } from 'vue';
import type { Achievement } from '@/types/achievement';
import DefaultDecor from '@/components/decor/DefaultDecor.vue';
import GamingDecor from '@/components/decor/GamingDecor.vue';
import RetroDecor from '@/components/decor/RetroDecor.vue';
import CozyDecor from '@/components/decor/CozyDecor.vue';
import ForestDecor from '@/components/decor/ForestDecor.vue';

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
	gaming: GamingDecor,
	retro: RetroDecor,
	cozy: CozyDecor,
	forest: ForestDecor,
};

const ThemeCard = computed(() => themeCardMap[achievement.theme] ?? DefaultDecor);
</script>

<template>
	<component
		:is="ThemeCard"
		:achievement="achievement"
		:size="size"
		:interactive="interactive"
	/>
</template>
