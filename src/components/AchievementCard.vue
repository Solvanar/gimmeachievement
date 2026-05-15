<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Achievement } from '@/types/achievement'
import GamingDecor from '@/components/GamingDecor.vue'

const props = defineProps<{ achievement: Achievement }>()
const router = useRouter()

function onClick() {
  router.push(`/achievement/${props.achievement.id}`)
}
</script>

<template>
  <div class="card-wrapper" @click="onClick">
    <div class="card-scene">
      <div class="card" :class="`theme-${achievement.theme}`">
        <div class="theme-decor" />
        <div class="card-content">
          <div class="card-image-slot">
            <img v-if="achievement.imageUrl" :src="achievement.imageUrl" :alt="achievement.title" />
            <div v-else class="card-image-placeholder"><span>✦</span></div>
          </div>
          <div class="card-text">
            <h3>{{ achievement.title }}</h3>
            <p>{{ achievement.description }}</p>
          </div>
        </div>
      </div>

      <GamingDecor v-if="achievement.theme === 'gaming'" variant="card" />
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 30px 50px 30px 0;
}

.card-scene {
  position: relative;
  width: 320px;
  height: 130px;
  flex-shrink: 0;
}

.card {
  position: relative;
  width: 320px;
  height: 130px;
  border-radius: 65px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
}

/* ── Content layout ── */
.card-content {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  padding: 0 24px 0 20px;
}

.card-image-slot {
  flex-shrink: 0;
  width: 86px;
  height: 86px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image-slot img { width: 100%; height: 100%; object-fit: cover; }

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.card-text h3 {
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
}

.card-text p {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.4;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ══ THEME: gaming ══ */
.theme-gaming {
  background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 50%, #1a1a2e 100%);
  border: 1px solid rgba(108, 99, 255, 0.4);
  color: #e8e8f0;
}
.theme-gaming .card-image-placeholder {
  background: radial-gradient(circle, #2d2d5e, #1a1a2e);
  color: #6c63ff;
  border: 2px solid rgba(108, 99, 255, 0.5);
}
.theme-gaming .card-text h3 {
  color: #a8a4ff;
  text-shadow: 0 0 12px rgba(108, 99, 255, 0.6);
}
.theme-gaming .theme-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(108,99,255,0.05) 0%, transparent 60%);
}

/* ══ THEME: cooking ══ */
.theme-cooking {
  background:
    repeating-linear-gradient(90deg, rgba(139,90,43,0.15) 0px, transparent 2px, transparent 18px),
    repeating-linear-gradient(0deg, rgba(139,90,43,0.08) 0px, transparent 2px, transparent 18px),
    linear-gradient(135deg, #8B5E3C 0%, #A0714F 30%, #8B5E3C 60%, #7A4F2D 100%);
  border: 2px solid #5c3a1e;
  box-shadow: 0 8px 32px rgba(92,58,30,0.5), inset 0 1px 0 rgba(255,220,160,0.2);
  color: #f5e6d0;
}
.theme-cooking .card-image-placeholder {
  background: radial-gradient(circle, #6b4423, #4a2e15);
  color: #f5c882;
  border: 2px solid rgba(139,90,43,0.6);
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.4);
}
.theme-cooking .card-text h3 {
  color: #f5c882;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  font-family: Georgia, serif;
}
.theme-cooking .card-text p { color: #e8d5b8; }
.theme-cooking .theme-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  border-radius: inherit;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,220,160,0.3);
}

/* ══ THEME: default ══ */
.theme-default {
  background: linear-gradient(135deg, #1e1e2e, #2a2a3e);
  border: 1px solid rgba(255,255,255,0.1);
  color: #e0e0e8;
}
.theme-default .card-image-placeholder {
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.4);
  border: 1px solid rgba(255,255,255,0.1);
}
</style>
