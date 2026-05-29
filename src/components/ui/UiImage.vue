<script setup lang="ts">
import { computed } from 'vue';

type ImageShape = 'circle' | 'rounded';

interface Props {
	src: string;
	alt: string;
	size?: number | 'full';
	shape?: ImageShape;
}

const { size, shape } = defineProps<Props>();

const sizeStyle = computed(() => {
	if (!size) return {};

	if (size === 'full') return { width: '100%', height: '100%' };

	return { width: `${size}px`, height: `${size}px` };
});
</script>

<template>
	<img
		:src="src"
		:alt="alt"
		referrerpolicy="no-referrer"
		class="ui-image"
		:class="shape ? `shape-${shape}` : undefined"
		:style="sizeStyle"
	/>
</template>

<style scoped>
.ui-image {
	object-fit: cover;
	display: block;
	flex-shrink: 0;
}

.shape-circle {
	border-radius: 50%;
}

.shape-rounded {
	border-radius: 20px;
}
</style>
