import { defineStore } from "pinia";

export const useStore = defineStore("main", {
	state: () => ({
		name: "",
		email: "",
		level: 0,
		age: 0,
		onboarded: false,
		team: "",
		teamLeader: "",
		teamMembers: [],
		teamHackathons: [],
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
		setTeam(team) {
			this.team = team.name;
			this.teamLeader = team.leader;
			this.teamMembers = team.members;
			this.teamHackathons = team.hackathons;
		},
	},
});
