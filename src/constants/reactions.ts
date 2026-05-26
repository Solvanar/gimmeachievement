export type ReactionKey = 'love' | 'fire' | 'hype' | 'gg';

export interface ReactionDef {
	key: ReactionKey;
	label?: string;
	initialCount: number;
	activeClass: string;
}

export const REACTION_DEFS: ReactionDef[] = [
	{ key: 'love', initialCount: 12, activeClass: 'reaction-love' },
	{ key: 'fire', initialCount: 24, activeClass: 'reaction-fire' },
	{ key: 'hype', label: 'Хайп', initialCount: 8, activeClass: 'reaction-hype' },
	{ key: 'gg', label: 'GGWP', initialCount: 15, activeClass: 'reaction-gg' },
];
