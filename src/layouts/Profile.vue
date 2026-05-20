<script setup lang="ts"></script>

<template>
	<div class="profile-page">
		<h1>Профиль</h1>
		<p>
			Скоро здесь будет твой профиль — статистика, любимые ачивки и история
			получения.
		</p>
	</div>
</template>

<style scoped>
.profile-page {
	max-width: 1280px;
	margin: 0 auto;
	padding: 56px 24px 80px;
}

h1 {
	font-size: clamp(1.8rem, 4vw, 2.4rem);
	font-weight: 800;
	letter-spacing: -0.02em;
	margin: 0 0 12px;
	background: linear-gradient(
		135deg,
		var(--hero-text-from) 0%,
		var(--hero-text-to) 100%
	);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

p {
	color: var(--text-secondary);
	line-height: 1.7;
	max-width: 52ch;
}
</style>
