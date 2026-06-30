// Мостик между request-слоем и приложением для случая «сессия умерла»
// (refresh-токен протух или отозван). request-слой не знает про Pinia и
// роутер, поэтому просто зовёт notifySessionExpired(), а обработчик
// (сброс юзера + редирект на логин) регистрируется выше — там, где есть
// доступ к стору и роутеру. Это разрывает циклический импорт.

type SessionExpiredHandler = () => void;

let handler: SessionExpiredHandler | null = null;

export function onSessionExpired(callback: SessionExpiredHandler): void {
	handler = callback;
}

export function notifySessionExpired(): void {
	handler?.();
}
