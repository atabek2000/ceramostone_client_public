<template>
  <div class="container">
    <CompanyLogo />
    <AddUser v-if="$store.state.user.roleId == 1" />
    <UserTable />
  </div>
</template>

<script>
import AddUser from "../components/AddUser.vue";
import UserTable from "@/components/UserTable.vue";
import CompanyLogo from "@/components/CompanyLogo.vue";
import fetchRoles from "@/utils/fetchRoles";

export default {
  components: {
    AddUser,
    UserTable,
    CompanyLogo,
  },
  methods: {},
  beforeMount() {
    fetchRoles();
  },
};
</script>

<style></style>
