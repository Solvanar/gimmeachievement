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

const login = ref('');
const password = ref('');
const errorMsg = ref('');
const submitting = ref(false);

async function submit() {
	errorMsg.value = '';

	if (!login.value.trim() || !password.value) {
		errorMsg.value = 'Введите логин и пароль.';

		return;
	}

	submitting.value = true;

	try {
		await authStore.login(login.value.trim(), password.value);
		router.push('/profile');
	} catch (err) {
		errorMsg.value = err instanceof ApiError ? err.message : 'Не удалось войти.';
	} finally {
		submitting.value = false;
	}
}
</script>

<template>
	<AuthCard
		title="С возвращением"
		subtitle="Войдите, чтобы открыть свою коллекцию ачивок"
	>
		<form class="auth-form" @submit.prevent="submit">
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
				placeholder="••••••••"
				autocomplete="current-password"
			/>

			<p v-if="errorMsg" class="auth-error">{{ errorMsg }}</p>

			<UiButton type="submit" variant="primary" full-width :loading="submitting">
				Войти
			</UiButton>
		</form>

		<template #footer>
			Нет аккаунта?
			<RouterLink to="/register" class="auth-link">Зарегистрироваться</RouterLink>
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
