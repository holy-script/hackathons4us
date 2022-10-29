<template>
  <q-page class="flex flex-center">
    <h1>Hello, world!</h1>
    <h6>{{store.name}}</h6>
    <h6>{{store.email}}</h6>
    <h6>{{store.age}}</h6>
    <h6>{{store.level}}</h6>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useStore } from "stores/app";

export default defineComponent({
  name: "DashboardPage",

  setup() {
    const store = useStore();

    return {
      store,
    };
  },
});
</script>
