<template>
  <q-page class="flex flex-center column">
    <p class="abel text-h3 text-white text-center">Welcome to the <span class="text-primary">Hackathons4Us</span>!</p>
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

<style lang="sass">
.abel
  font-family: "4Mini"
</style>
