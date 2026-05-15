<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAchievementsStore } from '@/stores/achievements'
import { ACHIEVEMENT_THEMES } from '@/constants/achievementThemes'
import GamingDecor from '@/components/decor/GamingDecor.vue'

const props = defineProps<{ id: string }>()
const router = useRouter()
const store = useAchievementsStore()

const achievement = computed(() => store.getById(props.id))

onMounted(() => store.fetchOne(props.id))

const isEditing = ref(false)
const noteInput = ref(achievement.value?.personalNote ?? '')

function saveNote() {
  store.updateNote(props.id, noteInput.value)
  isEditing.value = false
}

function goBack() {
  router.push('/')
}

// Tilt + holographic glare
const trophyRef = ref<HTMLElement | null>(null)
const rotateX = ref(0)
const rotateY = ref(0)
const glareX = ref(50)
const glareY = ref(50)
const isHovered = ref(false)

function onMouseMove(e: MouseEvent) {
  const el = trophyRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
  const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
  rotateX.value = -dy * 10
  rotateY.value = dx * 10
  glareX.value = ((e.clientX - rect.left) / rect.width) * 100
  glareY.value = ((e.clientY - rect.top) / rect.height) * 100
}

function onMouseEnter() { isHovered.value = true }

function onMouseLeave() {
  isHovered.value = false
  rotateX.value = 0
  rotateY.value = 0
  glareX.value = 50
  glareY.value = 50
}
</script>

<template>
  <div v-if="achievement" class="detail-page" :class="`bg-${achievement.theme}`">
    <button class="back-btn" type="button" @click="goBack">← Назад</button>

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
            transition: isHovered ? 'transform 0.08s ease' : 'transform 0.5s ease'
          }"
        >
          <div class="trophy-decor" />
          <div
            class="trophy-glare"
            :style="{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28) 0%, transparent 60%)`,
              opacity: isHovered ? 1 : 0
            }"
          />
          <div class="trophy-inner">
            <div class="trophy-image">
              <img v-if="achievement.imageUrl" :src="achievement.imageUrl" :alt="achievement.title" />
              <div v-else class="trophy-placeholder">✦</div>
            </div>
            <div class="trophy-text">
              <h1>{{ achievement.title }}</h1>
              <p class="trophy-date">
                Получено {{ new Date(achievement.createdAt).toLocaleDateString('ru-RU') }}
              </p>
            </div>
          </div>
        </div>

        <GamingDecor v-if="achievement.theme === ACHIEVEMENT_THEMES.GAMING" variant="detail" />
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
          <button v-if="!isEditing" class="btn-ghost" type="button" @click="isEditing = true">
            Редактировать
          </button>
        </div>

        <template v-if="!isEditing">
          <p v-if="achievement.personalNote" class="note-text">{{ achievement.personalNote }}</p>
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
            <button class="btn-ghost btn-primary" type="button" @click="saveNote">Сохранить</button>
            <button class="btn-ghost btn-danger" type="button" @click="isEditing = false">Отмена</button>
          </div>
        </div>
      </section>
    </div>
  </div>

  <div v-else class="not-found">
    <p>Такой ачивки нет</p>
    <button class="btn-ghost" type="button" @click="goBack">Вернуться</button>
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
.bg-gaming  { background: var(--gaming-page-aura), var(--page-bg); }
.bg-cooking { background: var(--cooking-page-aura), var(--cooking-page-bg); }
.bg-default { background: var(--page-bg); }

.back-btn {
  justify-self: start;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.2s;
}
.back-btn:hover { color: var(--text-primary); }

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
.trophy-image img { width: 100%; height: 100%; object-fit: cover; }

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
.note-header h2 { margin: 0; }

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

.btn-ghost {
  background: none;
  border: 1px solid var(--btn-border);
  border-radius: 8px;
  color: var(--btn-text);
  font-size: 0.85rem;
  padding: 6px 14px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.btn-ghost:hover {
  border-color: var(--btn-border-hover);
  color: var(--btn-text-hover);
}

.btn-primary {
  border-color: var(--btn-primary-border);
  color: var(--btn-primary-text);
}
.btn-primary:hover {
  border-color: var(--btn-primary-border);
  color: var(--btn-primary-text);
  background: var(--btn-primary-bg-hover);
}

.btn-danger:hover {
  border-color: var(--btn-danger-border);
  color: var(--btn-danger-text);
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
  .detail-page { padding: 24px 16px 60px; }

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
