<template>
  <div class="orderPageBlock container">
    <CompanyLogo />
    <AddTask v-if="$route.name === 'Tasks'" @setTaskCount="setTaskCount" />
    <div class="task-button-group" style="margin-top: 10px">
      <router-link :to="'/tasks/'" style="margin-right: 10px"
        ><a-button type="primary" :ghost="$route.name !== 'Tasks'">{{
          $t("button.incomeTasks")
        }}</a-button></router-link
      >
      <router-link :to="'/performs/'" style="margin-right: 10px"
        ><a-button type="primary" :ghost="$route.name !== 'Performs'">{{
          $t("button.performs")
        }}</a-button></router-link
      >
      <router-link :to="'/approvals/'"
        ><a-button type="primary" :ghost="$route.name !== 'Approvals'">{{
          $t("button.approvals")
        }}</a-button></router-link
      >
    </div>
    <TaskMonitor v-if="$route.name === 'Tasks'" :taskCount="taskCount" />
    <PerformMonitor v-if="$route.name === 'Performs'" />
    <ApprovalMonitor v-if="$route.name === 'Approvals'" />
  </div>
</template>

<script>
import CompanyLogo from "@/components/CompanyLogo.vue";
import AddTask from "@/components/tasks/AddTask.vue";
import TaskMonitor from "@/components/tasks/TaskMonitor";
import PerformMonitor from "@/components/tasks/PerformMonitor.vue";
import ApprovalMonitor from "@/components/tasks/ApprovalMonitor.vue";
import { ref } from "vue";

export default {
  components: {
    CompanyLogo,
    AddTask,
    TaskMonitor,
    PerformMonitor,
    ApprovalMonitor,
  },
  setup() {
    const taskCount = ref(0);
    const setTaskCount = () => {
      taskCount.value += 1;
    };
    return {
      taskCount,
      setTaskCount,
    };
  },
};
</script>

<style scoped>
@media screen and (max-width: 500px) {
  .task-button-group {
    display: flex;
    flex-direction: column;
  }
  .task-button-group > a + a {
    margin-top: 10px;
  }
}
</style>
