<script setup lang="ts">
defineProps<{ variant: 'card' | 'detail' }>()
</script>

<template>
  <svg
    class="gaming-decor"
    :viewBox="variant === 'card' ? '0 0 320 130' : '0 0 560 200'"
    overflow="visible"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- ══ CORD ══ -->
    <g v-if="variant === 'card'" class="cord-group">
      <path class="cord cord-base"
        d="M 318 68
           C 345 68, 362 52, 360 34
           C 358 16, 340 10, 325 17
           C 310 24, 307 42, 320 50
           C 333 58, 352 54, 358 38
           C 364 22, 353 8, 338 5
           C 323 2, 308 12, 308 26"
      />
      <path class="cord cord-highlight"
        d="M 318 68
           C 345 68, 362 52, 360 34
           C 358 16, 340 10, 325 17
           C 310 24, 307 42, 320 50
           C 333 58, 352 54, 358 38
           C 364 22, 353 8, 338 5
           C 323 2, 308 12, 308 26"
      />
      <path class="cord cord-stripes"
        d="M 318 68
           C 345 68, 362 52, 360 34
           C 358 16, 340 10, 325 17
           C 310 24, 307 42, 320 50
           C 333 58, 352 54, 358 38
           C 364 22, 353 8, 338 5
           C 323 2, 308 12, 308 26"
      />
    </g>

    <g v-else class="cord-group">
      <path class="cord cord-base"
        d="M 556 102
           C 598 102, 622 80, 618 54
           C 614 28, 588 18, 566 28
           C 544 38, 540 66, 558 78
           C 576 90, 606 84, 614 60
           C 622 36, 608 14, 588 10
           C 568 6, 550 20, 548 40"
      />
      <path class="cord cord-highlight"
        d="M 556 102
           C 598 102, 622 80, 618 54
           C 614 28, 588 18, 566 28
           C 544 38, 540 66, 558 78
           C 576 90, 606 84, 614 60
           C 622 36, 608 14, 588 10
           C 568 6, 550 20, 548 40"
      />
      <path class="cord cord-stripes"
        d="M 556 102
           C 598 102, 622 80, 618 54
           C 614 28, 588 18, 566 28
           C 544 38, 540 66, 558 78
           C 576 90, 606 84, 614 60
           C 622 36, 608 14, 588 10
           C 568 6, 550 20, 548 40"
      />
    </g>

    <!-- ══ PS BUTTONS ══
         Outer <g> = SVG position (transform attribute, never touched by CSS)
         Inner <g> = CSS float animation (transform property)
    -->

    <!-- Triangle △ (green) -->
    <g :transform="variant === 'card' ? 'translate(292, -22) rotate(-12)' : 'translate(530, -32) rotate(-12)'">
      <g class="ps-btn btn-triangle">
        <circle class="btn-bg" cx="0" cy="0" :r="variant === 'card' ? 14 : 20" />
        <polygon
          :points="variant === 'card' ? '0,-8 -7,5 7,5' : '0,-11 -10,7 10,7'"
          fill="none" stroke="#00B140"
          :stroke-width="variant === 'card' ? 2 : 2.5"
          stroke-linejoin="round"
        />
        <circle class="btn-glow btn-glow-triangle" cx="0" cy="0"
          :r="variant === 'card' ? 14 : 20"
          fill="none" :stroke-width="variant === 'card' ? 1 : 1.5"
        />
      </g>
    </g>

    <!-- Cross ✕ (blue) -->
    <g :transform="variant === 'card' ? 'translate(348, 30)' : 'translate(596, 48)'">
      <g class="ps-btn btn-cross">
        <circle class="btn-bg" cx="0" cy="0" :r="variant === 'card' ? 14 : 20" />
        <line
          :x1="variant === 'card' ? -6.5 : -9" :y1="variant === 'card' ? -6.5 : -9"
          :x2="variant === 'card' ? 6.5 : 9"   :y2="variant === 'card' ? 6.5 : 9"
          stroke="#4169E1" :stroke-width="variant === 'card' ? 2.5 : 3" stroke-linecap="round"
        />
        <line
          :x1="variant === 'card' ? 6.5 : 9"   :y1="variant === 'card' ? -6.5 : -9"
          :x2="variant === 'card' ? -6.5 : -9" :y2="variant === 'card' ? 6.5 : 9"
          stroke="#4169E1" :stroke-width="variant === 'card' ? 2.5 : 3" stroke-linecap="round"
        />
        <circle class="btn-glow btn-glow-cross" cx="0" cy="0"
          :r="variant === 'card' ? 14 : 20"
          fill="none" :stroke-width="variant === 'card' ? 1 : 1.5"
        />
      </g>
    </g>

    <!-- Circle ○ (red) -->
    <g :transform="variant === 'card' ? 'translate(352, 82)' : 'translate(602, 128)'">
      <g class="ps-btn btn-circle">
        <circle class="btn-bg" cx="0" cy="0" :r="variant === 'card' ? 14 : 20" />
        <circle cx="0" cy="0" :r="variant === 'card' ? 7 : 10"
          fill="none" stroke="#E8001C" :stroke-width="variant === 'card' ? 2 : 2.5"
        />
        <circle class="btn-glow btn-glow-circle" cx="0" cy="0"
          :r="variant === 'card' ? 14 : 20"
          fill="none" :stroke-width="variant === 'card' ? 1 : 1.5"
        />
      </g>
    </g>

    <!-- Square □ (pink) -->
    <g :transform="variant === 'card' ? 'translate(306, 153) rotate(8)' : 'translate(548, 228) rotate(8)'">
      <g class="ps-btn btn-square">
        <circle class="btn-bg" cx="0" cy="0" :r="variant === 'card' ? 14 : 20" />
        <rect
          :x="variant === 'card' ? -7 : -10" :y="variant === 'card' ? -7 : -10"
          :width="variant === 'card' ? 14 : 20" :height="variant === 'card' ? 14 : 20"
          rx="1.5" fill="none" stroke="#FF69B4" :stroke-width="variant === 'card' ? 2 : 2.5"
        />
        <circle class="btn-glow btn-glow-square" cx="0" cy="0"
          :r="variant === 'card' ? 14 : 20"
          fill="none" :stroke-width="variant === 'card' ? 1 : 1.5"
        />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.gaming-decor {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
}

/* ── Cord ── */
.cord {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.cord-base      { stroke: #12122a; stroke-width: 7; }
.cord-highlight { stroke: #3a3a6e; stroke-width: 4; }
.cord-stripes   { stroke: rgba(255,255,255,0.06); stroke-width: 1.5; stroke-dasharray: 3 6; }

/* ── Buttons ── */
.btn-bg { fill: rgba(8, 8, 24, 0.75); }

.btn-glow-triangle { stroke: rgba(0, 177, 64, 0.45); }
.btn-glow-cross    { stroke: rgba(65, 105, 225, 0.45); }
.btn-glow-circle   { stroke: rgba(232, 0, 28, 0.45); }
.btn-glow-square   { stroke: rgba(255, 105, 180, 0.45); }

/* Float animation on inner group — doesn't affect outer positioning */
.ps-btn {
  animation: float 3s ease-in-out infinite;
}
.btn-triangle { animation-delay: 0s; }
.btn-cross    { animation-delay: 0.75s; }
.btn-circle   { animation-delay: 1.5s; }
.btn-square   { animation-delay: 2.25s; }

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-4px); }
}
</style>
