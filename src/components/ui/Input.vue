<script setup lang="ts">
import { computed, ref, useId } from 'vue';

type Size = 'sm' | 'md' | 'lg';
type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

interface Props {
	modelValue?: string;
	label?: string;
	type?: InputType;
	placeholder?: string;
	size?: Size;
	disabled?: boolean;
	hint?: string;
	error?: string;
	autocomplete?: string;
	spellcheck?: boolean;
	/**
	 * Simple mask: any 'X' is replaced with an alphanumeric char from input,
	 * any other character is treated as a literal separator.
	 * Example: 'XXXX-XXXX-XXXX' → 'ABCD-1234-EFGH'
	 */
	mask?: string;
}

const {
	modelValue = '',
	label,
	type = 'text',
	placeholder,
	size = 'md',
	disabled = false,
	hint,
	error,
	autocomplete,
	mask,
} = defineProps<Props>();

const emit = defineEmits<{
	'update:modelValue': [value: string];
}>();

const showPassword = ref(false);
const fieldId = useId();

const effectiveType = computed(() => {
	if (type === 'password') return showPassword.value ? 'text' : 'password';
	return type;
});

function applyMask(rawText: string, pattern: string): string {
	const cleanChars = rawText.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
	let result = '';
	let cleanIndex = 0;
	for (let i = 0; i < pattern.length && cleanIndex < cleanChars.length; i++) {
		if (pattern[i] === 'X') {
			result += cleanChars[cleanIndex++];
		} else {
			result += pattern[i];
		}
	}
	return result;
}

function onInput(event: Event) {
	const target = event.target as HTMLInputElement;
	const rawText = target.value;
	const formatted = mask ? applyMask(rawText, mask) : rawText;
	emit('update:modelValue', formatted);
	if (mask && formatted !== rawText) {
		target.value = formatted;
	}
}
</script>

<template>
	<div
		class="ui-field"
		:class="[`size-${size}`, { 'has-error': !!error, 'is-disabled': disabled }]"
	>
		<label v-if="label" :for="fieldId" class="field-label">{{ label }}</label>

		<div class="field-input-wrap">
			<input
				:id="fieldId"
				:value="modelValue"
				:type="effectiveType"
				:placeholder="placeholder"
				:disabled="disabled"
				:autocomplete="autocomplete"
				class="field-input"
				:class="{ 'has-trailing': type === 'password' }"
				@input="onInput"
			/>

			<button
				v-if="type === 'password'"
				type="button"
				class="trailing-btn"
				:aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
				@click="showPassword = !showPassword"
			>
				<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
					<path
						v-if="showPassword"
						d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M3 3l18 18"
						stroke="currentColor"
						stroke-width="1.6"
						fill="none"
						stroke-linecap="round"
					/>
					<path
						v-else
						d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
						stroke="currentColor"
						stroke-width="1.6"
						fill="none"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>

		<p v-if="error" class="field-message error">{{ error }}</p>
		<p v-else-if="hint" class="field-message">{{ hint }}</p>
	</div>
</template>

<style scoped>
.ui-field {
	display: grid;
	grid-template-columns: 1fr;
	row-gap: 6px;
}

.field-label {
	font-size: 0.7rem;
	font-weight: 600;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: var(--text-muted);
}

.field-input-wrap {
	position: relative;
}

.field-input {
	width: 100%;
	background: var(--input-bg);
	border: 1px solid var(--input-border);
	border-radius: 10px;
	color: var(--text-primary);
	font-family: inherit;
	transition:
		border-color 0.15s ease,
		box-shadow 0.15s ease;
}

.size-sm .field-input {
	padding: 7px 12px;
	font-size: 0.82rem;
}
.size-md .field-input {
	padding: 11px 14px;
	font-size: 0.95rem;
}
.size-lg .field-input {
	padding: 13px 16px;
	font-size: 1.05rem;
}

.field-input.has-trailing {
	padding-right: 38px;
}

.field-input::placeholder {
	color: var(--text-subtle);
}
.field-input:focus {
	outline: none;
	border-color: var(--input-border-focus);
	box-shadow: 0 0 0 3px var(--btn-primary-bg-hover);
}
.field-input:disabled {
	opacity: 0.55;
	cursor: not-allowed;
}

.has-error .field-input {
	border-color: var(--text-error);
}
.has-error .field-input:focus {
	box-shadow: 0 0 0 3px color-mix(in srgb, var(--text-error) 18%, transparent);
}

.trailing-btn {
	position: absolute;
	right: 8px;
	top: 50%;
	transform: translateY(-50%);
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	background: transparent;
	border: none;
	border-radius: 6px;
	color: var(--text-muted);
	cursor: pointer;
	transition:
		color 0.15s,
		background 0.15s;
}
.trailing-btn:hover {
	color: var(--text-primary);
	background: var(--surface-elevated-border);
}

.field-message {
	margin: 0;
	font-size: 0.75rem;
	color: var(--text-muted);
	line-height: 1.4;
}
.field-message.error {
	color: var(--text-error);
}
</style>
