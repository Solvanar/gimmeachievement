<script setup lang="ts">
import { onMounted } from 'vue'
import { useAchievementsStore } from '@/stores/achievements'
import AchievementCard from '@/components/AchievementCard.vue'

const store = useAchievementsStore()
onMounted(() => store.fetchAll())
</script>

<template>
  <div class="list-page">
    <header class="list-header">
      <h1>Мои достижения</h1>
      <p class="subtitle">{{ store.achievements.length }} разблокировано</p>
    </header>

    <p v-if="store.loading" class="state-msg">Загрузка...</p>
    <p v-else-if="store.error" class="state-msg error">{{ store.error }}</p>

    <div v-else class="cards-grid">
      <AchievementCard
        v-for="achievement in store.achievements"
        :key="achievement.id"
        :achievement="achievement"
      />
    </div>
  </div>
</template>

<style scoped>
.list-page {
  min-height: 100vh;
  padding: 60px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.list-header {
  text-align: center;
  margin-bottom: 56px;
}

.list-header h1 {
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  margin: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.state-msg {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
}
.state-msg.error { color: #ff6b6b; }

.cards-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
}
</style>
