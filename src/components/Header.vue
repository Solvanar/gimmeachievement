<script setup lang="ts">
import { computed, type Component } from 'vue';
import { useRoute } from 'vue-router';
import { useColorSchemeStore } from '@/stores/colorScheme';
import GridIcon from '@/assets/icons/grid.svg?component';
import BagIcon from '@/assets/icons/bag.svg?component';
import HelpCircleIcon from '@/assets/icons/help-circle.svg?component';
import SunIcon from '@/assets/icons/sun.svg?component';
import MoonIcon from '@/assets/icons/moon.svg?component';

const route = useRoute();
const colorScheme = useColorSchemeStore();

type NavIconKey = 'grid' | 'bag' | 'help';

interface NavItem {
	to: string;
	label: string;
	icon: NavIconKey;
	badge?: string;
}

const navIconMap: Record<NavIconKey, Component> = {
	grid: GridIcon,
	bag: BagIcon,
	help: HelpCircleIcon,
};

const navItems: NavItem[] = [
	{ to: '/profile', label: 'Профиль', icon: 'grid' },
	{ to: '/shop', label: 'Купить', icon: 'bag', badge: 'NEW' },
	{ to: '/guide', label: 'Инструкция', icon: 'help' },
];

function isActive(path: string) {
	return route.path === path || (path === '/profile' && route.path === '/');
}

const isDark = computed(() => colorScheme.scheme === 'dark');
</script>

<template>
	<header class="topbar">
		<RouterLink to="/profile" class="brand">
			<div class="brand-mark">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
						fill="currentColor"
					/>
				</svg>
			</div>
			<span class="brand-name">Ачивки Из Жизни</span>
			<span class="brand-version">v1.2</span>
		</RouterLink>

		<nav class="topbar-nav" aria-label="Навигация">
			<RouterLink
				v-for="item in navItems"
				:key="item.to"
				:to="item.to"
				class="nav-link"
				:class="{ 'nav-link--active': isActive(item.to) }"
			>
				<component :is="navIconMap[item.icon]" class="nav-icon" aria-hidden="true" />
				<span>{{ item.label }}</span>
				<span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
			</RouterLink>
		</nav>

		<div class="topbar-actions">
			<button
				class="action-btn"
				:title="isDark ? 'Светлая тема' : 'Тёмная тема'"
				:aria-label="isDark ? 'Светлая тема' : 'Тёмная тема'"
				@click="colorScheme.toggle"
			>
				<SunIcon v-if="isDark" class="theme-icon" aria-hidden="true" />
				<MoonIcon v-else class="theme-icon" aria-hidden="true" />
			</button>

			<RouterLink to="/profile" class="avatar" aria-label="Профиль">
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
	gap: 16px;
	background: color-mix(in srgb, var(--page-bg) 85%, transparent);
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	border-bottom: 1px solid var(--surface-elevated-border);
}

/* ── Brand ── */
.brand {
	display: flex;
	align-items: center;
	gap: 8px;
	color: var(--text-primary);
	text-decoration: none;
	transition: opacity 0.15s;
	flex-shrink: 0;
}

.brand:hover {
	opacity: 0.8;
}

.brand-mark {
	width: 32px;
	height: 32px;
	border-radius: 10px;
	background: linear-gradient(135deg, #f59e0b, #f97316);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #1a1a00;
	box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
	flex-shrink: 0;
}

.brand-name {
	font-weight: 800;
	font-size: 0.9rem;
	letter-spacing: -0.01em;
	white-space: nowrap;
}

.brand-version {
	font-family: monospace;
	font-size: 0.62rem;
	color: var(--text-subtle);
	letter-spacing: 0.05em;
}

/* ── Navigation ── */
.topbar-nav {
	display: flex;
	align-items: center;
	gap: 2px;
	padding: 4px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 14px;
}

.nav-link {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 7px 12px;
	border-radius: 10px;
	font-size: 0.78rem;
	font-weight: 600;
	color: var(--text-muted);
	text-decoration: none;
	transition:
		background 0.15s ease,
		color 0.15s ease,
		border-color 0.15s ease;
	white-space: nowrap;
}

.nav-link:hover {
	color: var(--text-primary);
}

.nav-link--active {
	background: var(--page-bg);
	color: var(--text-primary);
	border: 1px solid var(--surface-elevated-border);
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.nav-icon {
	width: 14px;
	height: 14px;
	flex-shrink: 0;
}

.theme-icon {
	width: 18px;
	height: 18px;
}

.nav-badge {
	font-family: monospace;
	font-size: 7px;
	font-weight: 800;
	padding: 1px 4px;
	border-radius: 3px;
	background: rgba(245, 158, 11, 0.15);
	color: #f59e0b;
	letter-spacing: 0.03em;
}

/* ── Actions ── */
.topbar-actions {
	display: flex;
	align-items: center;
	gap: 8px;
	flex-shrink: 0;
}

.action-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 10px;
	color: var(--text-muted);
	cursor: pointer;
	transition:
		color 0.15s ease,
		border-color 0.15s ease,
		background 0.15s ease;
}

.action-btn:hover {
	color: var(--text-primary);
	border-color: var(--btn-border-hover);
}

.avatar {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: linear-gradient(135deg, #f59e0b, #f97316);
	color: #1a1a00;
	font-weight: 700;
	font-size: 0.85rem;
	text-decoration: none;
	cursor: pointer;
	border: 2px solid transparent;
	transition:
		box-shadow 0.15s ease,
		filter 0.15s ease;
}

.avatar:hover {
	filter: brightness(1.1);
	box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
}

@media (max-width: 768px) {
	.topbar {
		padding: 12px 16px;
	}

	.brand-name,
	.brand-version {
		display: none;
	}

	.topbar-nav {
		gap: 0;
	}

	.nav-link span:not(.nav-badge) {
		display: none;
	}

	.nav-link {
		padding: 8px;
	}
}
</style>
