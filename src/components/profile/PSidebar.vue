<script setup lang="ts">
import RegisterCode from '@/components/RegisterCode.vue';
import BriefcaseIcon from '@/assets/icons/briefcase.svg?component';
</script>

<template>
	<div class="profile-sidebar">
		<RegisterCode />

		<div class="concept-card">
			<h4 class="concept-title">
				<BriefcaseIcon class="concept-icon" />
				Концепция Проекта
			</h4>
			<p>
				Я создаю реальные, стильные
				<strong>металлические значки и магниты</strong> в виде ачивок! У
				каждого значка геймерский дизайн и напечатанный индивидуальный код
				на обратной стороне.
			</p>
			<p>
				Зарегистрировав код тут, вы заводите цифровую карту ачивки, которая
				полностью меняет тему страницы под атмосферу самого значка!
			</p>
			<RouterLink to="/shop" class="shop-link">
				Посмотреть каталог &amp; заказать значки 🛒
			</RouterLink>
		</div>
	</div>
</template>

<style scoped>
.profile-sidebar {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

@media (min-width: 1024px) {
	.profile-sidebar {
		position: sticky;
		top: 80px;
	}
}

.concept-card {
	padding: 22px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 24px;
	box-shadow: var(--shadow-card);
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.concept-icon {
	width: 16px;
	height: 16px;
	flex-shrink: 0;
	color: #34d399;
}

.concept-title {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: var(--text-base);
	font-weight: var(--font-bold);
	color: var(--text-primary);
	margin: 0;
}

.concept-card p {
	font-size: var(--text-sm);
	color: var(--text-secondary);
	line-height: var(--leading-relaxed);
	margin: 0;
}

.shop-link {
	display: block;
	text-align: center;
	padding: 10px;
	background: rgba(2, 44, 22, 0.2);
	border: 1px solid rgba(16, 185, 129, 0.2);
	border-radius: 12px;
	color: #34d399;
	font-size: var(--text-sm);
	font-weight: var(--font-bold);
	text-decoration: none;
	transition:
		background 0.15s ease,
		border-color 0.15s ease;
}

.shop-link:hover {
	background: rgba(2, 44, 22, 0.35);
	border-color: rgba(16, 185, 129, 0.4);
}
</style>
