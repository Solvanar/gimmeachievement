<script setup lang="ts">
import { ref } from 'vue';
import type { Component } from 'vue';
import HeartIcon from '@/assets/icons/heart.svg?component';
import FlameIcon from '@/assets/icons/flame.svg?component';
import StarIcon from '@/assets/icons/star.svg?component';
import ThumbsUpIcon from '@/assets/icons/thumbs-up.svg?component';
import ShareIcon from '@/assets/icons/share.svg?component';
import CheckIcon from '@/assets/icons/check.svg?component';
import { REACTION_DEFS, type ReactionKey } from '@/constants/reactions';

const iconMap: Record<ReactionKey, Component> = {
	love: HeartIcon,
	fire: FlameIcon,
	hype: StarIcon,
	gg: ThumbsUpIcon,
};

const reactions = ref(
	Object.fromEntries(
		REACTION_DEFS.map((def) => [def.key, def.initialCount]),
	) as Record<ReactionKey, number>,
);
const reacted = ref(
	Object.fromEntries(REACTION_DEFS.map((def) => [def.key, false])) as Record<
		ReactionKey,
		boolean
	>,
);
const copiedLink = ref(false);

function handleReact(key: ReactionKey) {
	const was = reacted.value[key];
	reactions.value[key] = was
		? reactions.value[key] - 1
		: reactions.value[key] + 1;
	reacted.value[key] = !was;
}

function handleShare() {
	navigator.clipboard.writeText(window.location.href).catch(() => {});
	copiedLink.value = true;

	setTimeout(() => {
		copiedLink.value = false;
	}, 2000);
}
</script>

<template>
	<div class="actions-grid">
		<div class="reactions-card">
			<span class="card-label"
				>Понравилась ачивка друга? Поддержи реакцией:</span
			>
			<div class="reactions-row">
				<button
					v-for="def in REACTION_DEFS"
					:key="def.key"
					class="reaction-btn"
					:class="reacted[def.key] ? ['reaction-active', def.activeClass] : []"
					@click="handleReact(def.key)"
				>
					<component :is="iconMap[def.key]" class="reaction-icon" />
					{{
						def.label
							? `${def.label} (${reactions[def.key]})`
							: reactions[def.key]
					}}
				</button>
			</div>
		</div>

		<div class="share-card">
			<div>
				<span class="card-label">Поделиться профилем</span>
				<p class="share-hint">
					Покажите свои достижения друзьям в Telegram или ВК!
				</p>
			</div>
			<button
				class="share-btn"
				:class="{ 'share-btn--copied': copiedLink }"
				@click="handleShare"
			>
				<CheckIcon v-if="copiedLink" class="share-icon" />
				<ShareIcon v-else class="share-icon" />
				{{ copiedLink ? 'Ссылка скопирована!' : 'Поделиться ссылкой' }}
			</button>
		</div>
	</div>
</template>

<style scoped>
.actions-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 16px;
	margin-bottom: 24px;
}

@media (min-width: 640px) {
	.actions-grid {
		grid-template-columns: 2fr 1fr;
	}
}

.reactions-card,
.share-card {
	padding: 20px;
	background: rgba(24, 24, 24, 0.8);
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 16px;
}

.card-label {
	display: block;
	font-family: monospace;
	font-size: 0.65rem;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: #6b7280;
	margin-bottom: 12px;
}

.reactions-row {
	display: flex;
	align-items: center;
	gap: 10px;
	flex-wrap: wrap;
}

.reaction-btn {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 8px 14px;
	border-radius: 12px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	background: rgba(23, 23, 23, 1);
	color: #9ca3af;
	font-size: 0.78rem;
	cursor: pointer;
	transition: all 0.15s ease;
}

.reaction-btn:hover {
	background: rgba(37, 37, 37, 1);
}

.reaction-btn:active {
	transform: scale(0.97);
}

.reaction-icon,
.share-icon {
	width: 16px;
	height: 16px;
	flex-shrink: 0;
}

.reaction-active.reaction-love {
	background: rgba(127, 29, 29, 0.4);
	border-color: rgba(251, 113, 133, 0.6);
	color: #fda4af;
}

.reaction-active.reaction-fire {
	background: rgba(69, 26, 3, 0.4);
	border-color: rgba(245, 158, 11, 0.6);
	color: #fcd34d;
}

.reaction-active.reaction-hype {
	background: rgba(30, 27, 75, 0.4);
	border-color: rgba(99, 102, 241, 0.6);
	color: #a5b4fc;
}

.reaction-active.reaction-gg {
	background: rgba(2, 44, 22, 0.4);
	border-color: rgba(16, 185, 129, 0.6);
	color: #6ee7b7;
}

.share-card {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 12px;
}

.share-hint {
	font-size: 0.78rem;
	color: #6b7280;
	line-height: 1.5;
	margin: 0;
}

.share-btn {
	width: 100%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 10px;
	border-radius: 12px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	background: rgba(23, 23, 23, 1);
	color: #f59e0b;
	font-size: 0.8rem;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.15s ease;
}

.share-btn:hover {
	background: rgba(37, 37, 37, 1);
}

.share-btn--copied {
	background: #059669 !important;
	border-color: #059669 !important;
	color: #ffffff !important;
}
</style>
