<template>
  <div
    class="noselect"
    :style="'display: flex; justify-content: center; width: 200px'"
    @click="showReason"
  >
    <div
      :style="
        'display: flex;border-radius: 20px; align-items: center; padding: 5px 10px; color: black; background-color:' +
        status.color.bg +
        (status.visibleResaon ? ';cursor: pointer;' : '')
      "
    >
      <div>
        <!-- готово -->
        <svg
          v-if="statusId == 5"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1_209)">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM9.29 16.29L5.7 12.7C5.31 12.31 5.31 11.68 5.7 11.29C6.09 10.9 6.72 10.9 7.11 11.29L10 14.17L16.88 7.29C17.27 6.9 17.9 6.9 18.29 7.29C18.68 7.68 18.68 8.31 18.29 8.7L10.7 16.29C10.32 16.68 9.68 16.68 9.29 16.29Z"
              :fill="status.color.txt"
            />
          </g>
          <defs>
            <clipPath id="clip0_1_209">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <!-- на складе -->
        <svg
          v-else-if="statusId == 4"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1_113)">
            <path
              d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM13 17H8C7.45 17 7 16.55 7 16C7 15.45 7.45 15 8 15H13C13.55 15 14 15.45 14 16C14 16.55 13.55 17 13 17ZM16 13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13ZM16 9H8C7.45 9 7 8.55 7 8C7 7.45 7.45 7 8 7H16C16.55 7 17 7.45 17 8C17 8.55 16.55 9 16 9Z"
              :fill="status.color.txt"
            />
          </g>
          <defs>
            <clipPath id="clip0_1_113">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <!-- прибыл в город -->
        <svg
          v-else-if="statusId == 3"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1_3526)">
            <path
              d="M12 11C10.67 11 8 11.67 8 13V13.16C8.97 14.28 10.4 15 12 15C13.6 15 15.03 14.28 16 13.16V13C16 11.67 13.33 11 12 11ZM12 10C13.1 10 14 9.1 14 8C14 6.9 13.1 6 12 6C10.9 6 10 6.9 10 8C10 9.1 10.9 10 12 10ZM12 2C16.2 2 20 5.22 20 10.2C20 13.38 17.55 17.12 12.66 21.43C12.28 21.76 11.71 21.76 11.33 21.43C6.45 17.12 4 13.38 4 10.2C4 5.22 7.8 2 12 2Z"
              :fill="status.color.txt"
            />
          </g>
          <defs>
            <clipPath id="clip0_1_3526">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <!-- в пути -->
        <svg
          v-else
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1_3213)">
            <path
              d="M12 2C7.58 2 4 2.5 4 6V15.5C4 17.43 5.57 19 7.5 19L6.35 20.15C6.04 20.46 6.26 21 6.71 21H17.3C17.75 21 17.97 20.46 17.65 20.15L16.5 19C18.43 19 20 17.43 20 15.5V6C20 2.5 16.42 2 12 2ZM7.5 17C6.67 17 6 16.33 6 15.5C6 14.67 6.67 14 7.5 14C8.33 14 9 14.67 9 15.5C9 16.33 8.33 17 7.5 17ZM11 11H6V6H11V11ZM16.5 17C15.67 17 15 16.33 15 15.5C15 14.67 15.67 14 16.5 14C17.33 14 18 14.67 18 15.5C18 16.33 17.33 17 16.5 17ZM18 11H13V6H18V11Z"
              :fill="status.color.txt"
            />
          </g>
          <defs>
            <clipPath id="clip0_1_3213">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <div style="margin: 0 5px; font-size: 12px">
        {{ status.statusName }}
      </div>
    </div>
  </div>
  <a-modal v-model:visible="reasonVisible" @ok="showReasonOk" :cancelText="' '">
    <template #title>{{ status.titleReason }}:</template>
    <p>{{ status.txtReason }}</p>
  </a-modal>
</template>

<script>
import store from "@/store";
import getStatusById from "@/utils/logistics/getStatusById";
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    transport: Object,
  },
  components: {},
  setup(props) {
    const reasonVisible = ref(false);
    const status = getStatusById({
      roleId: store.state.user.roleId,
      transport: props.transport,
    });
    const showReason = () => {
      if (status.visibleResaon) {
        reasonVisible.value = true;
      }
    };
    const showReasonOk = () => {
      reasonVisible.value = false;
    };
    return {
      statusId: props.transport.transportStatusId,
      status,
      showReason,
      reasonVisible,
      showReasonOk,
    };
  },
});
</script>

<style></style>
