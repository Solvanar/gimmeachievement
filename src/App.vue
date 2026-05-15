<script setup lang="ts">
import { useColorSchemeStore } from '@/stores/colorScheme';

const colorScheme = useColorSchemeStore();
</script>

<template>
	<button
		class="theme-toggle"
		type="button"
		:aria-label="colorScheme.scheme === 'dark' ? 'Светлая тема' : 'Тёмная тема'"
		:title="colorScheme.scheme === 'dark' ? 'Светлая тема' : 'Тёмная тема'"
		@click="colorScheme.toggle"
	>
		<svg
			v-if="colorScheme.scheme === 'dark'"
			viewBox="0 0 24 24"
			width="18"
			height="18"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4.5" fill="currentColor" />
			<g
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				fill="none"
			>
				<line x1="12" y1="2.5" x2="12" y2="5" />
				<line x1="12" y1="19" x2="12" y2="21.5" />
				<line x1="2.5" y1="12" x2="5" y2="12" />
				<line x1="19" y1="12" x2="21.5" y2="12" />
				<line x1="5.2" y1="5.2" x2="6.9" y2="6.9" />
				<line x1="17.1" y1="17.1" x2="18.8" y2="18.8" />
				<line x1="5.2" y1="18.8" x2="6.9" y2="17.1" />
				<line x1="17.1" y1="6.9" x2="18.8" y2="5.2" />
			</g>
		</svg>
		<svg v-else viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<path
				d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"
				fill="currentColor"
			/>
		</svg>
	</button>

	<RouterView />
</template>

<style scoped>
.theme-toggle {
	position: fixed;
	top: 20px;
	right: 20px;
	z-index: 100;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	color: var(--text-primary);
	cursor: pointer;
	transition:
		border-color 0.15s,
		transform 0.15s,
		background 0.15s;
	backdrop-filter: blur(8px);
}

.theme-toggle:hover {
	border-color: var(--text-primary);
	transform: scale(1.06);
}
</style>
