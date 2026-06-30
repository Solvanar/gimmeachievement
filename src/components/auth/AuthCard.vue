<script setup lang="ts">
interface Props {
	title: string;
	subtitle?: string;
}

defineProps<Props>();
</script>

<template>
	<div class="auth-page">
		<div class="auth-card">
			<div class="auth-head">
				<h1 class="auth-title">{{ title }}</h1>
				<p v-if="subtitle" class="auth-subtitle">{{ subtitle }}</p>
			</div>

			<slot />

			<p v-if="$slots.footer" class="auth-switch">
				<slot name="footer" />
			</p>
		</div>
	</div>
</template>

<style scoped>
.auth-page {
	display: grid;
	place-items: center;
	min-height: 100vh;
	padding: 24px;
}

.auth-card {
	width: 100%;
	max-width: 400px;
	padding: 32px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 24px;
	box-shadow: var(--shadow-card);
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.auth-head {
	text-align: center;
}

.auth-title {
	font-size: var(--text-xl);
	font-weight: var(--font-extrabold);
	color: var(--text-primary);
	margin: 0 0 6px;
}

.auth-subtitle {
	font-size: var(--text-sm);
	color: var(--text-muted);
	margin: 0;
	line-height: var(--leading-snug);
}

.auth-switch {
	text-align: center;
	font-size: var(--text-sm);
	color: var(--text-muted);
	margin: 0;
}
</style>
