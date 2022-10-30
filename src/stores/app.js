import { defineStore } from "pinia";

export const useStore = defineStore("main", {
	state: () => ({
		name: "",
		email: "",
		level: 0,
		age: 0,
		charId: 0,
		onboarded: false,
		team: "",
		teamLeader: "",
		teamMembers: [],
		teamHackathons: [],
		Red: false,
		Blue: false,
		Purple: false,
	}),
	getters: {},
	actions: {
		setUser(user) {
			this.name = user.name;
			this.email = user.email;
			this.level = user.level;
			this.age = user.age;
			this.onboarded = user.onboarded;
			this.charId = user.charId;
		},
		setTeam(team) {
			this.team = team.name;
			this.teamLeader = team.leader;
			this.teamMembers = team.members;
			this.teamHackathons = team.hackathons;
		},
		updateUser(data) {
			this.name = data.name;
			this.age = data.age;
			this.charId = data.charId;
			this.onboarded = true;
		},
	},
});
