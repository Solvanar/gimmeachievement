<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAchievementsStore } from '@/stores/achievements';
import type { Achievement } from '@/types/achievement';
import PencilIcon from '@/assets/icons/pencil.svg?component';
import CheckIcon from '@/assets/icons/check.svg?component';

const props = defineProps<{ achievement: Achievement }>();

const store = useAchievementsStore();
const isEditing = ref(false);
const storyInput = ref('');

watch(
	() => props.achievement,
	(val) => {
		storyInput.value = val?.personalNote ?? '';
	},
	{ immediate: true },
);

function saveStory() {
	store.updateNote(props.achievement.id, storyInput.value);
	isEditing.value = false;
}
</script>

<template>
	<section
		class="story-section"
		:class="{ 'story-retro': achievement.theme === 'retro' }"
	>
		<div class="story-header">
			<div class="story-title">
				<PencilIcon class="story-icon" />
				<h3>
					{{
						achievement.theme === 'retro'
							? 'ЛОГ-ЗАПИСЬ ИГРОКА'
							: 'История получения ачивки'
					}}
				</h3>
			</div>
			<button
				v-if="achievement.unlocked && !isEditing"
				class="edit-btn"
				@click="isEditing = true"
			>
				Изменить
			</button>
			<button
				v-else-if="isEditing"
				class="edit-btn edit-btn--cancel"
				@click="isEditing = false"
			>
				Отмена
			</button>
		</div>

		<div v-if="!achievement.unlocked" class="story-locked">
			🔒 Вы ещё не разблокировали это достижение! Купите соответствующий
			физический значок с кодом и введите его в профиле.
		</div>

		<template v-else>
			<div v-if="isEditing" class="story-edit">
				<textarea
					v-model="storyInput"
					rows="4"
					placeholder="Напишите, как вы получили эту ачивку, или свои эмоции..."
					class="story-textarea"
					:class="{ 'story-textarea--retro': achievement.theme === 'retro' }"
				/>
				<div class="story-save-row">
					<button class="save-btn" @click="saveStory">
						<CheckIcon class="save-icon" />
						Сохранить запись
					</button>
				</div>
			</div>
			<div v-else class="story-view">
				<p v-if="storyInput" class="story-text">{{ storyInput }}</p>
				<p v-else class="story-empty">
					Вы ещё не оставили свой комментарий о получении этой ачивки.
					Нажмите «Изменить», чтобы добавить ваши впечатления!
				</p>
			</div>
		</template>
	</section>
</template>

<style scoped>
.story-icon {
	width: 18px;
	height: 18px;
	flex-shrink: 0;
	color: #f59e0b;
}

.save-icon {
	width: 14px;
	height: 14px;
	flex-shrink: 0;
}

.story-section {
	padding: 24px 32px;
	background: rgba(26, 26, 26, 0.95);
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 24px;
	margin-bottom: 24px;
}

.story-retro {
	background: rgba(9, 9, 11, 0.9);
	border-color: rgba(99, 102, 241, 0.4);
	font-family: monospace;
}

.story-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
	padding-bottom: 12px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.story-title {
	display: flex;
	align-items: center;
	gap: 8px;
}

.story-title h3 {
	font-size: 1.05rem;
	font-weight: 700;
	color: #f3f4f6;
	margin: 0;
}

.story-retro .story-title h3 {
	text-transform: uppercase;
	color: #fbbf24;
}

.edit-btn {
	padding: 6px 14px;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	color: #f59e0b;
	font-size: 0.78rem;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.15s ease;
}

.edit-btn:hover {
	background: rgba(255, 255, 255, 0.1);
}

.edit-btn--cancel {
	color: #9ca3af;
}

.story-locked {
	font-size: 0.85rem;
	color: #6b7280;
	text-align: center;
	padding: 24px 0;
	line-height: 1.6;
}

.story-edit {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.story-textarea {
	width: 100%;
	padding: 14px 16px;
	background: rgba(23, 23, 23, 1);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 14px;
	color: #f3f4f6;
	font-size: 0.88rem;
	line-height: 1.6;
	resize: vertical;
	font-family: inherit;
	transition: border-color 0.15s ease;
	box-sizing: border-box;
}

.story-textarea:focus {
	outline: none;
	border-color: #10b981;
}

.story-textarea--retro {
	font-family: monospace;
	border-color: rgba(99, 102, 241, 0.5);
}

.story-textarea--retro:focus {
	border-color: #fbbf24;
}

.story-save-row {
	display: flex;
	justify-content: flex-end;
}

.save-btn {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 8px 18px;
	background: #059669;
	border: none;
	border-radius: 12px;
	color: #ffffff;
	font-weight: 600;
	font-size: 0.82rem;
	cursor: pointer;
	transition:
		filter 0.15s ease,
		transform 0.1s ease;
}

.save-btn:hover {
	filter: brightness(1.1);
}

.save-btn:active {
	transform: scale(0.97);
}

.story-text {
	font-size: 0.9rem;
	line-height: 1.7;
	color: #d1d5db;
	white-space: pre-wrap;
	margin: 0;
}

.story-empty {
	font-size: 0.85rem;
	color: #6b7280;
	font-style: italic;
	margin: 0;
}
</style>
