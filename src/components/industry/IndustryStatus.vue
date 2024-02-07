<template>
  <div
    class="noselect"
    :style="'display: flex; justify-content: center;'"
    @click="showReason"
  >
    <div
      :style="
        'display: flex;border-radius: 20px; align-items: center; padding: 5px 10px; color: ' +
        status.color.txt +
        '; background-color:' +
        status.color.bg +
        (status.visibleResaon ? ';cursor: pointer;' : '')
      "
    >
      <!-- у директора -->
      <svg
        v-if="statusId == 2"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_1_113)">
          <path
            d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM13 17H8C7.45 17 7 16.55 7 16C7 15.45 7.45 15 8 15H13C13.55 15 14 15.45 14 16C14 16.55 13.55 17 13 17ZM16 13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13ZM16 9H8C7.45 9 7 8.55 7 8C7 7.45 7.45 7 8 7H16C16.55 7 17 7.45 17 8C17 8.55 16.55 9 16 9Z"
            fill="#00ce06"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_113">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <!-- У начальника -->
      <svg
        v-if="statusId == 4"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_1_113)">
          <path
            d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM13 17H8C7.45 17 7 16.55 7 16C7 15.45 7.45 15 8 15H13C13.55 15 14 15.45 14 16C14 16.55 13.55 17 13 17ZM16 13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13ZM16 9H8C7.45 9 7 8.55 7 8C7 7.45 7.45 7 8 7H16C16.55 7 17 7.45 17 8C17 8.55 16.55 9 16 9Z"
            fill="#00ce06"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_113">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <!-- в работе -->
      <svg
        v-else-if="statusId == 6"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_1_170)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.54 15.85L15.85 16.54C15.46 16.93 14.83 16.93 14.44 16.54L11.39 13.49C10.17 13.92 8.75 13.66 7.77 12.68C6.66 11.57 6.47 9.89 7.18 8.58L9.53 10.93L10.94 9.52L8.58 7.17C9.9 6.46 11.57 6.65 12.68 7.76C13.66 8.74 13.92 10.16 13.49 11.38L16.54 14.43C16.93 14.82 16.93 15.46 16.54 15.85Z"
            fill="#fbc200"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_170">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <!-- На складе -->
      <svg
        v-else-if="statusId == 7"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_1_633)">
          <path
            d="M18 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H6C4.9 3 4 3.9 4 5V20C4 21.1 4.9 22 6 22H12.11C11.52 21.43 11.04 20.75 10.69 20H6V5H8V6C8 7.1 8.9 8 10 8H14C15.1 8 16 7.1 16 6V5H18V10.08C18.71 10.18 19.38 10.39 20 10.68V5C20 3.9 19.1 3 18 3ZM12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5ZM17 12C14.24 12 12 14.24 12 17C12 19.76 14.24 22 17 22C19.76 22 22 19.76 22 17C22 14.24 19.76 12 17 12ZM18.29 19L16.64 17.35C16.55 17.26 16.49 17.13 16.49 17V14.51C16.49 14.23 16.71 14.01 16.99 14.01C17.27 14.01 17.49 14.23 17.49 14.51V16.8L18.99 18.3C19.19 18.5 19.19 18.81 18.99 19.01C18.8 19.2 18.49 19.2 18.29 19Z"
            fill="#212121"
            fill-opacity="0.6"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_633">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <!-- готово -->
      <svg
        v-else-if="statusId == 9"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_1_209)">
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM9.29 16.29L5.7 12.7C5.31 12.31 5.31 11.68 5.7 11.29C6.09 10.9 6.72 10.9 7.11 11.29L10 14.17L16.88 7.29C17.27 6.9 17.9 6.9 18.29 7.29C18.68 7.68 18.68 8.31 18.29 8.7L10.7 16.29C10.32 16.68 9.68 16.68 9.29 16.29Z"
            fill="#317256"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_209">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <!-- отмена -->
      <svg
        v-else-if="status.visibleResaon"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_1_431)">
          <path
            d="M13.89 8.7L12 10.59L10.11 8.7C9.72 8.31 9.09 8.31 8.7 8.7C8.31 9.09 8.31 9.72 8.7 10.11L10.59 12L8.7 13.89C8.31 14.28 8.31 14.91 8.7 15.3C9.09 15.69 9.72 15.69 10.11 15.3L12 13.41L13.89 15.3C14.28 15.69 14.91 15.69 15.3 15.3C15.69 14.91 15.69 14.28 15.3 13.89L13.41 12L15.3 10.11C15.69 9.72 15.69 9.09 15.3 8.7C14.91 8.32 14.27 8.32 13.89 8.7ZM12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
            fill="#fa484e"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_431">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <div style="margin: 0 5px; font-size: 12px">
        {{
          $store.state.orderStatuses.filter((st) => st.value == statusId)[0]
            ?.text
        }}
      </div>
    </div>

    <!-- <div v-if="status.visibleResaon">
      <QuestionCircleOutlined :style="'color: ' + status.color.txt" />
    </div> -->
  </div>
  <a-modal v-model:visible="reasonVisible" @ok="showReasonOk" :cancelText="' '">
    <template #title>{{ status.titleReason }}:</template>
    <p>{{ status.txtReason }}</p>
  </a-modal>
</template>

<script>
import store from "@/store";
// import { QuestionCircleOutlined } from "@ant-design/icons-vue";
import getStatusById from "@/utils/industry/getStatusById";
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    order: Object,
  },
  components: {
    // QuestionCircleOutlined,
  },
  setup(props) {
    const reasonVisible = ref(false);
    const status = getStatusById({
      roleId: store.state.user.roleId,
      order: props.order,
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
      statusId: props.order.industryOrderStatusId,
      status,
      showReason,
      reasonVisible,
      showReasonOk,
    };
  },
});
</script>

<style></style>
