<template>
  <q-page class="flex flex-center column">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
    <br>
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
