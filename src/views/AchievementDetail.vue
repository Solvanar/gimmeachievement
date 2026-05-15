<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAchievementsStore } from '@/stores/achievements'
import GamingDecor from '@/components/GamingDecor.vue'

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
  <div v-if="achievement" class="detail-page" :class="`theme-bg-${achievement.theme}`">
    <button class="back-btn" @click="goBack">← Назад</button>

    <!-- Big trophy card -->
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
            <p class="trophy-date">Получено {{ new Date(achievement.createdAt).toLocaleDateString('ru-RU') }}</p>
          </div>
        </div>
      </div>

      <GamingDecor v-if="achievement.theme === 'gaming'" variant="detail" />
      </div>
    </div>

    <!-- Description -->
    <div class="detail-body">
      <section class="detail-section">
        <h2>Описание</h2>
        <p>{{ achievement.description }}</p>
      </section>

      <!-- Personal note -->
      <section class="detail-section note-section">
        <div class="note-header">
          <h2>Личная заметка</h2>
          <button v-if="!isEditing" class="edit-btn" @click="isEditing = true">Редактировать</button>
        </div>

        <div v-if="!isEditing">
          <p v-if="achievement.personalNote" class="note-text">{{ achievement.personalNote }}</p>
          <p v-else class="note-empty">Нет заметки. Расскажи как это было?</p>
        </div>

        <div v-else class="note-edit">
          <textarea
            v-model="noteInput"
            placeholder="Расскажи как это было..."
            rows="4"
            autofocus
          />
          <div class="note-actions">
            <button class="save-btn" @click="saveNote">Сохранить</button>
            <button class="cancel-btn" @click="isEditing = false">Отмена</button>
          </div>
        </div>
      </section>
    </div>
  </div>

  <div v-else class="not-found">
    <p>Такой ачивки нет 🤷</p>
    <button @click="goBack">Вернуться</button>
  </div>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding: 32px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background 0.4s ease;
}

/* Theme backgrounds */
.theme-bg-gaming {
  background: radial-gradient(ellipse at 50% 0%, rgba(108, 99, 255, 0.15) 0%, transparent 60%),
              #0d0d1a;
}
.theme-bg-cooking {
  background: radial-gradient(ellipse at 50% 0%, rgba(139, 90, 43, 0.2) 0%, transparent 60%),
              #1a0f07;
}
.theme-bg-default {
  background: #0d0d1a;
}

.back-btn {
  align-self: flex-start;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 48px;
  transition: color 0.2s;
}
.back-btn:hover { color: #fff; }

/* ── Big trophy card ── */
.trophy-wrap {
  width: 100%;
  max-width: 560px;
  margin-bottom: 48px;
  /* extra right padding so PS buttons don't get clipped */
  padding-right: 60px;
  padding-top: 40px;
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
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.trophy-glare {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.04) 100%
  );
  border-radius: inherit;
}

.trophy-inner {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 24px;
  height: 100%;
  padding: 0 40px 0 32px;
}

.trophy-image {
  flex-shrink: 0;
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
  opacity: 0.55;
  letter-spacing: 0.04em;
}

/* Gaming theme for big card */
.trophy-card.theme-gaming {
  background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 50%, #1a1a2e 100%);
  border: 1px solid rgba(108, 99, 255, 0.5);
  color: #e8e8f0;
}
.trophy-card.theme-gaming .trophy-placeholder {
  background: radial-gradient(circle, #2d2d5e, #1a1a2e);
  color: #6c63ff;
  border: 2px solid rgba(108, 99, 255, 0.5);
  border-radius: 50%;
}
.trophy-card.theme-gaming .trophy-text h1 {
  color: #a8a4ff;
  text-shadow: 0 0 20px rgba(108, 99, 255, 0.5);
}
.trophy-card.theme-gaming .trophy-decor {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  border-radius: inherit;
  background-image:
    radial-gradient(circle 28px at 90% 25%, transparent 22px, rgba(108,99,255,0.15) 22px, rgba(108,99,255,0.15) 28px, transparent 28px),
    radial-gradient(circle 20px at 94% 70%, transparent 15px, rgba(255,99,132,0.1) 15px, rgba(255,99,132,0.1) 20px, transparent 20px),
    radial-gradient(circle 14px at 84% 82%, transparent 10px, rgba(99,255,180,0.1) 10px, rgba(99,255,180,0.1) 14px, transparent 14px),
    radial-gradient(circle 22px at 86% 15%, transparent 17px, rgba(255,220,50,0.08) 17px, rgba(255,220,50,0.08) 22px, transparent 22px);
}

/* Cooking theme for big card */
.trophy-card.theme-cooking {
  background:
    repeating-linear-gradient(90deg, rgba(139,90,43,0.15) 0px, transparent 2px, transparent 18px),
    repeating-linear-gradient(0deg, rgba(139,90,43,0.08) 0px, transparent 2px, transparent 18px),
    linear-gradient(135deg, #8B5E3C 0%, #A0714F 30%, #8B5E3C 60%, #7A4F2D 100%);
  border: 2px solid #5c3a1e;
  color: #f5e6d0;
}
.trophy-card.theme-cooking .trophy-placeholder {
  background: radial-gradient(circle, #6b4423, #4a2e15);
  color: #f5c882;
  border: 2px solid rgba(139,90,43,0.6);
  border-radius: 50%;
}
.trophy-card.theme-cooking .trophy-text h1 {
  color: #f5c882;
  font-family: Georgia, serif;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.6);
}
.trophy-card.theme-cooking .trophy-decor {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  border-radius: inherit;
  box-shadow: inset 0 0 30px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,220,160,0.3);
}

/* Default theme */
.trophy-card.theme-default {
  background: linear-gradient(135deg, #1e1e2e, #2a2a3e);
  border: 1px solid rgba(255,255,255,0.1);
  color: #e0e0e8;
}
.trophy-card.theme-default .trophy-placeholder {
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50%;
}

/* ── Body sections ── */
.detail-body {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.detail-section h2 {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 12px;
}

.detail-section p {
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  margin: 0;
  font-size: 1rem;
}

.note-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.note-header h2 { margin: 0; }

.note-text {
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  font-style: italic;
}

.note-empty {
  color: rgba(255, 255, 255, 0.25);
  font-style: italic;
}

.note-edit textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: #fff;
  font-size: 0.95rem;
  line-height: 1.6;
  padding: 12px 16px;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
}
.note-edit textarea:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
}

.note-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.edit-btn, .save-btn, .cancel-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.15s;
}
.edit-btn:hover, .save-btn:hover { border-color: rgba(255,255,255,0.5); color: #fff; }
.save-btn { border-color: rgba(108, 99, 255, 0.5); color: #a8a4ff; }
.save-btn:hover { background: rgba(108, 99, 255, 0.15); }
.cancel-btn:hover { border-color: rgba(255,80,80,0.4); color: rgba(255,120,120,0.9); }

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 16px;
  color: rgba(255,255,255,0.5);
}
</style>
