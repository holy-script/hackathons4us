<template>
  <q-btn
    v-if="!isLoading"
    label="Start"
    color="primary"
    @click="auth"
  />
</template>

<script>
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  name: "AuthHandler",

  setup() {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

    const auth = () => {
      isAuthenticated.value
        ? console.log("Already logged in, push to Dashboard")
        : loginWithRedirect();
    };

    return {
      auth,
      isLoading,
    };
  },
});
</script>
