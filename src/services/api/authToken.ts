// Хранилище access-токена в localStorage.
// Так сессия доступна на всех вкладках и переживает перезапуск браузера
// (в пределах жизни токена). Читаем из LS напрямую, чтобы значение всегда
// было консистентным между вкладками без подписки на storage-события.
//
// Tradeoff: токен в LS доступен из JS, то есть уязвим к XSS. Долгоживущий
// refresh-токен живёт в HttpOnly-cookie и из JS недоступен.
//
// Отдельный модуль (а не Pinia-стор), чтобы request-слой не зависел от стора
// и не создавал циклический импорт.

const STORAGE_KEY = 'gimme_access_token';

export function getAccessToken(): string | null {
	try {
		return localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
}

export function setAccessToken(token: string | null): void {
	try {
		if (token) {
			localStorage.setItem(STORAGE_KEY, token);
		} else {
			localStorage.removeItem(STORAGE_KEY);
		}
	} catch {
		// localStorage может быть недоступен (приватный режим) — молча игнорируем
	}
}
