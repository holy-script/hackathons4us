<template>
  <q-layout>
    <q-page-container>
      <router-view />
      <LogoutHandler />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import LogoutHandler from "components/LogoutHandler.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    LogoutHandler,
  },

  setup() {
    return {};
  },
});
</script>
