<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const products = [
	{
		id: 'shiva',
		name: 'Значок «Многорукий Шива»',
		material: 'МАТЕРИАЛ: ЦИНК / ГОРЯЧАЯ ЭМАЛЬ',
		description:
			'Цветной эмалированный значок в виде игрового трофея с изображением многорукого индийского убер-игрока. В комплекте идет металлический зажим.',
		price: '350 ₽',
		points: '150G',
		code: 'SHIVA-DUAL-X7',
		tag: 'ДИЗАЙН: ГЕЙМИНГ',
		emoji: '🎮',
		accentColor: '#10b981',
		tagBg: 'rgba(6,78,59,0.6)',
		tagColor: '#10b981',
		tagBorder: 'rgba(16,185,129,0.2)',
		circleBg: '#10b981',
		pillBg: 'rgba(41,41,41,0.9)',
		pillBorder: 'rgba(16,185,129,0.24)',
		hoverBorder: 'rgba(16,185,129,0.3)',
	},
	{
		id: 'rgb',
		name: 'Значок «RGB-Искусствовед»',
		material: 'МАТЕРИАЛ: ЛАТУНЬ / КВАДРАТНЫЙ ПИКСЕЛЬ-АРТ',
		description:
			'Пиксельный значок Соника на фоне классического оранжево-зеленого горизонта. Прекрасно гармонирует со старыми рюкзаками и джинсовками.',
		price: '320 ₽',
		points: '100G',
		code: 'PIXEL-RGB-8B',
		tag: 'ДИЗАЙН: RETRO',
		emoji: '👾',
		accentColor: '#818cf8',
		tagBg: 'rgba(30,27,75,0.6)',
		tagColor: '#818cf8',
		tagBorder: 'rgba(129,140,248,0.2)',
		circleBg: '#818cf8',
		pillBg: 'rgba(24,24,27,0.9)',
		pillBorder: 'rgba(129,140,248,0.24)',
		hoverBorder: 'rgba(129,140,248,0.3)',
	},
	{
		id: 'coffee',
		name: 'Значок «Кофейный Магнат»',
		material: 'МАТЕРИАЛ: ЭМАЛЬ С ГЛИТТЕРОМ ДЛЯ ПУЛЬСА',
		description:
			'Уютная кружечка с ушками кролика, от которой исходит золотой мерцающий пар. Дает +50 к работоспособности и снижает риск выгорания.',
		price: '290 ₽',
		points: '50G',
		code: 'COFFEE-BOOST-88',
		tag: 'ДИЗАЙН: LIFESTYLE',
		emoji: '☕',
		accentColor: '#f59e0b',
		tagBg: 'rgba(69,26,3,0.6)',
		tagColor: '#f59e0b',
		tagBorder: 'rgba(245,158,11,0.2)',
		circleBg: '#f59e0b',
		pillBg: 'rgba(41,26,3,0.6)',
		pillBorder: 'rgba(245,158,11,0.24)',
		hoverBorder: 'rgba(245,158,11,0.3)',
	},
] as const;

function handlePreorder() {
	alert('Заглушка заказа! Скоро здесь появится интеграция с корзиной и оплатой.');
}
</script>

<template>
	<div class="shop-page">
		<!-- Banner -->
		<div class="shop-banner">
			<div class="banner-content">
				<span class="banner-tag">ФИЗИЧЕСКИЕ НАГРАДЫ // СКОРО В ПРОДАЖЕ!</span>
				<h1 class="banner-title">Каталог Красивых Значков & Магнитов</h1>
				<p class="banner-desc">
					Каждый дизайн выполнен методом горячей эмали с невероятной детализацией.
					На обратной стороне каждого вкладыша нанесён секретный защитный слой с кодом.
					Ссылка на сайт и код создадут мгновенный флекс в комьюнити!
				</p>
			</div>
			<div class="price-box">
				<span class="price-label">Ориентир цены:</span>
				<span class="price-value">от 290₽</span>
				<span class="price-note">за значок + код</span>
			</div>
		</div>

		<!-- Products grid -->
		<div class="products-grid">
			<div
				v-for="product in products"
				:key="product.id"
				class="product-card"
				:style="{ '--hover-border': product.hoverBorder }"
			>
				<!-- Preview image area -->
				<div class="product-preview">
					<div class="product-pill" :style="{ background: product.pillBg, borderColor: product.pillBorder }">
						<span class="pill-dot" :style="{ background: product.circleBg }" />
						<span class="pill-code">{{ product.code }}</span>
						<span class="pill-points">{{ product.points }}</span>
					</div>
					<span class="product-tag" :style="{ background: product.tagBg, color: product.tagColor, borderColor: product.tagBorder }">
						{{ product.tag }}
					</span>
					<span class="product-emoji">{{ product.emoji }}</span>
				</div>

				<!-- Info -->
				<div class="product-info">
					<h3 class="product-name" :style="{ '--name-hover': product.accentColor }">{{ product.name }}</h3>
					<span class="product-material">{{ product.material }}</span>
					<p class="product-desc">{{ product.description }}</p>
				</div>

				<!-- Footer -->
				<div class="product-footer">
					<span class="product-price">{{ product.price }}</span>
					<button class="preorder-btn" type="button" @click="handlePreorder">Предзаказ</button>
				</div>
			</div>
		</div>

		<!-- CTA hint -->
		<div class="shop-cta">
			<p class="cta-text">Уже есть физический значок? Регистрируйте код в профиле!</p>
			<button class="cta-btn" type="button" @click="router.push('/profile')">
				Перейти в профиль
			</button>
		</div>
	</div>
</template>

<style scoped>
.shop-page {
	max-width: 1100px;
	margin: 0 auto;
	padding: 40px 24px 80px;
	display: flex;
	flex-direction: column;
	gap: 32px;
}

/* ── Banner ── */
.shop-banner {
	background: linear-gradient(135deg, #0f0f2e 0%, #1a1a1a 50%, #021a0e 100%);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 28px;
	padding: 32px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 24px;
	overflow: hidden;
	position: relative;
}

.shop-banner::before {
	content: '';
	position: absolute;
	inset: 0;
	background: radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 60%),
		radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.06) 0%, transparent 60%);
	pointer-events: none;
}

.banner-content {
	display: flex;
	flex-direction: column;
	gap: 10px;
	flex: 1;
	min-width: 0;
}

.banner-tag {
	display: inline-block;
	width: fit-content;
	font-family: var(--font-mono);
	font-size: var(--text-2xs);
	font-weight: var(--font-bold);
	padding: 4px 12px;
	border-radius: 999px;
	background: rgba(99, 102, 241, 0.1);
	color: #818cf8;
	border: 1px solid rgba(99, 102, 241, 0.2);
	letter-spacing: var(--tracking-wide);
}

.banner-title {
	font-size: clamp(1.4rem, 3vw, 2rem);
	font-weight: var(--font-black);
	letter-spacing: var(--tracking-tight);
	color: #fff;
	margin: 0;
	line-height: var(--leading-tight);
}

.banner-desc {
	font-size: var(--text-base);
	color: rgba(255, 255, 255, 0.65);
	line-height: var(--leading-relaxed);
	max-width: 520px;
	margin: 0;
}

.price-box {
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	padding: 16px 20px;
	background: rgba(10, 10, 10, 0.6);
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 18px;
	backdrop-filter: blur(12px);
	gap: 2px;
}

.price-label {
	font-size: var(--text-xs);
	color: rgba(255, 255, 255, 0.4);
}

.price-value {
	font-size: var(--text-3xl);
	font-weight: var(--font-black);
	color: #f59e0b;
	line-height: var(--leading-none);
}

.price-note {
	font-size: var(--text-2xs);
	color: rgba(255, 255, 255, 0.3);
}

/* ── Grid ── */
.products-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 20px;
}

/* ── Card ── */
.product-card {
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 28px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease;
}

.product-card:hover {
	border-color: var(--hover-border);
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.product-card:hover .product-emoji {
	transform: scale(1.15) rotate(6deg);
}

/* ── Preview ── */
.product-preview {
	position: relative;
	aspect-ratio: 16 / 9;
	border-radius: 16px;
	background: rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.06);
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}

.product-pill {
	position: absolute;
	left: 16px;
	right: 16px;
	top: 50%;
	transform: translateY(-50%);
	height: 40px;
	border-radius: 999px;
	border: 1px solid;
	display: flex;
	align-items: center;
	padding: 0 14px;
	gap: 10px;
}

.pill-dot {
	width: 18px;
	height: 18px;
	border-radius: 50%;
	flex-shrink: 0;
}

.pill-code {
	font-family: var(--font-mono);
	font-size: var(--text-xs);
	font-weight: var(--font-bold);
	color: rgba(255, 255, 255, 0.85);
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.pill-points {
	font-size: var(--text-2xs);
	color: #f59e0b;
	font-weight: var(--font-bold);
	flex-shrink: 0;
}

.product-tag {
	position: absolute;
	top: 8px;
	right: 8px;
	font-family: var(--font-mono);
	font-size: var(--text-2xs);
	font-weight: var(--font-black);
	padding: 2px 8px;
	border-radius: 4px;
	border: 1px solid;
}

.product-emoji {
	font-size: 2.4rem;
	transition: transform 0.2s ease;
	user-select: none;
}

/* ── Info ── */
.product-info {
	display: flex;
	flex-direction: column;
	gap: 6px;
	flex: 1;
}

.product-name {
	font-size: var(--text-md);
	font-weight: var(--font-extrabold);
	color: var(--text-primary);
	margin: 0;
	transition: color 0.15s ease;
}

.product-card:hover .product-name {
	color: var(--hover-border);
}

.product-material {
	font-family: var(--font-mono);
	font-size: var(--text-2xs);
	font-weight: var(--font-semibold);
	text-transform: uppercase;
	letter-spacing: var(--tracking-wide);
	color: var(--text-subtle);
}

.product-desc {
	font-size: var(--text-sm);
	color: var(--text-muted);
	line-height: 1.55;
	margin: 4px 0 0;
}

/* ── Footer ── */
.product-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 12px;
	border-top: 1px solid var(--surface-elevated-border);
}

.product-price {
	font-size: var(--text-md);
	font-weight: var(--font-black);
	color: var(--text-primary);
}

.preorder-btn {
	padding: 8px 16px;
	background: #10b981;
	border: none;
	border-radius: 12px;
	color: #fff;
	font-weight: var(--font-bold);
	font-size: var(--text-xs);
	cursor: pointer;
	transition:
		background 0.15s ease,
		transform 0.1s ease;
}

.preorder-btn:hover {
	background: #34d399;
}

.preorder-btn:active {
	transform: scale(0.96);
}

/* ── CTA ── */
.shop-cta {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 12px;
	padding: 24px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 24px;
	text-align: center;
}

.cta-text {
	font-size: var(--text-base);
	color: var(--text-muted);
	margin: 0;
	line-height: var(--leading-normal);
}

.cta-btn {
	padding: 10px 24px;
	background: rgba(99, 102, 241, 0.15);
	border: 1px solid rgba(99, 102, 241, 0.3);
	border-radius: 12px;
	color: #818cf8;
	font-weight: var(--font-extrabold);
	font-size: var(--text-sm);
	text-transform: uppercase;
	letter-spacing: var(--tracking-wide);
	cursor: pointer;
	transition:
		background 0.15s ease,
		border-color 0.15s ease,
		transform 0.1s ease;
}

.cta-btn:hover {
	background: rgba(99, 102, 241, 0.25);
	border-color: rgba(99, 102, 241, 0.5);
}

.cta-btn:active {
	transform: scale(0.97);
}

@media (max-width: 768px) {
	.shop-page {
		padding: 24px 16px 60px;
	}

	.shop-banner {
		flex-direction: column;
		padding: 24px;
	}

	.price-box {
		width: 100%;
	}
}
</style>
