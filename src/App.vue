<script setup lang="ts">
import Header from '@/components/Header.vue';
import Notifier from '@/components/Notifier.vue';
import { useAchievementToast } from '@/composables/useAchievementToast';

const { toastAchievement, showToast } = useAchievementToast();
</script>

<template>
	<div class="app-shell">
		<Header />
		<main>
			<RouterView />
		</main>
		<Notifier />

		<Teleport to="body">
			<Transition name="xbox-toast">
				<div v-if="showToast && toastAchievement" class="xbox-toast">
					<div class="toast-inner">
						<div class="toast-left-bar" />
						<div class="toast-ring">
							<span class="toast-points">{{ toastAchievement.points }}</span>
							<div class="toast-scanner" />
						</div>
						<div class="toast-text">
							<div class="toast-label">
								<span>Достижение Разблокировано!</span>
								<span class="toast-sparkle">✦</span>
							</div>
							<h4 class="toast-title">{{ toastAchievement.title }}</h4>
							<p class="toast-sub">{{ toastAchievement.subtitle }} (+{{ toastAchievement.points }}G)</p>
						</div>
						<span class="toast-trophy">🏆</span>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<style scoped>
.app-shell {
	display: grid;
	grid-template-rows: auto 1fr;
	min-height: 100vh;
}

/* ── Xbox Toast ── */
.xbox-toast {
	position: fixed;
	bottom: 40px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 200;
	width: 100%;
	max-width: min(420px, calc(100vw - 32px));
	padding: 0 16px;
	pointer-events: none;
}

.toast-inner {
	background: rgba(9, 9, 11, 0.95);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 1px solid rgba(16, 185, 129, 0.4);
	border-radius: 999px;
	padding: 12px 16px 12px 12px;
	display: flex;
	align-items: center;
	gap: 14px;
	box-shadow:
		0 0 0 1px rgba(16, 185, 129, 0.1),
		0 8px 40px rgba(16, 185, 129, 0.2),
		0 20px 60px rgba(0, 0, 0, 0.5);
	position: relative;
	overflow: hidden;
}

.toast-left-bar {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 3px;
	background: #34d399;
	box-shadow: 0 0 8px #10b981;
	border-radius: 3px 0 0 3px;
}

.toast-ring {
	position: relative;
	width: 48px;
	height: 48px;
	flex-shrink: 0;
	background: #111;
	border-radius: 50%;
	border: 2px solid #10b981;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 14px rgba(16, 185, 129, 0.35);
	overflow: hidden;
}

.toast-points {
	font-family: monospace;
	font-size: 0.78rem;
	font-weight: 900;
	color: #10b981;
	position: relative;
	z-index: 1;
}

.toast-scanner {
	position: absolute;
	inset: -2px;
	border: 1px solid transparent;
	border-top-color: #10b981;
	border-radius: 50%;
	animation: toast-spin 1.2s linear infinite;
}

.toast-text {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.toast-label {
	display: flex;
	align-items: center;
	gap: 5px;
	font-family: monospace;
	font-size: 0.62rem;
	font-weight: 900;
	color: #10b981;
	text-transform: uppercase;
	letter-spacing: 0.1em;
}

.toast-sparkle {
	animation: pulse 1s ease infinite;
}

.toast-title {
	font-size: 0.88rem;
	font-weight: 700;
	color: #fff;
	margin: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.toast-sub {
	font-size: 0.7rem;
	color: rgba(255, 255, 255, 0.45);
	margin: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.toast-trophy {
	font-size: 1.4rem;
	flex-shrink: 0;
	animation: bounce 0.8s ease infinite alternate;
}

/* ── Toast transition ── */
.xbox-toast-enter-active {
	transition:
		opacity 0.3s ease,
		transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.xbox-toast-leave-active {
	transition:
		opacity 0.25s ease,
		transform 0.25s ease;
}

.xbox-toast-enter-from {
	opacity: 0;
	transform: translateX(-50%) translateY(32px);
}

.xbox-toast-leave-to {
	opacity: 0;
	transform: translateX(-50%) translateY(20px);
}

/* ── Animations ── */
@keyframes toast-spin {
	to {
		transform: rotate(360deg);
	}
}

@keyframes pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.4; }
}

@keyframes bounce {
	from { transform: translateY(0); }
	to { transform: translateY(-4px); }
}
</style>
