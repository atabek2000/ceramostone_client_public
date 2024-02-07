<template>
  <div
    class="noselect"
    :style="'display: flex; justify-content: center;'"
    @click="showReason"
  >
    <div
      :style="
        'display: flex;border-radius: 20px; align-items: center; padding: 5px 10px; color: ' +
        status_color[status].color +
        '; background-color: ' +
        status_color[status].bg_color +
        (status === 'revision' ? ';cursor: pointer;' : '')
      "
    >
      <!-- у кассира -->
      <svg
        v-if="status === 'process'"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_1_434)">
          <path
            d="M13.26 3C8.17003 2.86 4.00003 6.95 4.00003 12H2.21003C1.76003 12 1.54003 12.54 1.86003 12.85L4.65003 15.65C4.85003 15.85 5.16003 15.85 5.36003 15.65L8.15003 12.85C8.46003 12.54 8.24003 12 7.79003 12H6.00003C6.00003 8.1 9.18003 4.95 13.1 5C16.82 5.05 19.95 8.18 20 11.9C20.05 15.81 16.9 19 13 19C11.39 19 9.90003 18.45 8.72003 17.52C8.32003 17.21 7.76003 17.24 7.40003 17.6C6.98003 18.02 7.01003 18.73 7.48003 19.09C9.00003 20.29 10.91 21 13 21C18.05 21 22.14 16.83 22 11.74C21.87 7.05 17.95 3.13 13.26 3ZM12.75 8C12.34 8 12 8.34 12 8.75V12.43C12 12.78 12.19 13.11 12.49 13.29L15.61 15.14C15.97 15.35 16.43 15.23 16.64 14.88C16.85 14.52 16.73 14.06 16.38 13.85L13.5 12.14V8.74C13.5 8.34 13.16 8 12.75 8Z"
            fill="orange"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_434">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <!-- у координатора -->
      <svg
        v-else-if="status === 'postponed'"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_1_473)">
          <path
            d="M11 7H13V9H11V7ZM12 17C12.55 17 13 16.55 13 16V12C13 11.45 12.55 11 12 11C11.45 11 11 11.45 11 12V16C11 16.55 11.45 17 12 17ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
            fill="#FF2800"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_473">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <!-- у начальника -->
      <svg
        v-else-if="status === 'checking'"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_1_455)">
          <path
            d="M8 2C6.9 2 6 2.9 6 4V7.17C6 7.7 6.21 8.21 6.59 8.59L10 12L6.58 15.42C6.21 15.8 6 16.31 6 16.84V20C6 21.1 6.9 22 8 22H16C17.1 22 18 21.1 18 20V16.84C18 16.31 17.79 15.8 17.42 15.43L14 12L17.41 8.6C17.79 8.22 18 7.71 18 7.18V4C18 2.9 17.1 2 16 2H8ZM16 16.5V19C16 19.55 15.55 20 15 20H9C8.45 20 8 19.55 8 19V16.5L12 12.5L16 16.5ZM12 11.5L8 7.5V5C8 4.45 8.45 4 9 4H15C15.55 4 16 4.45 16 5V7.5L12 11.5Z"
            fill="#29AB87"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_455">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <!-- готово -->

      <svg
        v-else-if="status === 'ready'"
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
        v-else-if="status === 'revision'"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_1_177)">
          <path
            d="M18.65 8.35L15.86 11.14C15.54 11.46 15.76 12 16.21 12H18C18 15.31 15.31 18 12 18C11.21 18 10.44 17.85 9.75003 17.56C9.39003 17.41 8.98003 17.52 8.71003 17.79C8.20003 18.3 8.38003 19.16 9.05003 19.43C9.96003 19.8 10.96 20 12 20C16.42 20 20 16.42 20 12H21.79C22.24 12 22.46 11.46 22.14 11.15L19.35 8.36C19.16 8.16 18.84 8.16 18.65 8.35V8.35ZM6.00003 12C6.00003 8.69 8.69003 6 12 6C12.79 6 13.56 6.15 14.25 6.44C14.61 6.59 15.02 6.48 15.29 6.21C15.8 5.7 15.62 4.84 14.95 4.57C14.04 4.2 13.04 4 12 4C7.58003 4 4.00003 7.58 4.00003 12H2.21003C1.76003 12 1.54003 12.54 1.86003 12.85L4.65003 15.64C4.85003 15.84 5.16003 15.84 5.36003 15.64L8.15003 12.85C8.46003 12.54 8.24003 12 7.79003 12H6.00003V12Z"
            fill="#fa484e"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_177">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <div style="margin: 0 5px; font-size: 12px">
        {{ status_color[status].text }}
      </div>
    </div>
  </div>
  <a-modal v-model:visible="reasonVisible" @ok="showReasonOk" :cancelText="' '">
    <template #title>{{ $t("modal.revisionReason") }}:</template>
    <p>{{ revision_text }}</p>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from "vue";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default defineComponent({
  props: {
    task: Object,
  },
  components: {
    // QuestionCircleOutlined,
  },
  setup(props) {
    const reasonVisible = ref(false);
    const showReason = () => {
      if (props.task.status === "revision") {
        reasonVisible.value = true;
      }
    };
    const showReasonOk = () => {
      reasonVisible.value = false;
    };
    const status_color = {
      process: {
        text: t("status.onProcess"),
        color: "black",
        bg_color: "#fff9ba",
      },
      postponed: {
        text: t("status.postponed"),
        color: "black",
        bg_color: "#FFA07A",
      },
      checking: {
        text: t("status.onChecking"),
        color: "black",
        bg_color: "#abff65",
      },
      revision: {
        text: t("status.revision"),
        color: "black",
        bg_color: "#ffb2b2",
      },
      ready: {
        text: t("status.ready"),
        color: "black",
        bg_color: "#52bf90",
      },
    };
    return {
      status: props.task.status,
      revision_text: props.task.approver_text || "",
      showReason,
      reasonVisible,
      showReasonOk,
      status_color,
    };
  },
});
</script>

<style></style>
