<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
    <AuthHandler />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import AuthHandler from "components/AuthHandler.vue";

export default defineComponent({
  name: "IndexPage",

  components: {
    AuthHandler,
  },

  setup() {
    return {};
  },
});
</script>
