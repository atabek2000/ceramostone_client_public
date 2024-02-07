<template>
  <div class="orderPageBlock container">
    <CompanyLogo />
    <div style="margin: 10px 0px; font-size: 18px">
      <router-link
        :to="
          $route.name === 'Task'
            ? '/tasks/'
            : $route.name === 'Approval'
            ? '/approvals'
            : '/performs/'
        "
        >{{
          $route.name === "Task"
            ? $t("button.incomeTasks") + " /"
            : $route.name === "Approval"
            ? $t("button.approvals") + " /"
            : $t("button.performs") + " /"
        }}</router-link
      >
    </div>
    <TaskPage v-if="$route.name === 'Task' || $route.name === 'Approval'" />
    <PerformPage v-if="$route.name === 'Perform'" />
  </div>
</template>

<script>
import CompanyLogo from "@/components/CompanyLogo.vue";
import TaskPage from "@/components/tasks/TaskPage.vue";
import PerformPage from "@/components/tasks/PerformPage.vue";

export default {
  components: {
    CompanyLogo,
    TaskPage,
    PerformPage,
  },
};
</script>
