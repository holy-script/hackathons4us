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
  getDocFromServer,
} from "firebase/firestore";

export default defineComponent({
  name: "AuthHandler",

  setup() {
    const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
    const router = useRouter();
    const store = useStore();
    const app = initializeApp({
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    });
    const db = getFirestore(app);

    const auth = async () => {
      if (isAuthenticated.value) {
        try {
          const userDoc = await getDocFromServer(
            doc(db, "users", user.value.email)
          );
          if (userDoc.exists()) {
            store.setUser(userDoc.data());
            router.push({
              name: store.onboarded ? "Dashboard" : "Onboard",
            });
          } else {
            try {
              const data = {
                name: user.value.name,
                email: user.value.email,
                level: 0,
                age: 0,
                onboarded: false,
              };
              await setDoc(doc(db, "users", user.value.email), data);
              store.setUser(data);
              router.push({
                name: "Onboard",
              });
            } catch (e) {
              console.log(e.message);
            }
          }
        } catch (e) {
          console.log(e.message);
        }
      } else {
        loginWithRedirect();
      }
    };

    return {
      auth,
      isLoading,
    };
  },
});
</script>
