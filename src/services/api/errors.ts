const MESSAGE_BY_STATUS: Record<number, string> = {
	0: 'Не удалось соединиться с сервером',
	400: 'Некорректный запрос',
	401: 'Требуется авторизация',
	403: 'Доступ запрещён',
	404: 'Не найдено',
	408: 'Сервер не ответил вовремя',
	409: 'Конфликт данных',
	422: 'Невалидные данные',
	429: 'Слишком много запросов',
	500: 'Внутренняя ошибка сервера',
	502: 'Сервер недоступен',
	503: 'Сервис временно недоступен',
	504: 'Сервер не ответил вовремя',
};

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
		this.name = 'ApiError';
	}
}

export function messageForStatus(status: number): string {
	const exact = MESSAGE_BY_STATUS[status];
	if (exact) return exact;

	if (status >= 500) return 'Ошибка сервера';

	if (status >= 400) return `Ошибка запроса (${status})`;

	return `Неизвестная ошибка (${status})`;
}
