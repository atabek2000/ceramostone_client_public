<template>
  <div>
    <img src="../assets/logo_dark.png" width="300" alt="logo" />
  </div>
  <div
    v-if="
      ($store.state.user.roleId == 2 && $route.path == '/orders') ||
      ($store.state.user.roleId == 6 && $route.path == '/purchases')
    "
  ></div>
  <div v-else>
    <h2>{{ $t("title.hello") }}, {{ $store.state.user.name }}</h2>
    <!-- <span class="hello-text"
      >{{ $t("title.hello") }}, {{ $store.state.user.name }}</span
    > -->
  </div>
</template>

<script>
export default {};
</script>
