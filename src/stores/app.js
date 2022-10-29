import { defineStore } from "pinia";

export const useStore = defineStore("main", {
	state: () => ({
		name: "",
		email: "",
		level: 0,
		age: 0,
		onboarded: false,
	}),
	getters: {},
	actions: {
		setUser(user) {
			this.name = user.name;
			this.email = user.email;
			this.level = user.level;
			this.age = user.age;
			this.onboarded = user.onboarded;
		},
	},
});
