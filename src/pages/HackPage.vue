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
    <q-page-sticky
      :offset="[0, 18]"
      position="bottom"
      v-if="store.Red || store.Purple || store.Blue"
    >
      <q-btn
        color="green"
        label="Invite Teammate"
        @click="inviteTeammate"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted, nextTick } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useStore } from "stores/app";
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  getDocsFromServer,
  getDocFromServer,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

export default defineComponent({
  name: "HackPage",

  setup() {
    const store = useStore();
    const $q = useQuasar();
    const router = useRouter();
    const emailVal = ref("");

    const downloaded = ref(false);
    const containerId = "game-container";
    let hackInstance = null;
    const app = initializeApp({
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    });
    const db = getFirestore(app);

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

    const inviteTeammate = () => {
      let room = "";
      if (store.Red) {
        room = "Red";
      }
      if (store.Blue) {
        room = "Blue";
      }
      if (store.Purple) {
        room = "Purple";
      }
      $q.dialog({
        dark: true,
        title: "Find Teammate",
        message: "What is your their email?",
        prompt: {
          filled: true,
          model: emailVal,
          type: "email",
          isValid: (val) =>
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              val
            ),
        },
        cancel: true,
        persistent: true,
      }).onOk(async (data) => {
        console.log("Email:", data);
        await updateDoc(doc(db, "teams", store.team), {
          members: arrayUnion({
            email: data,
            room,
          }),
        });
        await updateDoc(doc(db, "users", data), {
          teams: arrayUnion(store.team),
        });
      });
    };

    return {
      downloaded,
      containerId,
      store,
      inviteTeammate,
    };
  },
});
</script>
