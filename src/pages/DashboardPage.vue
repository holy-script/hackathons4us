<template>
  <q-page class="flex flex-center text-white abel column">
    <h1>Hello, {{store.name}}!</h1>
    <br>
    <q-select
      filled
      v-model="selected"
      multiple
      :options="hackathons"
      label="Choose Hackathons"
      style="width: 250px"
      :disable="!hackathons.length"
      behavior="dialog"
      class="bg-white"
    />
    <br>
    <q-btn
      label="Hack!"
      color="secondary"
      @click="createTeam"
      :disable="!hackathons.length"
    />
    <br>
    <div
      class="q-pa-md bg-white rounded-borders"
      style="max-width: 350px"
    >
      <q-list bordered>
        <q-expansion-item
          group="teams"
          header-class="text-primary"
          v-for="(team, index) in teams"
          :key="index"
          :label="team.name"
        >
          <q-card>
            <q-card-section>
              {{team.leader}}
            </q-card-section>
            <q-card-section>
              <q-btn
                label="Delete"
                color="red"
              />
              &nbsp;&nbsp;
              <q-btn
                label="Open"
                color="orange"
                @click="openTeam(team)"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { useStore } from "stores/app";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
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
  name: "DashboardPage",

  setup() {
    const store = useStore();
    const $q = useQuasar();
    const router = useRouter();
    const app = initializeApp({
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    });
    const db = getFirestore(app);

    const selected = ref([]);
    const teamVal = ref("");

    const hackathons = ref([]);
    const teams = ref([]);

    onMounted(async () => {
      const hackDocs = await (
        await getDocsFromServer(query(collection(db, "hackathons")))
      ).docs;
      for (let doc of hackDocs) {
        hackathons.value.push(doc.id);
      }
      const teamList = await (
        await getDocFromServer(doc(db, "users", store.email))
      ).data().teams;
      for (let teamName of teamList) {
        const team = await (
          await getDocFromServer(doc(db, "teams", teamName))
        ).data();
        teams.value.push(team);
      }
    });

    const createTeam = () => {
      if (selected.value.length) {
        let aboutTeam = $q.notify({
          message: "Please choose a unique name!",
          timeout: 0,
          color: "dark",
          position: "bottom",
          classes: "center",
        });
        $q.dialog({
          dark: true,
          title: "Create Team",
          message: "What do you want to call your team?",
          prompt: {
            filled: true,
            model: teamVal,
            maxlength: 15,
            type: "text",
            isValid: (val) => /^[A-Za-z0-9_-]*$/g.test(val),
          },
          cancel: true,
          persistent: true,
        })
          .onOk(async () => {
            console.log("Team Name:", teamVal.value);
            try {
              const teamDoc = await getDocFromServer(
                doc(db, "teams", teamVal.value)
              );
              if (teamDoc.exists()) {
                $q.notify({
                  message:
                    "Team already exists, please choose a different team name",
                  color: "dark",
                  progress: true,
                });
              } else {
                try {
                  await setDoc(doc(db, "teams", teamVal.value), {
                    leader: store.email,
                    members: [store.email],
                    hackathons: selected.value,
                    name: teamVal.value,
                  });
                  teams.value.push({
                    leader: store.email,
                    members: [store.email],
                    hackathons: selected.value,
                    name: teamVal.value,
                  });
                  await updateDoc(doc(db, "users", store.email), {
                    teams: arrayUnion(teamVal.value),
                  });
                  $q.notify({
                    message: "Team successfully created!",
                    color: "dark",
                    progress: true,
                  });
                  selected.value = [];
                  teamVal.value = "";
                } catch (e) {
                  console.log(e.message);
                }
              }
            } catch (e) {
              console.log(e.message);
            }
          })
          .onDismiss(() => {
            aboutTeam();
          });
      } else {
        $q.notify({
          message: "Please choose at least 1 hackathon to take part in...",
          color: "dark",
          progress: true,
        });
      }
    };

    const openTeam = (team) => {
      store.setTeam(team);
      router.push({
        path: `hack/${team.name}`,
      });
    };

    return {
      store,
      hackathons,
      selected,
      createTeam,
      teams,
      openTeam,
    };
  },
});
</script>
