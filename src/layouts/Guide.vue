<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const steps = [
	{
		num: '01',
		color: '#10b981',
		title: 'Выберите и закажите физический значок',
		text: 'Перейдите во вкладку «Купить Значки» и выберите достижение, которое отражает ваш недавний эпичный поступок или привычку. Оформите предзаказ — мы доставим вам значок или магнит в стильной и защищенной геймерской упаковке.',
	},
	{
		num: '02',
		color: '#818cf8',
		title: 'Считайте индивидуальный код активации',
		text: 'На обратной стороне каждого значка (либо на вложенном дизайнерском вкладыше) нанесен уникальный 8–12 значный символьный код. Он гарантирует оригинальность физического трофея и защищен от повторного использования.',
	},
	{
		num: '03',
		color: '#f59e0b',
		title: 'Регистрируйте на сайте и делитесь с миром!',
		text: 'Введите код у себя в личном профиле. Сайт мгновенно активирует ачивку с красивейшей анимацией и фирменным звуком трофея Xbox. Ваша страница этой ачивки поменяет тему на дизайн самого значка! Оставляйте свою историю получения, обменивайтесь хайпами с друзьями и коллекционируйте Геймерскор (G) из реальной жизни!',
	},
] as const;
</script>

<template>
	<div class="guide-page">
		<div class="guide-content">
			<!-- Header -->
			<div class="guide-header">
				<h1 class="guide-title">Как завести «Ачивку из Жизни»? 🔮</h1>
				<p class="guide-subtitle">
					Простейшая инструкция из трёх шагов по материализации цифровых наград
				</p>
			</div>

			<!-- Steps -->
			<div class="steps-list">
				<div
					v-for="step in steps"
					:key="step.num"
					class="step-card"
				>
					<span class="step-num" :style="{ color: step.color }">{{ step.num }}</span>
					<div class="step-body">
						<h3 class="step-title">{{ step.title }}</h3>
						<p class="step-text">{{ step.text }}</p>
					</div>
				</div>
			</div>

			<!-- CTA -->
			<div class="guide-cta">
				<p class="cta-text">
					Готовы протестировать прямо сейчас без покупки физического значка?
				</p>
				<button class="cta-btn" type="button" @click="router.push('/profile')">
					Перейти и разблокировать пробные значки!
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.guide-page {
	padding: 40px 24px 80px;
	display: flex;
	justify-content: center;
}

.guide-content {
	width: 100%;
	max-width: 680px;
	display: flex;
	flex-direction: column;
	gap: 32px;
}

/* ── Header ── */
.guide-header {
	text-align: center;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.guide-title {
	font-size: clamp(1.6rem, 4vw, 2.2rem);
	font-weight: var(--font-black);
	letter-spacing: var(--tracking-tight);
	color: var(--text-primary);
	margin: 0;
}

.guide-subtitle {
	font-size: var(--text-base);
	color: var(--text-muted);
	margin: 0;
	line-height: var(--leading-normal);
}

/* ── Steps ── */
.steps-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.step-card {
	display: flex;
	align-items: flex-start;
	gap: 20px;
	padding: 24px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 24px;
	box-shadow: var(--shadow-card);
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease;
}

.step-card:hover {
	border-color: var(--btn-border-hover);
	box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);
}

.step-num {
	font-family: var(--font-mono);
	font-size: 2.2rem;
	font-weight: var(--font-black);
	line-height: var(--leading-none);
	flex-shrink: 0;
	user-select: none;
}

.step-body {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.step-title {
	font-size: var(--text-md);
	font-weight: var(--font-bold);
	color: var(--text-primary);
	margin: 0;
}

.step-text {
	font-size: var(--text-sm);
	color: var(--text-muted);
	line-height: 1.65;
	margin: 0;
}

/* ── CTA ── */
.guide-cta {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 14px;
	padding: 24px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 24px;
	text-align: center;
}

.cta-text {
	font-size: var(--text-base);
	color: var(--text-muted);
	line-height: var(--leading-normal);
	margin: 0;
}

.cta-btn {
	padding: 10px 28px;
	background: rgba(99, 102, 241, 0.15);
	border: 1px solid rgba(99, 102, 241, 0.3);
	border-radius: 14px;
	color: #818cf8;
	font-weight: var(--font-extrabold);
	font-size: var(--text-sm);
	text-transform: uppercase;
	letter-spacing: var(--tracking-wide);
	cursor: pointer;
	transition:
		background 0.15s ease,
		border-color 0.15s ease,
		transform 0.1s ease;
}

.cta-btn:hover {
	background: rgba(99, 102, 241, 0.25);
	border-color: rgba(99, 102, 241, 0.5);
}

.cta-btn:active {
	transform: scale(0.97);
}

@media (max-width: 768px) {
	.guide-page {
		padding: 24px 16px 60px;
	}

	.step-num {
		font-size: var(--text-3xl);
	}
}
</style>
