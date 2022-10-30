<template>
  <q-layout>
    <q-page-container>
      <router-view />
      <LogoutHandler />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import LogoutHandler from "components/LogoutHandler.vue";
import { Howl } from "howler";

export default defineComponent({
  name: "MainLayout",

  components: {
    LogoutHandler,
  },

  setup() {
    onMounted(() => {
      let sound = new Howl({
        src: "/sounds/background.mp3",
        autoplay: true,
        loop: true,
        volume: 0.5,
        onend: function () {
          console.log("Finished!");
        },
      });
    });
    return {};
  },
});
</script>

<style lang="sass">
@font-face
  font-family: "4Mini"
  src: local("4Mini"), url(/fonts/4Mini.ttf) format("truetype")

body
  background-image: url(/images/background-image.jpg)
  background-repeat: no-repeat
  background-size: cover
</style>
