<script setup lang="ts">
import { useColorSchemeStore } from '@/stores/colorScheme';
import UiButton from '@/components/ui/UiButton.vue';

const colorScheme = useColorSchemeStore();
</script>

<template>
	<header class="topbar">
		<RouterLink to="/catalog" class="brand">
			<div class="brand-mark">✦</div>
			<span class="brand-name">gimmeachievement</span>
		</RouterLink>

		<div class="topbar-actions">
			<UiButton
				variant="outline"
				size="md"
				icon-only
				:aria-label="
					colorScheme.scheme === 'dark' ? 'Светлая тема' : 'Тёмная тема'
				"
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
				<svg
					v-else
					viewBox="0 0 24 24"
					width="18"
					height="18"
					aria-hidden="true"
				>
					<path
						d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"
						fill="currentColor"
					/>
				</svg>
			</UiButton>

			<RouterLink to="/profile" class="avatar" aria-label="Перейти в профиль">
				<span>Я</span>
			</RouterLink>
		</div>
	</header>
</template>

<style scoped>
.topbar {
	position: sticky;
	top: 0;
	z-index: 50;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 14px 28px;
	background: color-mix(in srgb, var(--page-bg) 80%, transparent);
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	border-bottom: 1px solid var(--surface-elevated-border);
}

.brand {
	display: flex;
	align-items: center;
	gap: 10px;
	color: var(--text-primary);
	text-decoration: none;
	font-weight: 600;
	font-size: 0.95rem;
	letter-spacing: -0.005em;
	transition: opacity 0.15s;
}
.brand:hover {
	opacity: 0.8;
}

.brand-mark {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background: radial-gradient(
		circle at 35% 30%,
		var(--btn-primary-text),
		var(--text-primary) 80%
	);
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--page-bg);
	font-size: 0.78rem;
}

.topbar-actions {
	display: flex;
	align-items: center;
	gap: 10px;
}

.avatar {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: linear-gradient(
		135deg,
		var(--btn-primary-text),
		var(--text-primary)
	);
	color: var(--page-bg);
	font-weight: 700;
	font-size: 0.85rem;
	text-decoration: none;
	cursor: pointer;
	transition:
		box-shadow 0.15s ease,
		filter 0.15s ease;
	border: 1px solid var(--surface-elevated-border);
}
.avatar:hover {
	filter: brightness(1.08);
	box-shadow: 0 4px 14px var(--shadow-card);
}

@media (max-width: 640px) {
	.topbar {
		padding: 12px 16px;
	}
	.brand-name {
		display: none;
	}
}
</style>
