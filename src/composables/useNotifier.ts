import { ref } from 'vue';

export type NotificationType = 'info' | 'success' | 'error';

export interface Notification {
	id: string;
	type: NotificationType;
	text: string;
}

const NOTIFICATION_TIMEOUT = 4500;
const notifications = ref<Notification[]>([]);

function notify(text: string, type: NotificationType = 'info') {
	const id = crypto.randomUUID();
	notifications.value.push({ id, type, text });

	window.setTimeout(() => dismiss(id), NOTIFICATION_TIMEOUT);
}

function dismiss(id: string) {
	notifications.value = notifications.value.filter(
		(notification) => notification.id !== id,
	);
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
