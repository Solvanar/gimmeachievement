import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface UserProfile {
	username: string;
	gamerTag: string;
	avatar: string;
	bio: string;
	rank: string;
	joinDate: string;
}

const DEFAULT_PROFILE: UserProfile = {
	username: 'Никита Кодер',
	gamerTag: 'Nik_Devel_99',
	avatar:
		'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200&h=200',
	bio: 'Коллекционер редких жизненных ачивок, гик, любитель ретро игр и крепкого эспрессо. Ищу единомышленников!',
	rank: 'Золотой Искатель',
	joinDate: 'Июль 2025',
};

export const useProfileStore = defineStore('profile', () => {
	const profile = ref<UserProfile>({ ...DEFAULT_PROFILE });

	return { profile };
});
