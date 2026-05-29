import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'gimme-color-scheme';

function readInitial(): ColorScheme {
	const stored = localStorage.getItem(STORAGE_KEY);

	if (stored === 'light' || stored === 'dark') {
		return stored;
	}

	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyScheme(value: ColorScheme) {
	document.documentElement.dataset.theme = value;
	localStorage.setItem(STORAGE_KEY, value);
}

export const useColorSchemeStore = defineStore('colorScheme', () => {
	const scheme = ref<ColorScheme>(readInitial());
	applyScheme(scheme.value);

	function toggle() {
		scheme.value = scheme.value === 'dark' ? 'light' : 'dark';
		applyScheme(scheme.value);
	}

	return { scheme, toggle };
});
