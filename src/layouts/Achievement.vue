<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAchievementsStore } from '@/stores/achievements';
import { ACHIEVEMENT_THEMES } from '@/constants/achievementThemes';
import GamingDecor from '@/components/decor/GamingDecor.vue';
import UiButton from '@/components/ui/UiButton.vue';
import { formatDate } from '@/composables/useFormatDate';

const props = defineProps<{ id: string }>();
const router = useRouter();
const store = useAchievementsStore();

const achievement = computed(() => store.getById(props.id));

onMounted(() => store.fetchOne(props.id));

const isEditing = ref(false);
const noteInput = ref(achievement.value?.personalNote ?? '');

function saveNote() {
	store.updateNote(props.id, noteInput.value);
	isEditing.value = false;
}

function goBack() {
	router.push('/catalog');
}

// Tilt + holographic glare
const trophyRef = ref<HTMLElement | null>(null);
const rotateX = ref(0);
const rotateY = ref(0);
const glareX = ref(50);
const glareY = ref(50);
const isHovered = ref(false);

function onMouseMove(event: MouseEvent) {
	const element = trophyRef.value;
	if (!element) return;

	const rect = element.getBoundingClientRect();
	const deltaX =
		(event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
	const deltaY =
		(event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
	rotateX.value = -deltaY * 10;
	rotateY.value = deltaX * 10;
	glareX.value = ((event.clientX - rect.left) / rect.width) * 100;
	glareY.value = ((event.clientY - rect.top) / rect.height) * 100;
}

function onMouseEnter() {
	isHovered.value = true;
}

function onMouseLeave() {
	isHovered.value = false;
	rotateX.value = 0;
	rotateY.value = 0;
	glareX.value = 50;
	glareY.value = 50;
}
</script>

<template>
	<div
		v-if="achievement"
		class="detail-page"
		:class="`bg-${achievement.theme}`"
	>
		<UiButton class="back-btn" variant="ghost" size="sm" @click="goBack">
			← В каталог
		</UiButton>

		<div class="trophy-wrap">
			<div
				class="trophy-scene"
				@mousemove="onMouseMove"
				@mouseenter="onMouseEnter"
				@mouseleave="onMouseLeave"
			>
				<div
					ref="trophyRef"
					class="trophy-card"
					:class="`theme-${achievement.theme}`"
					:style="{
						transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
						transition: isHovered
							? 'transform 0.08s ease'
							: 'transform 0.5s ease',
					}"
				>
					<div class="trophy-decor" />
					<div
						class="trophy-glare"
						:style="{
							background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28) 0%, transparent 60%)`,
							opacity: isHovered ? 1 : 0,
						}"
					/>
					<div class="trophy-inner">
						<div class="trophy-image">
							<img
								v-if="achievement.imageUrl"
								:src="achievement.imageUrl"
								:alt="achievement.title"
							/>
							<div v-else class="trophy-placeholder">✦</div>
						</div>
						<div class="trophy-text">
							<h1>{{ achievement.title }}</h1>
							<p class="trophy-date">
								Получено {{ formatDate(achievement.createdAt) }}
							</p>
						</div>
					</div>
				</div>

				<GamingDecor
					v-if="achievement.theme === ACHIEVEMENT_THEMES.GAMING"
					variant="detail"
				/>
			</div>
		</div>

		<div class="detail-body">
			<section class="detail-section">
				<h2>Описание</h2>
				<p>{{ achievement.description }}</p>
			</section>

			<section class="detail-section">
				<div class="note-header">
					<h2>Личная заметка</h2>
					<UiButton
						v-if="!isEditing"
						variant="outline"
						size="sm"
						@click="isEditing = true"
					>
						Редактировать
					</UiButton>
				</div>

				<template v-if="!isEditing">
					<p v-if="achievement.personalNote" class="note-text">
						{{ achievement.personalNote }}
					</p>
					<p v-else class="note-empty">Нет заметки. Расскажи как это было?</p>
				</template>

				<div v-else class="note-edit">
					<textarea
						v-model="noteInput"
						placeholder="Расскажи как это было..."
						rows="4"
						autofocus
					/>
					<div class="note-actions">
						<UiButton variant="primary" size="sm" @click="saveNote">
							Сохранить
						</UiButton>
						<UiButton variant="danger" size="sm" @click="isEditing = false">
							Отмена
						</UiButton>
					</div>
				</div>
			</section>
		</div>
	</div>

	<div v-else class="not-found">
		<p>Такой ачивки нет</p>
		<UiButton variant="outline" size="sm" @click="goBack">Вернуться</UiButton>
	</div>
</template>

<style scoped>
.detail-page {
	min-height: 100vh;
	padding: 32px 24px 80px;
	display: grid;
	grid-template-columns: 1fr;
	justify-items: center;
	row-gap: 40px;
	transition: background 0.4s ease;
}

/* Theme-tinted page backgrounds */
.bg-gaming {
	background: var(--gaming-page-aura), var(--page-bg);
}
.bg-cooking {
	background: var(--cooking-page-aura), var(--cooking-page-bg);
}
.bg-default {
	background: var(--page-bg);
}

/* Back button needs to be anchored to the left of the grid cell */
.back-btn {
	justify-self: start;
}

/* ── Trophy card ── */
.trophy-wrap {
	width: 100%;
	max-width: 620px;
	padding-top: 40px;
	padding-right: 60px;
}

.trophy-scene {
	position: relative;
	width: 100%;
	height: 200px;
}

.trophy-card {
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: 100px;
	overflow: hidden;
	box-shadow: var(--shadow-trophy);
}

.trophy-glare {
	position: absolute;
	inset: 0;
	z-index: 10;
	pointer-events: none;
	border-radius: inherit;
	transition: opacity 0.2s ease;
}

.trophy-decor {
	position: absolute;
	inset: 0;
	z-index: 1;
	pointer-events: none;
	border-radius: inherit;
}

.trophy-inner {
	position: relative;
	z-index: 5;
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	column-gap: 24px;
	height: 100%;
	padding: 0 40px 0 32px;
}

.trophy-image {
	width: 130px;
	height: 130px;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}
.trophy-image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.trophy-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 3.5rem;
	border-radius: 50%;
}

.trophy-text h1 {
	margin: 0 0 8px;
	font-size: 1.6rem;
	font-weight: 800;
	line-height: 1.15;
}

.trophy-date {
	margin: 0;
	font-size: 0.85rem;
	opacity: 0.65;
	letter-spacing: 0.04em;
}

/* Trophy theme: gaming */
.trophy-card.theme-gaming {
	background: var(--gaming-card-bg);
	border: 1px solid var(--gaming-card-border);
	color: var(--gaming-card-text);
}
.trophy-card.theme-gaming .trophy-placeholder {
	background: var(--gaming-image-bg);
	color: var(--gaming-image-icon);
	border: 2px solid var(--gaming-image-border);
}
.trophy-card.theme-gaming .trophy-text h1 {
	color: var(--gaming-card-title);
	text-shadow: 0 0 20px var(--gaming-card-title-glow);
}
.trophy-card.theme-gaming .trophy-decor {
	background: var(--gaming-decor-overlay);
}

/* Trophy theme: cooking */
.trophy-card.theme-cooking {
	background: var(--cooking-card-bg);
	border: 2px solid var(--cooking-card-border);
	color: var(--cooking-card-text);
}
.trophy-card.theme-cooking .trophy-placeholder {
	background: var(--cooking-image-bg);
	color: var(--cooking-image-icon);
	border: 2px solid var(--cooking-image-border);
}
.trophy-card.theme-cooking .trophy-text h1 {
	color: var(--cooking-card-title);
	font-family: Georgia, serif;
	text-shadow: var(--cooking-card-title-shadow);
}
.trophy-card.theme-cooking .trophy-decor {
	box-shadow: var(--cooking-card-inset);
}

/* Trophy theme: default */
.trophy-card.theme-default {
	background: var(--default-card-bg);
	border: 1px solid var(--default-card-border);
	color: var(--default-card-text);
}
.trophy-card.theme-default .trophy-placeholder {
	background: var(--default-image-bg);
	color: var(--default-image-icon);
	border: 1px solid var(--default-image-border);
}

/* ── Body / sections ── */
.detail-body {
	width: 100%;
	max-width: 620px;
	display: grid;
	grid-template-columns: 1fr;
	row-gap: 32px;
}

.detail-section h2 {
	font-size: 0.78rem;
	font-weight: 600;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--text-muted);
	margin: 0 0 12px;
}

.detail-section p {
	color: var(--text-secondary);
	line-height: 1.7;
	margin: 0;
	font-size: 1rem;
}

.note-header {
	display: grid;
	grid-template-columns: 1fr auto;
	align-items: center;
	column-gap: 12px;
	margin-bottom: 12px;
}
.note-header h2 {
	margin: 0;
}

.note-text {
	color: var(--text-secondary);
	line-height: 1.7;
	font-style: italic;
}

.note-empty {
	color: var(--text-subtle);
	font-style: italic;
}

.note-edit textarea {
	width: 100%;
	background: var(--input-bg);
	border: 1px solid var(--input-border);
	border-radius: 12px;
	color: var(--text-primary);
	font-size: 0.95rem;
	line-height: 1.6;
	padding: 12px 16px;
	resize: vertical;
	font-family: inherit;
}
.note-edit textarea:focus {
	outline: none;
	border-color: var(--input-border-focus);
}

.note-actions {
	display: flex;
	gap: 10px;
	margin-top: 10px;
}

.not-found {
	display: grid;
	place-content: center;
	min-height: 100vh;
	gap: 16px;
	text-align: center;
	color: var(--text-muted);
}

/* ── Responsive ── */
@media (max-width: 640px) {
	.detail-page {
		padding: 24px 16px 60px;
	}

	.trophy-wrap {
		padding-right: 0;
		padding-top: 32px;
	}

	.trophy-scene {
		height: auto;
		transform: scale(0.85);
		transform-origin: center top;
	}
}
</style>
