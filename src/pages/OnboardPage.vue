<template>
  <q-page>
    <q-carousel
      v-model="slide"
      transition-prev="jump-right"
      transition-next="jump-left"
      swipeable
      animated
      control-color="indigo"
      control-type="push"
      navigation
      padding
      arrows
      height="100vh"
      class="bg-grey text-white"
    >
      <q-carousel-slide
        name="intro"
        class="column no-wrap flex-center"
      >
        <q-icon
          name="live_tv"
          size="56px"
        />
        <div class="q-mt-md text-center">
          To put intro here with animated character
        </div>
      </q-carousel-slide>
      <q-carousel-slide
        name="about"
        class="column no-wrap flex-center"
      >
        <q-icon
          name="layers"
          size="56px"
        />
        <div class="q-mt-lg q-mb-lg text-center">
          To take details here
        </div>
        <q-btn
          no-caps
          push
          color="orange"
          text-color="blue"
          label="Hiya!"
          @click="profileName"
        />
      </q-carousel-slide>
      <q-carousel-slide
        name="style"
        class="column no-wrap flex-center"
      >
        <div class="text-center">
          This is your user avatar!
        </div>
        <q-avatar
          rounded
          size="10rem"
          color="positive"
          class="q-mt-lg q-mb-lg"
        >
          <img :src="svg">
        </q-avatar>
      </q-carousel-slide>
      <q-carousel-slide
        name="outro"
        class="column no-wrap flex-center"
      >
        <q-icon
          name="terrain"
          size="56px"
        />
        <div class="q-mt-lg q-mb-lg text-center">
          Pleasure getting to know you, {{nameVal || "friend"}}
        </div>
        <q-btn
          no-caps
          push
          color="positive"
          text-color="purple"
          label="To Dashboard"
          @click="finisher"
        />
      </q-carousel-slide>
    </q-carousel>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "stores/app";
import { useQuasar } from "quasar";
import { createAvatar } from "@dicebear/avatars";
import * as identicon from "@dicebear/avatars-identicon-sprites";
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

export default defineComponent({
  name: "OnboardPage",

  setup() {
    const slide = ref("intro");
    const nameVal = ref("");
    const ageVal = ref("");
    const $q = useQuasar();
    const store = useStore();
    const router = useRouter();
    const app = initializeApp({
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    });
    const db = getFirestore(app);
    const svg = ref(
      createAvatar(identicon, {
        seed: store.email,
        dataUri: true,
      })
    );

    const profileName = () => {
      let aboutName = $q.notify({
        message: "Feel free to use your first name, full name or a nickname!",
        timeout: 0,
        color: "dark",
        position: "bottom",
        classes: "center",
      });
      $q.dialog({
        dark: true,
        title: "Create Profile",
        message: "What is your first name?",
        prompt: {
          filled: true,
          model: nameVal,
          type: "text",
          isValid: (val) =>
            /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g.test(val),
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          console.log("Name:", data);
          profileAge();
        })
        .onDismiss(() => {
          aboutName();
        });
    };

    const profileAge = () => {
      let aboutAge = $q.notify({
        message: "For demographic purposes only :)",
        timeout: 0,
        color: "dark",
        position: "bottom",
        classes: "center",
      });
      $q.dialog({
        dark: true,
        title: "Create Profile",
        message: "What is your age?",
        prompt: {
          filled: true,
          model: ageVal,
          type: "number",
          isValid: (val) => val > 0 && val < 100,
        },
        persistent: true,
      })
        .onOk((data) => {
          console.log("Age:", data);
        })
        .onDismiss(() => {
          aboutAge();
        });
    };

    const finisher = async () => {
      if (nameVal.value && ageVal.value) {
        try {
          await updateDoc(doc(db, "users", store.email), {
            name: nameVal.value,
            age: parseInt(ageVal.value, 10),
            onboarded: true,
          });
          router.push({
            name: "Dashboard",
          });
        } catch (e) {
          console.log(e.message);
        }
      } else {
        $q.notify({
          message: "Please finish setting up your profile first...",
          timeout: 1500,
          progress: true,
          color: "dark",
        });
      }
    };

    return {
      slide,
      svg,
      profileName,
      nameVal,
      finisher,
    };
  },
});
</script>

<style lang="sass">
.center
  text-align: center
</style>
