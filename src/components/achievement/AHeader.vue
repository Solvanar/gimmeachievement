<script setup lang="ts">
import { useRouter } from 'vue-router';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';

const router = useRouter();
</script>

<template>
	<header class="detail-header">
		<button class="back-btn" @click="router.push('/profile')">
			<ArrowLeftIcon class="back-icon" />
			Назад к Профилю
		</button>
	</header>
</template>

<style scoped>
.detail-header {
	position: relative;
	max-width: 1000px;
	margin: 0 auto;
	padding: 24px 24px 16px;
	z-index: 20;
}

.back-icon {
	width: 16px;
	height: 16px;
	flex-shrink: 0;
}

.back-btn {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 8px 16px;
	background: rgba(23, 23, 23, 0.6);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 12px;
	color: #9ca3af;
	font-size: var(--text-base);
	cursor: pointer;
	backdrop-filter: blur(8px);
	transition:
		color 0.15s ease,
		border-color 0.15s ease;
}

.back-btn:hover {
	color: #ffffff;
	border-color: rgba(255, 255, 255, 0.2);
}
</style>
