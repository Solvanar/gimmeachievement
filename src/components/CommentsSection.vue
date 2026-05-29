<script setup lang="ts">
import { ref } from 'vue';
import type { AchievementComment } from '@/types/achievement';
import UiImage from '@/components/ui/UiImage.vue';
import MessageIcon from '@/assets/icons/message.svg?component';
import SendIcon from '@/assets/icons/send.svg?component';

const props = defineProps<{
	comments: AchievementComment[];
	accentColor?: string;
	themeType?: string;
}>();

const emit = defineEmits<{ addComment: [text: string] }>();

const newComment = ref('');
const isRetro = () => props.themeType === 'retro';

function submit(event: Event) {
	event.preventDefault();
	if (!newComment.value.trim()) return;
	emit('addComment', newComment.value.trim());
	newComment.value = '';
}
</script>

<template>
	<div class="comments-section" :class="{ 'is-retro': isRetro() }">
		<div class="comments-header">
			<MessageIcon class="comments-icon" :style="{ color: accentColor ?? '#10b981' }" />
			<h4>
				{{ isRetro() ? 'ЛОГ АКТИВНОСТИ' : 'Лог активности &amp; обсуждение' }}
				({{ comments.length }})
			</h4>
		</div>

		<form class="comment-form" @submit="submit">
			<input
				v-model="newComment"
				type="text"
				class="comment-input"
				:placeholder="isRetro() ? 'ВВЕДИТЕ СООБЩЕНИЕ...' : 'Напишите что-то об этой ачивке...'"
			/>
			<button
				type="submit"
				class="comment-submit"
				:style="{ backgroundColor: accentColor ?? '#10b981' }"
			>
				<SendIcon class="submit-icon" />
				<span class="submit-label">{{ isRetro() ? 'КЛИК' : 'Отправить' }}</span>
			</button>
		</form>

		<div class="comments-list">
			<p v-if="comments.length === 0" class="comments-empty">
				Никто ещё не комментировал это достижение. Будь первым!
			</p>
			<div
				v-for="comment in comments"
				:key="comment.id"
				class="comment-item"
				:class="{ 'is-retro-item': isRetro() }"
			>
				<UiImage
					:src="comment.avatar"
					:alt="comment.author"
					:size="36"
					shape="circle"
					:class="{ 'retro-avatar': isRetro() }"
				/>
				<div class="comment-body">
					<div class="comment-meta">
						<span class="comment-author">{{ comment.author }}</span>
						<span class="comment-time">{{ comment.timestamp }}</span>
					</div>
					<p class="comment-text">{{ comment.text }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.comments-icon {
	width: 20px;
	height: 20px;
	flex-shrink: 0;
}

.submit-icon {
	width: 16px;
	height: 16px;
}

.comments-section {
	margin-top: 32px;
	padding: 24px;
	border-radius: 16px;
	border: 1px solid rgba(255, 255, 255, 0.08);
	background: rgba(24, 24, 24, 0.8);
}

.comments-section.is-retro {
	background: #09090b;
	border-color: rgba(99, 102, 241, 0.3);
	font-family: monospace;
}

.comments-header {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 24px;
}

.comments-header h4 {
	font-size: 0.95rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0;
}

.is-retro .comments-header h4 {
	text-transform: uppercase;
	color: #fbbf24;
}

.comment-form {
	display: flex;
	gap: 12px;
	margin-bottom: 24px;
}

.comment-input {
	flex-grow: 1;
	padding: 10px 16px;
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 12px;
	color: var(--text-primary);
	font-family: inherit;
	font-size: 0.9rem;
	transition: border-color 0.15s ease;
}

.comment-input::placeholder {
	color: var(--text-subtle);
}

.comment-input:focus {
	outline: none;
	border-color: rgba(255, 255, 255, 0.3);
}

.is-retro .comment-input {
	border-color: rgba(99, 102, 241, 0.4);
	color: #fef3c7;
	font-family: monospace;
}

.comment-submit {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 10px 16px;
	border: none;
	border-radius: 12px;
	color: #ffffff;
	font-weight: 600;
	font-size: 0.85rem;
	cursor: pointer;
	transition: filter 0.15s ease, transform 0.1s ease;
	white-space: nowrap;
}

.comment-submit:hover {
	filter: brightness(1.15);
}

.comment-submit:active {
	transform: scale(0.97);
}

.submit-label {
	display: none;
}

@media (min-width: 640px) {
	.submit-label {
		display: inline;
	}
}

.comments-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
	max-height: 24rem;
	overflow-y: auto;
	padding-right: 4px;
}

.comments-list::-webkit-scrollbar {
	width: 4px;
}
.comments-list::-webkit-scrollbar-track {
	background: transparent;
}
.comments-list::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 99px;
}

.comments-empty {
	color: var(--text-muted);
	text-align: center;
	padding: 24px 0;
	font-style: italic;
	font-size: 0.9rem;
}

.comment-item {
	display: flex;
	gap: 12px;
	padding: 16px;
	border-radius: 12px;
	background: rgba(37, 37, 37, 1);
	transition: background 0.15s ease;
}

.comment-item:hover {
	background: rgba(45, 45, 45, 1);
}

.comment-item.is-retro-item {
	border-left: 2px solid #818cf8;
	background: rgba(23, 23, 27, 0.4);
}

.retro-avatar {
	border-radius: 2px !important;
	border: 1px solid #818cf8;
}

.comment-body {
	flex-grow: 1;
	min-width: 0;
}

.comment-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	margin-bottom: 4px;
}

.comment-author {
	font-weight: 700;
	font-size: 0.78rem;
	color: #e5e7eb;
}

.is-retro-item .comment-author {
	color: #a5b4fc;
}

.comment-time {
	font-size: 0.7rem;
	color: var(--text-muted);
	white-space: nowrap;
}

.comment-text {
	font-size: 0.85rem;
	line-height: 1.5;
	color: #d1d5db;
	margin: 0;
}

.is-retro-item .comment-text {
	color: #d4d4d8;
}
</style>
