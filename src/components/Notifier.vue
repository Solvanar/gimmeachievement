<script setup lang="ts">
import { useNotifier } from '@/composables/useNotifier';

const { notifications, dismiss } = useNotifier();
</script>

<template>
	<Teleport to="body">
		<div class="notifier-list" aria-live="polite">
			<TransitionGroup name="notifier">
				<div
					v-for="notification in notifications"
					:key="notification.id"
					:class="['notifier', `type-${notification.type}`]"
				>
					<span class="notifier-dot" />
					<span class="notifier-text">{{ notification.text }}</span>
					<button
						class="notifier-close"
						:aria-label="`Закрыть: ${notification.text}`"
						@click="dismiss(notification.id)"
					>
						✕
					</button>
				</div>
			</TransitionGroup>
		</div>
	</Teleport>
</template>

<style scoped>
.notifier-list {
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
	font-size: 0.85rem;
	line-height: 1.35;
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
}

.notifier-close {
	flex-shrink: 0;
	background: none;
	border: none;
	color: var(--text-muted);
	font-size: 0.75rem;
	cursor: pointer;
	padding: 0 0 0 4px;
	line-height: 1;
	transition: color 0.15s ease;
}

.notifier-close:hover {
	color: var(--text-primary);
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

.type-info {
	border-color: var(--notifier-info-border);
}
.type-info .notifier-dot {
	background: var(--btn-primary-text);
}

.type-success {
	border-color: var(--notifier-success-border);
}
.type-success .notifier-dot {
	background: var(--text-success);
}

.type-error {
	border-color: var(--notifier-error-border);
}
.type-error .notifier-dot {
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
