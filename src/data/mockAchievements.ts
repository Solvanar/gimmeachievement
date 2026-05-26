import type { Achievement } from '@/types/achievement';
import type { AchievementComment } from '@/types/achievement';

export const MOCK_ACHIEVEMENTS: Achievement[] = [
	{
		id: 'shiva',
		code: 'SHIVA-DUAL-X7',
		title: 'Многорукий Шива',
		subtitle: 'Играть в онлайн-игре сразу с двух аккаунтов',
		description:
			'Разблокируется, когда вы одновременно управляете двумя персонажами в кооперативе или соревнуетесь с самим собой, демонстрируя невероятную моторику рук.',
		points: 150,
		unlocked: true,
		unlockedAt: '2026-05-18',
		personalNote:
			'Да, это было жестко! На левом ноуте играл хилером, правой рукой на геймпаде от плойки танковал. Мы зачистили данж, но пальцы потом болели весь оставшийся день!',
		category: 'gaming',
		theme: 'cyber',
		accentColor: '#10B981',
		imageUrl:
			'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=300&h=300',
		createdAt: '2026-05-01',
	},
	{
		id: 'rgb_artist',
		code: 'PIXEL-RGB-8B',
		title: 'RGB-Искусствовед',
		subtitle: 'Любит пиксельные игры и арты',
		description:
			'Награда для тех, кто может часами разглядывать спрайты в Streets of Rage или собирать диорамы из пиксельных термомозаик. У вас развит безупречный 16/32-битный вкус.',
		points: 100,
		unlocked: true,
		unlockedAt: '2026-05-20',
		personalNote:
			'Купила пиксельный значок Соника в качестве физической ачивки, повесила на рюкзак, теперь все друзья спрашивают, где взяла!',
		category: 'pixel',
		theme: 'retro',
		accentColor: '#3B82F6',
		imageUrl:
			'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300&h=300',
		createdAt: '2026-05-02',
	},
	{
		id: 'coffee',
		code: 'COFFEE-BOOST-88',
		title: 'Кофейный Магнат',
		subtitle: 'Выпить 5 чашек кофе за рабочий день и выжить',
		description:
			'Разблокируется при превышении суточной нормы кофеина в угоду горящим дедлайнам. Пульс 140, глаза как блюдца, но проект задеплоен!',
		points: 50,
		unlocked: false,
		category: 'lifestyle',
		theme: 'cozy',
		accentColor: '#F59E0B',
		imageUrl:
			'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300&h=300',
		createdAt: '2026-05-03',
	},
	{
		id: 'detox',
		code: 'DETOX-FOREST-21',
		title: 'Цифровой Детокс',
		subtitle: 'Провести все выходные без смартфона в лесу',
		description:
			'Сложное скрытое достижение. Выключить все уведомления, уехать за город в дикие условия и слушать пение птиц вместо шортсов.',
		points: 200,
		unlocked: false,
		category: 'lifestyle',
		theme: 'forest',
		accentColor: '#10B981',
		imageUrl:
			'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=300&h=300',
		createdAt: '2026-05-04',
	},
	{
		id: 'keyboard_warrior',
		code: 'KEY-RAPID-99',
		title: 'Гроза Клавиатур',
		subtitle: 'Напечатать 400+ символов в минуту без единой ошибки',
		description:
			'Пальцы летают над клавишами так быстро, что кажется, будто вы взламываете Пентагон под саундтрек из Матрицы.',
		points: 75,
		unlocked: false,
		category: 'gaming',
		theme: 'cyber',
		accentColor: '#EC4899',
		imageUrl:
			'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=300&h=300',
		createdAt: '2026-05-05',
	},
	{
		id: 'gourmet',
		code: 'CHEF-HOME-12',
		title: 'Шеф-Повар с Района',
		subtitle: 'Приготовить ресторанное блюдо вместо заказа доставки',
		description:
			'Мишленовская звезда у вас на кухне. Правильная прожарка стейка или идеальная карбонара без сливок!',
		points: 60,
		unlocked: false,
		category: 'creative',
		theme: 'cozy',
		accentColor: '#EF4444',
		imageUrl:
			'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=300&h=300',
		createdAt: '2026-05-06',
	},
];

export const MOCK_COMMENTS: Record<string, AchievementComment[]> = {
	shiva: [
		{
			id: 'shiva-c1',
			author: 'Костя Про-Геймер',
			avatar:
				'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=80&h=80',
			text: 'Чувак, ты псих! Я с одним-то аккаунтом дохну в этом данже. Заслуженная ачивка!',
			timestamp: 'Вчера в 15:42',
		},
		{
			id: 'shiva-c2',
			author: 'Алиса Киткат',
			avatar:
				'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80&h=80',
			text: 'Слушай, а геймпад от плойки оригинальный или кастомный? Светится зеленым на фотке безумно круто!',
			timestamp: 'Два дня назад',
		},
	],
	rgb_artist: [
		{
			id: 'rgb-c1',
			author: 'Пиксельный Дракон',
			avatar:
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80',
			text: 'Вау, сайт поменял тему на ретро-пиксельную! Это просто шедевр веб-дизайна.',
			timestamp: 'Вчера в 18:10',
		},
	],
};
