<script setup lang="ts">
type Size = 'sm' | 'md' | 'lg';
type Variant = 'primary' | 'outline' | 'ghost' | 'danger';

interface Props {
	variant?: Variant;
	size?: Size;
	disabled?: boolean;
	loading?: boolean;
	type?: 'button' | 'submit' | 'reset';
	fullWidth?: boolean;
	iconOnly?: boolean;
}

const {
	variant = 'primary',
	size = 'md',
	disabled = false,
	loading = false,
	type = 'button',
	fullWidth = false,
	iconOnly = false,
} = defineProps<Props>();
</script>

<template>
	<button
		:type="type"
		:disabled="disabled || loading"
		class="ui-btn"
		:class="[
			`variant-${variant}`,
			`size-${size}`,
			{
				'full-width': fullWidth,
				'is-loading': loading,
				'icon-only': iconOnly,
			},
		]"
	>
		<span v-if="$slots.prefix" class="slot-prefix"><slot name="prefix" /></span>
		<span class="slot-default"><slot /></span>
		<span v-if="$slots.suffix" class="slot-suffix"><slot name="suffix" /></span>
		<span v-if="loading" class="spinner" aria-hidden="true" />
	</button>
</template>

<style scoped>
.ui-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	font-family: inherit;
	font-weight: 500;
	border-radius: 999px;
	border: 1px solid transparent;
	cursor: pointer;
	transition:
		background 0.15s ease,
		border-color 0.15s ease,
		color 0.15s ease,
		filter 0.15s ease,
		box-shadow 0.15s ease,
		opacity 0.15s ease;
	position: relative;
}

.ui-btn:disabled {
	opacity: 0.45;
	cursor: not-allowed;
}

.ui-btn.is-loading .slot-default,
.ui-btn.is-loading .slot-prefix,
.ui-btn.is-loading .slot-suffix {
	visibility: hidden;
}

/* ── Sizes ── */
.size-sm {
	padding: 6px 14px;
	font-size: 0.78rem;
}
.size-md {
	padding: 9px 16px;
	font-size: 0.85rem;
}
.size-lg {
	padding: 12px 22px;
	font-size: 0.95rem;
}

/* ── Styles ── */
.variant-primary {
	background: var(--text-primary);
	color: var(--page-bg);
	border-color: var(--text-primary);
}
.variant-primary:hover:not(:disabled) {
	filter: brightness(1.1);
	box-shadow: 0 6px 18px var(--shadow-card);
}

.variant-outline {
	background: transparent;
	border-color: var(--btn-border);
	color: var(--btn-text);
}
.variant-outline:hover:not(:disabled) {
	border-color: var(--btn-border-hover);
	color: var(--btn-text-hover);
}

.variant-ghost {
	background: transparent;
	border-color: transparent;
	color: var(--text-secondary);
}
.variant-ghost:hover:not(:disabled) {
	background: var(--surface-elevated);
	color: var(--text-primary);
}

.variant-danger {
	background: transparent;
	border-color: var(--btn-danger-border);
	color: var(--btn-danger-text);
}
.variant-danger:hover:not(:disabled) {
	background: color-mix(in srgb, var(--btn-danger-text) 12%, transparent);
}

.full-width {
	width: 100%;
}

/* ── Icon-only (round/square) ── */
.icon-only {
	padding: 0;
	aspect-ratio: 1;
	gap: 0;
}
.icon-only.size-sm {
	width: 28px;
}
.icon-only.size-md {
	width: 36px;
}
.icon-only.size-lg {
	width: 44px;
}

/* ── Spinner ── */
.spinner {
	position: absolute;
	width: 14px;
	height: 14px;
	border: 2px solid currentColor;
	border-right-color: transparent;
	border-radius: 50%;
	animation: spin 0.7s linear infinite;
}
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
