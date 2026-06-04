import { ref } from 'vue';
import type { AchievementComment } from '@/types/achievement';
import { useNotifier } from '@/composables/useNotifier';

type CommentsFetcher = () => Promise<AchievementComment[]>;
type CommentCreator = (text: string, replyToId?: string) => Promise<AchievementComment>;

export function useComments(fetcher: CommentsFetcher, creator: CommentCreator) {
	const comments = ref<AchievementComment[]>([]);
	const loading = ref(false);
	const submitting = ref(false);

	const { notifyError } = useNotifier();

	async function load() {
		loading.value = true;

		try {
			comments.value = await fetcher();
		} catch (err) {
			notifyError(err instanceof Error ? err.message : 'Не удалось загрузить комментарии');
		} finally {
			loading.value = false;
		}
	}

	async function add(text: string, replyToId?: string) {
		submitting.value = true;

		try {
			const created = await creator(text, replyToId);
			comments.value.push(created);
		} catch (err) {
			notifyError(err instanceof Error ? err.message : 'Не удалось отправить комментарий');
		} finally {
			submitting.value = false;
		}
	}

	return { comments, loading, submitting, load, add };
}
