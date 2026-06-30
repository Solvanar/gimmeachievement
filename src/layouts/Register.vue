<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ApiError } from '@/services/api';
import AuthCard from '@/components/auth/AuthCard.vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiButton from '@/components/ui/UiButton.vue';

const router = useRouter();
const authStore = useAuthStore();

const displayName = ref('');
const login = ref('');
const password = ref('');
const errorMsg = ref('');
const submitting = ref(false);

async function submit() {
	errorMsg.value = '';

	if (!displayName.value.trim() || !login.value.trim() || !password.value) {
		errorMsg.value = 'Заполните все поля.';

		return;
	}

	if (password.value.length < 6) {
		errorMsg.value = 'Пароль должен быть не короче 6 символов.';

		return;
	}

	submitting.value = true;

	try {
		await authStore.register(login.value.trim(), password.value, displayName.value.trim());
		router.push('/profile');
	} catch (err) {
		errorMsg.value =
			err instanceof ApiError ? err.message : 'Не удалось зарегистрироваться.';
	} finally {
		submitting.value = false;
	}
}
</script>

<template>
	<AuthCard
		title="Создать аккаунт"
		subtitle="Начните собирать свою коллекцию ачивок"
	>
		<form class="auth-form" @submit.prevent="submit">
			<UiInput v-model="displayName" label="Отображаемое имя" placeholder="Julia" />
			<UiInput
				v-model="login"
				label="Логин"
				placeholder="julia"
				autocomplete="username"
				:spellcheck="false"
			/>
			<UiInput
				v-model="password"
				label="Пароль"
				type="password"
				placeholder="Минимум 6 символов"
				autocomplete="new-password"
			/>

			<p v-if="errorMsg" class="auth-error">{{ errorMsg }}</p>

			<UiButton type="submit" variant="primary" full-width :loading="submitting">
				Зарегистрироваться
			</UiButton>
		</form>

		<template #footer>
			Уже есть аккаунт?
			<RouterLink to="/login" class="auth-link">Войти</RouterLink>
		</template>
	</AuthCard>
</template>

<style scoped>
.auth-form {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.auth-error {
	margin: 0;
	font-size: var(--text-sm);
	color: var(--text-error);
	line-height: var(--leading-snug);
}

.auth-link {
	color: var(--text-primary);
	font-weight: var(--font-semibold);
	text-decoration: none;
}

.auth-link:hover {
	text-decoration: underline;
}
</style>
