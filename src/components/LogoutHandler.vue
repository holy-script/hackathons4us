<template>
  <q-page-sticky
    position="top-left"
    :offset="[18, 18]"
  >
    <q-btn
      v-if="isAuthenticated"
      color="primary"
      icon="logout"
      @click="logout"
    />
  </q-page-sticky>
</template>

<script>
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  name: "LogoutHandler",

  setup() {
    const { isAuthenticated, logout } = useAuth0();

    return {
      isAuthenticated,
      logout,
    };
  },
});
</script>
