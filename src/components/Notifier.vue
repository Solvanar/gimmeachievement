<script setup lang="ts">
import { useNotifier } from '@/composables/useNotifier';

const { notifications, dismiss } = useNotifier();
</script>

<template>
	<Teleport to="body">
		<div class="notifier-stack" aria-live="polite">
			<TransitionGroup name="notifier">
				<button
					v-for="n in notifications"
					:key="n.id"
					type="button"
					:class="['notifier', `level-${n.level}`]"
					:aria-label="`Закрыть: ${n.text}`"
					@click="dismiss(n.id)"
				>
					<span class="notifier-dot" />
					<span class="notifier-text">{{ n.text }}</span>
				</button>
			</TransitionGroup>
		</div>
	</Teleport>
</template>

<style scoped>
.notifier-stack {
	position: fixed;
	top: 76px;
	right: 20px;
	z-index: 150;
	display: flex;
	flex-direction: column;
	gap: 8px;
	max-width: min(380px, calc(100vw - 40px));
	pointer-events: none;
}

.notifier {
	pointer-events: auto;
	display: inline-flex;
	align-items: center;
	gap: 10px;
	padding: 10px 14px;
	background: var(--notifier-bg);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 12px;
	color: var(--text-primary);
	font-family: inherit;
	font-size: 0.85rem;
	line-height: 1.35;
	text-align: left;
	cursor: pointer;
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
	transition:
		filter 0.15s ease,
		transform 0.15s ease;
}

.notifier:hover {
	filter: brightness(1.05);
	transform: translateX(-2px);
}

.notifier-dot {
	flex-shrink: 0;
	width: 8px;
	height: 8px;
	border-radius: 50%;
}

.notifier-text {
	flex: 1;
}

.level-info {
	border-color: var(--notifier-info-border);
}
.level-info .notifier-dot {
	background: var(--btn-primary-text);
}

.level-success {
	border-color: var(--notifier-success-border);
}
.level-success .notifier-dot {
	background: var(--text-success);
}

.level-error {
	border-color: var(--notifier-error-border);
}
.level-error .notifier-dot {
	background: var(--text-error);
}

/* ── Transitions ── */
.notifier-enter-from {
	opacity: 0;
	transform: translateX(20px);
}
.notifier-leave-to {
	opacity: 0;
	transform: translateX(20px);
}
.notifier-enter-active,
.notifier-leave-active {
	transition:
		opacity 0.22s ease,
		transform 0.22s ease;
}
.notifier-move {
	transition: transform 0.22s ease;
}
</style>
