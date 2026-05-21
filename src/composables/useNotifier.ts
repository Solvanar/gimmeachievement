import { ref } from 'vue';

export type NotificationLevel = 'info' | 'success' | 'error';

export interface Notification {
	id: string;
	level: NotificationLevel;
	text: string;
}

const DEFAULT_TIMEOUT_MS = 4500;
const notifications = ref<Notification[]>([]);

function dismiss(id: string) {
	notifications.value = notifications.value.filter((n) => n.id !== id);
}

function notify(text: string, level: NotificationLevel = 'info') {
	const id = crypto.randomUUID();
	notifications.value.push({ id, level, text });

	window.setTimeout(() => dismiss(id), DEFAULT_TIMEOUT_MS);
}

export function useNotifier() {
	return {
		notifications,
		dismiss,
		notify,
		notifyInfo: (text: string) => notify(text, 'info'),
		notifySuccess: (text: string) => notify(text, 'success'),
		notifyError: (text: string) => notify(text, 'error'),
	};
}
