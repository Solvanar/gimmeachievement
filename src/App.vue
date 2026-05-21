<script setup lang="ts">
import Header from '@/components/Header.vue';
import Notifier from '@/components/Notifier.vue';
</script>

<template>
	<div class="app-shell">
		<Header />
		<main>
			<RouterView />
		</main>
		<Notifier />
	</div>
</template>

<style scoped>
.app-shell {
	display: grid;
	grid-template-rows: auto 1fr;
	min-height: 100vh;
}
</style>
