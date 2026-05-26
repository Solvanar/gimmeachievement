import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
	plugins: [vue(), svgLoader()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	test: {
		// Use Node environment for pure logic / service tests.
		// Switch to 'jsdom' when we start testing components.
		environment: 'node',
	},
});
