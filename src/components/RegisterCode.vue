<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAchievementsStore } from '@/stores/achievements';
import { useAchievementToast } from '@/composables/useAchievementToast';
import type { Achievement } from '@/types/achievement';
import KeyIcon from '@/assets/icons/key.svg?component';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg?component';
import AlertCircleIcon from '@/assets/icons/alert-circle.svg?component';
import CheckCircleIcon from '@/assets/icons/check-circle.svg?component';

const store = useAchievementsStore();
const { triggerToast } = useAchievementToast();

const code = ref('');
const errorMsg = ref('');
const successMsg = ref('');

const lockedAchievements = computed(() =>
	store.achievements.filter((achievement) => !achievement.unlocked),
);

function submit(event: Event) {
	event.preventDefault();
	errorMsg.value = '';
	successMsg.value = '';

	const formatted = code.value.trim().toUpperCase();
	if (!formatted) {
		errorMsg.value = 'Пожалуйста, введите код достижения.';
		return;
	}

	const target = store.achievements.find(
		(achievement) => (achievement.code ?? '').toUpperCase() === formatted,
	);

	if (!target) {
		errorMsg.value =
			'Код не найден! Проверьте символы или нажмите на один из кодов снизу.';
		return;
	}

	if (target.unlocked) {
		errorMsg.value = `Ачивка «${target.title}» уже была разблокирована ранее!`;
		return;
	}

	store.unlockAchievement(target.id);
	successMsg.value = `Поздравляем! «${target.title}» добавлена в профиль!`;
	triggerToast(target as Achievement);
	code.value = '';
}

function copySuggestion(suggestedCode: string) {
	code.value = suggestedCode;
	errorMsg.value = '';
	successMsg.value = '';
}
</script>

<template>
	<div class="register-code">
		<div class="rc-header">
			<div class="rc-icon">
				<KeyIcon class="rc-header-icon" />
			</div>
			<div>
				<h3 class="rc-title">Регистрация Значка</h3>
				<p class="rc-subtitle">
					Купили значок или магнит? Введите код с вкладыша!
				</p>
			</div>
		</div>

		<form class="rc-form" @submit="submit">
			<div class="rc-input-row">
				<input
					v-model="code"
					type="text"
					class="rc-input"
					placeholder="КОД-АЧИВКИ-123"
					autocomplete="off"
					:spellcheck="false"
					@input="errorMsg = ''"
				/>
				<button type="submit" class="rc-submit">
					<ArrowRightIcon class="rc-submit-icon" />
					<span>Активировать!</span>
				</button>
			</div>

			<Transition name="msg">
				<div v-if="errorMsg" class="rc-msg rc-msg--error">
					<AlertCircleIcon class="rc-msg-icon" />
					{{ errorMsg }}
				</div>
				<div v-else-if="successMsg" class="rc-msg rc-msg--success">
					<CheckCircleIcon class="rc-msg-icon" />
					{{ successMsg }}
				</div>
			</Transition>
		</form>

		<div class="rc-suggestions">
			<span class="rc-suggestions-label">КОДЫ ДЛЯ ТЕСТИРОВАНИЯ (клик для ввода):</span>
			<p v-if="lockedAchievements.length === 0" class="all-unlocked">
				✔ Вы разблокировали все доступные ачивки!
			</p>
			<div v-else class="rc-chips">
				<button
					v-for="ach in lockedAchievements"
					:key="ach.id"
					type="button"
					class="rc-chip"
					@click="copySuggestion(ach.code ?? '')"
				>
					<span>{{ ach.title }}</span>
					<code>{{ ach.code }}</code>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.register-code {
	padding: 24px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 24px;
	box-shadow: var(--shadow-card);
	display: flex;
	flex-direction: column;
	gap: 20px;
	transition:
		background 0.3s ease,
		border-color 0.3s ease;
}

.rc-header {
	display: flex;
	align-items: flex-start;
	gap: 12px;
}

.rc-icon {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 38px;
	height: 38px;
	background: rgba(245, 158, 11, 0.1);
	border: 1px solid rgba(245, 158, 11, 0.2);
	border-radius: 12px;
	color: #f59e0b;
}

.rc-title {
	font-size: 0.95rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 2px;
}

.rc-subtitle {
	font-size: 0.78rem;
	color: var(--text-muted);
	margin: 0;
	line-height: 1.4;
}

.rc-form {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.rc-input-row {
	display: flex;
	gap: 8px;
}

.rc-input {
	flex-grow: 1;
	padding: 12px 16px;
	background: var(--input-bg);
	border: 1px solid var(--input-border);
	border-radius: 12px;
	color: var(--text-primary);
	font-family: monospace;
	font-size: 0.85rem;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	transition: border-color 0.15s ease;
}

.rc-input::placeholder {
	color: var(--text-subtle);
	text-transform: uppercase;
}

.rc-input:focus {
	outline: none;
	border-color: rgba(245, 158, 11, 0.5);
	box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.rc-submit {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 12px 16px;
	background: linear-gradient(135deg, #f59e0b, #f97316);
	border: none;
	border-radius: 12px;
	color: #1a1a00;
	font-weight: 800;
	font-size: 0.78rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	cursor: pointer;
	white-space: nowrap;
	transition: filter 0.15s ease, transform 0.1s ease;
	flex-shrink: 0;
}

.rc-submit:hover {
	filter: brightness(1.1);
}

.rc-submit:active {
	transform: scale(0.97);
}

.rc-msg {
	display: flex;
	align-items: flex-start;
	gap: 8px;
	padding: 10px 14px;
	border-radius: 12px;
	font-size: 0.8rem;
	font-weight: 500;
	line-height: 1.4;
}

.rc-msg--error {
	background: rgba(127, 29, 29, 0.3);
	border: 1px solid rgba(239, 68, 68, 0.3);
	color: #fca5a5;
}

.rc-msg--success {
	background: rgba(6, 78, 59, 0.3);
	border: 1px solid rgba(16, 185, 129, 0.3);
	color: #6ee7b7;
}

.rc-header-icon {
	width: 20px;
	height: 20px;
}

.rc-submit-icon {
	width: 16px;
	height: 16px;
}

.rc-msg-icon {
	flex-shrink: 0;
	width: 16px;
	height: 16px;
	margin-top: 1px;
}

.rc-suggestions {
	padding-top: 16px;
	border-top: 1px solid var(--surface-elevated-border);
}

.rc-suggestions-label {
	display: block;
	font-family: monospace;
	font-size: 0.65rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	color: var(--text-muted);
	margin-bottom: 10px;
}

.all-unlocked {
	font-family: monospace;
	font-size: 0.8rem;
	color: #4cd964;
	font-style: italic;
	margin: 0;
}

.rc-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
}

.rc-chip {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 5px 8px;
	background: var(--input-bg);
	border: 1px solid var(--input-border);
	border-radius: 8px;
	cursor: pointer;
	transition:
		background 0.15s ease,
		border-color 0.15s ease,
		color 0.15s ease;
}

.rc-chip:hover {
	border-color: rgba(245, 158, 11, 0.4);
	background: rgba(245, 158, 11, 0.08);
}

.rc-chip span {
	font-size: 0.72rem;
	color: var(--text-secondary);
}

.rc-chip code {
	font-family: monospace;
	font-size: 0.68rem;
	font-weight: 700;
	padding: 1px 5px;
	background: rgba(245, 158, 11, 0.1);
	color: #f59e0b;
	border-radius: 4px;
}

/* ── Transition ── */
.msg-enter-active,
.msg-leave-active {
	transition: all 0.2s ease;
}
.msg-enter-from,
.msg-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}
</style>
