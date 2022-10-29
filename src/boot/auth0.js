import { boot } from "quasar/wrappers";
import { createAuth0 } from "@auth0/auth0-vue";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
	app.use(
		createAuth0({
			domain: import.meta.env.VITE_AUTH0_DOMAIN,
			client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
			redirect_uri: window.location.origin,
		})
	);
});
