import { authGuard } from "@auth0/auth0-vue";

const routes = [
	{
		path: "/",
		component: () => import("layouts/MainLayout.vue"),
		children: [
			{
				name: "Home",
				path: "",
				component: () => import("pages/IndexPage.vue"),
			},
			{
				name: "Onboard",
				beforeEnter: authGuard,
				path: "welcome",
				component: () => import("pages/OnboardPage.vue"),
			},
			{
				name: "Dashboard",
				beforeEnter: authGuard,
				path: "dash",
				component: () => import("pages/DashboardPage.vue"),
			},
			{
				name: "Hack",
				beforeEnter: authGuard,
				path: "hack/:team",
				component: () => import("pages/HackPage.vue"),
			},
		],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		name: "Error",
		path: "/:catchAll(.*)*",
		component: () => import("pages/ErrorNotFound.vue"),
	},
];

export default routes;
