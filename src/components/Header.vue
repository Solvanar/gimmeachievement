<script setup lang="ts">
import { computed, type Component } from 'vue';
import { useRoute } from 'vue-router';
import { useColorSchemeStore } from '@/stores/colorScheme';
import GridIcon from '@/assets/icons/grid.svg?component';
import BagIcon from '@/assets/icons/bag.svg?component';
import HelpCircleIcon from '@/assets/icons/help-circle.svg?component';
import SunIcon from '@/assets/icons/sun.svg?component';
import MoonIcon from '@/assets/icons/moon.svg?component';
import StarBrandIcon from '@/assets/icons/star-brand.svg?component';

const route = useRoute();
const { scheme, toggle } = useColorSchemeStore();

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

const isDark = computed(() => scheme === 'dark');
const toggleLabel = computed(() =>
	isDark.value ? 'Светлая тема' : 'Тёмная тема',
);
</script>

<template>
	<header class="topbar">
		<RouterLink to="/profile" class="brand">
			<div class="brand-mark">
				<StarBrandIcon class="brand-icon" aria-hidden="true" />
			</div>
			<span class="brand-name">Ачивки Из Жизни</span>
		</RouterLink>

		<nav class="topbar-nav" aria-label="Навигация">
			<RouterLink
				v-for="item in navItems"
				:key="item.to"
				:to="item.to"
				class="nav-link"
				:class="{ 'nav-link--active': isActive(item.to) }"
			>
				<component
					:is="navIconMap[item.icon]"
					class="nav-icon"
					aria-hidden="true"
				/>
				<span>{{ item.label }}</span>
				<span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
			</RouterLink>
		</nav>

		<div class="topbar-actions">
			<button
				class="action-btn"
				:title="toggleLabel"
				:aria-label="toggleLabel"
				@click="toggle"
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
	border-bottom: 1px solid var(--surface-elevated-border);
}

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

.brand-icon {
	width: 18px;
	height: 18px;
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

	.brand-name {
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
