export interface RankTier {
	readonly threshold: number;
	readonly label: string;
}

export const RANK_TIERS: readonly RankTier[] = [
	{ threshold: 10, label: 'Золотой Искатель' },
	{ threshold: 6, label: 'Серебряный Искатель' },
	{ threshold: 3, label: 'Бронзовый Искатель' },
	{ threshold: 1, label: 'Искатель' },
	{ threshold: 0, label: 'Новичок' },
];

export function rankForUnlocked(unlockedCount: number): string {
	const tier = RANK_TIERS.find(
		(rankTier) => unlockedCount >= rankTier.threshold,
	);

	return tier?.label ?? 'Новичок';
}
