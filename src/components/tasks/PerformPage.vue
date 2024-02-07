<template>
  <div
    v-if="!$store.state.isLoading"
    style="border-radius: 10px; overflow: hidden"
  >
    <div
      style="
        display: flex;
        justify-content: space-between;
        width: 100%;
        background-color: #013b81;
        padding: 10px;
      "
    >
      <div>
        <h5 style="color: white">{{ $t("title.number") }}: {{ task.num }}</h5>
        <h2 style="color: white">{{ $t("title.theme") }}: {{ task.theme }}</h2>
      </div>
      <div>
        <h5 style="color: white">
          {{ $t("title.created") }}: {{ getLocaleDateAsString(task.createdAt) }}
        </h5>
        <a-select
          v-model:value="status.value"
          style="width: 100%"
          :options="[
            { value: 'process', label: $t('status.onProcess') },
            { value: 'postponed', label: $t('status.postponed') },
            { value: 'checking', label: $t('status.onChecking') },
          ]"
          :disabled="status.loading"
          @change="sendStatus"
        ></a-select>
      </div>
    </div>
    <div
      style="
        background-color: white;
        border: solid 1px #013b81;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        padding: 10px;
      "
    >
      <div v-for="message in task.task_messages" :key="message.id">
        <div
          :class="
            message.user.id === $store.state.user.id
              ? 'message-right-card'
              : 'message-left-card'
          "
        >
          <div class="message-block">
            <div class="message-head">
              <div class="message-head-left">
                <h5>{{ message.user.name }}</h5>
              </div>
              <div class="message-head-rigth">
                <h5>{{ getLocaleDateAsString(message.createdAt) }}</h5>
              </div>
            </div>
            <div class="message-content">
              <h3>{{ message.message }}</h3>
              <span
                v-if="message.task_files.length > 0"
                style="font-weight: bold"
                >{{ $t("title.files") }}:</span
              >
              <div v-for="file in message.task_files" :key="file.name">
                <a-button
                  type="link"
                  :href="config.API_HOST + 'task_files/' + file.name"
                  target="_blank"
                  >{{ file.name }}</a-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="message-type-block">
        <div class="message-type-file">
          <input
            hidden
            @change="getFiles"
            type="file"
            multiple
            id="files"
            accept="application/pdf, image/png,image/jpg, image/jpeg, image/gif, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
          />
          <label class="file-upload" for="files" id="filesLabel">
            <FileAddOutlined style="font-size: 30px; cursor: pointer" />
          </label>
        </div>
        <div class="message-type-input">
          <a-textarea
            v-model:value="message_text"
            show-count
            :maxlength="300"
          />
        </div>
        <div class="message-type-send">
          <a-spin v-if="sending_message" size="large" />
          <SendOutlined
            v-else
            style="font-size: 30px; cursor: pointer"
            @click="sendMessage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import axios from "axios";
import config from "../../../config";
import { defineComponent, onBeforeMount, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import getLocaleDateAsString from "@/utils/getLocaleDateAsString";
import { FileAddOutlined, SendOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default defineComponent({
  components: {
    FileAddOutlined,
    SendOutlined,
  },
  setup() {
    const route = useRoute();
    const task = ref({});
    const files = ref([]);
    const status = reactive({
      value: undefined,
      loading: false,
    });
    const message_text = ref("");
    const sending_message = ref(false);
    const fetchTask = async () => {
      sending_message.value = true;
      // store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/task/perform_retrieve?id=" + route.params.id)
        .then((res) => {
          sending_message.value = false;
          task.value = res.data.task;
          status.value = res.data.task.status;
          store.commit("setIsLoading", false);
        })
        .catch(async (err) => {
          sending_message.value = false;
          store.commit("setIsLoading", false);
          if (
            err.response.data.errors &&
            err.response.data.errors.length !== 0
          ) {
            let errors = "";
            err.response.data.errors.map((error) => [
              (errors += error.msg + " "),
            ]);
            this.error(errors);
          } else {
            this.error(err.response.data.message);
          }
        });
    };

    const getFiles = (e) => {
      files.value = [];
      const filesInput = document.getElementById("filesLabel");
      const allowed_files = [
        "application/pdf",
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/gif",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
      for (const file of e.target.files) {
        if (!allowed_files.includes(file.type.toLowerCase())) {
          message.error(t("modal.errorFile"));
          files.value = [];
          filesInput.style.color = "#db1818";
          filesInput.style.borderColor = "#db1818";
          break;
        } else {
          files.value = [...files.value, file];
          filesInput.style.color = "#72BF44";
          filesInput.style.borderColor = "#72BF44";
        }
      }
    };

    const sendMessage = async () => {
      sending_message.value = true;
      if (message_text.value) {
        // store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        const bodyFormData = new FormData();
        bodyFormData.append("message", message_text.value);
        bodyFormData.append("taskId", task.value.id);
        bodyFormData.append("user_type", "staff");

        for (const file of files.value) {
          bodyFormData.append("task_files", file);
        }

        axios({
          method: "post",
          url: config.API_URL + "api/task/message",
          data: bodyFormData,
        })
          .then(async () => {
            sending_message.value = false;
            // store.commit("setIsLoading", false);

            message_text.value = "";
            files.value = [];
            document.getElementById("filesLabel").style.color = "black";

            fetchTask();
          })
          .catch(async (err) => {
            sending_message.value = false;
            // store.commit("setIsLoading", false);
            if (
              err.response &&
              err.response.data &&
              err.response.data.errors &&
              err.response.data.errors.length !== 0
            ) {
              let errors = "";
              err.response.data.errors.map((error) => {
                errors += error.msg + " ";
              });
              message.error(errors);
            } else {
              console.log(err);
              message.error(err.response.data.message);
            }
          });
      } else {
        fetchTask();
      }
    };

    const sendStatus = async (value) => {
      status.loading = true;
      axios({
        method: "put",
        url: config.API_URL + "api/task/" + value,
        data: { taskId: task.value.id },
      })
        .then(async () => {
          message.success(t("modal.successfullyChanged"));
          status.loading = false;
          status.value = value;
        })
        .catch((e) => {
          message.error(t("modal.errorOnServer"));
          status.loading = false;
          console.log(e);
        });
    };

    onBeforeMount(async () => {
      store.commit("setIsLoading", true);
      await fetchTask();
      store.commit("setIsLoading", false);
    });
    return {
      task,
      getLocaleDateAsString,
      sendMessage,
      message_text,
      getFiles,
      config,
      sendStatus,
      status,
      sending_message,
    };
  },
});
</script>

<style>
.message-left-card {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 10px;
}
.message-right-card {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 10px;
}

.message-left-card .message-block {
  border-radius: 10px;
  border-top-left-radius: 0;
}

.message-right-card .message-block {
  border-radius: 10px;
  border-top-right-radius: 0;
}

.message-block {
  background-color: #abd0fe;
  padding: 5px;
  max-width: 100%;
  overflow: hidden;
}

.message-head {
  display: flex;
  justify-content: space-between;
}

.message-head-left {
  margin-right: 10px;
  font-weight: bold;
}

.message-head-rigth h5 {
  margin: 0;
}

.message-content {
  border-top: solid 1px black;
  width: 100%;
}

.message-type-block {
  margin-top: 10px;
  /* height: 50px; */
  border-radius: 10px;
  background-color: #abd0fe;
  display: flex;
  justify-content: space-between;
}

.message-type-input {
  width: 90%;
  padding: 5px;
}

.message-type-file {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5%;
  min-width: 50px;
}

.message-type-send {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5%;
  min-width: 50px;
}
</style>
