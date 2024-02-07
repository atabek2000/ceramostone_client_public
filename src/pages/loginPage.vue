<template>
  <LoginForm />
</template>

<script>
import router from "@/router";
import store from "@/store";
import LoginForm from "../components/LoginForm.vue";
export default {
  components: {
    LoginForm,
  },
  beforeMount() {
    if (this.$store.state.isAuth) {
      if (store.state.user.section?.includes("industry")) {
        router.push({ path: "/industry" });
      } else if (store.state.user.roleId < 6) {
        router.push({ path: "/orders" });
      } else if (store.state.user.roleId >= 6 && store.state.user.roleId < 13) {
        router.push({ path: "/purchases/monitor" });
      } else if (store.state.user.roleId >= 13) {
        router.push({ path: "/logistics/monitor" });
      }
    }
  },
};
</script>

<style></style>
