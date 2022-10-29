<template>
  <q-page class="flex flex-center column">
    <div
      :id="containerId"
      v-if="downloaded"
      class="fixed-center"
    >
    </div>
    <div
      class="placeholder"
      v-else
    >
      <q-spinner-hourglass
        color="warning"
        size="4em"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted, nextTick } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useStore } from "stores/app";

export default defineComponent({
  name: "HackPage",

  setup() {
    const store = useStore();
    const $q = useQuasar();
    const router = useRouter();

    const downloaded = ref(false);
    const containerId = "game-container";
    let hackInstance = null;

    onMounted(async () => {
      const hack = await import("../core/hack");
      downloaded.value = true;
      nextTick(() => {
        hackInstance = hack.launch(containerId);
      });
    });

    onUnmounted(() => {
      hackInstance?.destroy(false, false);
    });

    return {
      downloaded,
      containerId,
    };
  },
});
</script>
