<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';

const emit = defineEmits<{
	close: [];
	submit: [code: string];
}>();

const code = ref('');

function close() {
	emit('close');
}

function submit() {
	const value = code.value.trim();
	if (!value) return;
	emit('submit', value);
}

function onBackdropClick(event: MouseEvent) {
	if (event.target === event.currentTarget) close();
}

function onKeydown(event: KeyboardEvent) {
	if (event.key === 'Escape') close();
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
	<Teleport to="body">
		<div
			class="modal-backdrop"
			role="dialog"
			aria-modal="true"
			aria-labelledby="add-achievement-title"
			@click="onBackdropClick"
		>
			<div class="modal-card">
				<Button
					variant="ghost"
					size="sm"
					icon-only
					class="close-btn"
					aria-label="Закрыть"
					@click="close"
				>
					<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
						<path
							d="M6 6 L18 18 M18 6 L6 18"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							fill="none"
						/>
					</svg>
				</Button>

				<h2 id="add-achievement-title">Зарегистрировать ачивку</h2>
				<p class="description">
					Введи код, указанный на купленной ачивке. После регистрации она
					появится в твоей коллекции.
				</p>

				<form class="form" @submit.prevent="submit">
					<Input
						v-model="code"
						label="Код ачивки"
						placeholder="ABCD-1234-EFGH"
						mask="XXXX-XXXX-XXXX"
						autocomplete="off"
						:spellcheck="false"
						hint="14 символов, дефисы расставятся сами"
					/>

					<div class="actions">
						<Button variant="outline" size="md" @click="close"> Отмена </Button>
						<Button
							variant="primary"
							size="md"
							type="submit"
							:disabled="!code.trim()"
						>
							Зарегистрировать
						</Button>
					</div>
				</form>
			</div>
		</div>
	</Teleport>
</template>

<style scoped>
.modal-backdrop {
	position: fixed;
	inset: 0;
	z-index: 200;
	background: rgba(0, 0, 0, 0.4);
	backdrop-filter: blur(6px);
	-webkit-backdrop-filter: blur(6px);
	display: grid;
	place-items: center;
	padding: 16px;
	animation: fade-in 0.18s ease-out;
}

.modal-card {
	position: relative;
	width: 100%;
	max-width: 440px;
	background: var(--page-bg);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 20px;
	padding: 28px 28px 24px;
	box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
	animation: slide-up 0.2s cubic-bezier(0.2, 0.7, 0.2, 1);
}

/* Button positions itself absolutely in the modal corner */
.close-btn {
	position: absolute;
	top: 12px;
	right: 12px;
}

h2 {
	margin: 0 0 8px;
	font-size: 1.25rem;
	font-weight: 700;
	color: var(--text-primary);
	letter-spacing: -0.01em;
}

.description {
	margin: 0 0 22px;
	color: var(--text-secondary);
	font-size: 0.88rem;
	line-height: 1.5;
}

.form {
	display: grid;
	grid-template-columns: 1fr;
	row-gap: 18px;
}

.actions {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	margin-top: 4px;
}

@keyframes fade-in {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
@keyframes slide-up {
	from {
		opacity: 0;
		transform: translateY(10px) scale(0.98);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}
</style>
