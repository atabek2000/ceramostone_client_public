<template>
  <a-row>
    <a-col :md="10" :xs="24">
      <a-form :model="formState" class="ant-task-form">
        <a-row justify="space-between">
          <a-col :md="11" :xs="24">
            <a-form-item :name="num">
              <a-input
                disabled="true"
                v-model:value="formState.num"
                :placeholder="$t('placeholder.taskNum')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="theme">
              <a-input
                v-model:value="formState.theme"
                :placeholder="$t('placeholder.theme')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="formState.boss_text">
              <a-textarea
                v-model:value="formState.boss_text"
                :placeholder="$t('placeholder.message')"
              />
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item>
              <a-select
                v-model:value="formState.staffs"
                mode="multiple"
                :placeholder="$t('placeholder.performs')"
                max-tag-count="responsive"
                :max-tag-text-length="20"
                :options="$store.state.users"
                :field-names="{ label: 'name', value: 'id' }"
                :filter-option="filterOption"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="deadline">
              <a-date-picker
                v-model:value="formState.deadline"
                value-format="YYYY-MM-DD"
                :placeholder="$t('placeholder.deadline')"
              />
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item>
              <a-select
                :placeholder="$t('placeholder.approver')"
                :options="$store.state.users"
                show-search
                :field-names="{ label: 'name', value: 'id' }"
                v-model:value="formState.approver"
                :filterOption="true"
                :optionFilterProp="'name'"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <div>
              <span><i aria-hidden="true" class="fa fa-lock"></i></span>
              <input
                @change="getFiles"
                type="file"
                multiple
                id="files"
                accept="application/pdf, image/png,image/jpg, image/jpeg, image/gif, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
              />
              <label class="file-upload" for="files" id="filesLabel">{{
                $t("table.files")
              }}</label>
            </div>
          </a-col>
          <a-col :md="24" :xs="24">
            <div class="form-button">
              <button @click="createTask">
                {{ $t("button.makeTask") }}
              </button>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-col :md="4" :xs="24"></a-col>
    <a-col :md="10" :xs="24" class="alert-block">
      <a-row>
        <div>
          <a-alert
            :message="
              $t('status.onProcess') + ': ' + outcoming_report.process_count
            "
            type="info"
            show-icon
          />
        </div>
        <div>
          <a-alert
            :message="
              $t('status.postponed') + ': ' + outcoming_report.postponed_count
            "
            type="error"
            show-icon
          />
        </div>

        <div>
          <a-alert
            :message="
              $t('status.onChecking') + ': ' + outcoming_report.checking_count
            "
            type="warning"
            show-icon
          />
        </div>
        <div>
          <a-alert
            :message="
              $t('status.revision') + ': ' + outcoming_report.revision_count
            "
            type="error"
            show-icon
          />
        </div>
        <div>
          <a-alert
            :message="$t('status.ready') + ': ' + outcoming_report.ready_count"
            type="success"
            show-icon
          />
        </div>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import { onBeforeMount, reactive, ref } from "vue";

import getRoleNameById from "@/utils/getRoleNameById";
import fetchRoles from "@/utils/fetchRoles";
import { message } from "ant-design-vue";
import fetchUsers from "@/utils/fetchUsers";
import store from "@/store";
import config from "../../../config";
import axios from "axios";

import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default {
  setup(props, { emit }) {
    const formState = reactive({
      num:
        new Date().toISOString().split("T")[0] +
        "-" +
        (Math.random() + 1).toString(36).substring(7).toUpperCase(),
      theme: undefined,
      deadline: undefined,
      staffs: undefined,
      boss_text: undefined,
      approver: undefined,
    });

    const outcoming_report = reactive({
      checking_count: 0,
      postponed_count: 0,
      process_count: 0,
      ready_count: 0,
      revision_count: 0,
    });

    const files = ref([]);

    // валидация файлов
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

    const createTask = async () => {
      let error = 0;
      if (
        !formState.num ||
        !formState.theme ||
        !formState.deadline ||
        !formState.staffs ||
        !formState.boss_text ||
        !formState.approver
      ) {
        error = 1;
      }
      if (error) {
        message.error(t("modal.fillFields"));
      } else {
        store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        const bodyFormData = new FormData();
        bodyFormData.append("num", formState.num);
        bodyFormData.append("theme", formState.theme);
        bodyFormData.append("deadline", formState.deadline);
        bodyFormData.append("boss_text", formState.boss_text);
        bodyFormData.append("approver", formState.approver);
        for (const staff of formState.staffs) {
          bodyFormData.append("staffs", staff);
        }
        for (const file of files.value) {
          bodyFormData.append("task_files", file);
        }

        axios({
          method: "post",
          url: config.API_URL + "api/task/create",
          data: bodyFormData,
        })
          .then(async () => {
            store.commit("setIsLoading", false);
            message.success(t("modal.orderSuccessAdded"));

            formState.num =
              new Date().toISOString().split("T")[0] +
              "-" +
              (Math.random() + 1).toString(36).substring(7).toUpperCase();
            formState.theme = undefined;
            formState.deadline = undefined;
            formState.staffs = undefined;
            formState.boss_text = undefined;
            formState.approver = undefined;
            files.value = [];
            await emit("setTaskCount");
          })
          .catch(async (err) => {
            store.commit("setIsLoading", false);
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
      }
    };

    const filterApprover = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    const fetchOutcomingReport = () => {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      axios({
        method: "get",
        url: config.API_URL + "api/task/outcoming_report",
      })
        .then(async (res) => {
          outcoming_report.checking_count = res.data?.checking_count;
          outcoming_report.postponed_count = res.data?.postponed_count;
          outcoming_report.process_count = res.data?.process_count;
          outcoming_report.ready_count = res.data?.ready_count;
          outcoming_report.revision_count = res.data?.revision_count;
        })
        .catch(async (err) => {
          store.commit("setIsLoading", false);
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
    };

    onBeforeMount(async () => {
      await fetchRoles();
      await fetchUsers();
      await fetchOutcomingReport();
    });
    return {
      formState,
      createTask,
      getRoleNameById,
      getFiles,
      filterApprover,
      outcoming_report,
    };
  },
};
</script>

<style scoped>
.ant-task-form .ant-picker,
.ant-task-form input {
  width: 100%;
}
.form-button {
  margin-top: 10px;
}
.form-button button {
  width: 100%;
  background-color: #72bf44;
  height: 35px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
}

.form-button button:active {
  background-color: #4ba517;
}

[type="file"] {
  height: 0;
  overflow: hidden;
  width: 0;
}
[type="file"] + label {
  background: #ffffff;
  border: none;
  border-radius: 5px;
  color: #181734;
  cursor: pointer;
  display: inline-block;
  font-family: "Rubik", sans-serif;
  font-size: inherit;
  font-weight: 500;
  margin-bottom: 1rem;
  outline: none;
  position: relative;
  transition: all 0.3s;
  vertical-align: middle;
  box-sizing: border-box;
  border: 3px dashed #181734;
  border-radius: 10px;
}
[type="file"] + label:hover {
  background-color: #ffffff;
}

label.file-upload {
  width: 100%;
  text-align: center;
  height: 50px;
  padding-top: 10px;
}

@media screen and (max-width: 768px) {
  .alert-block {
    margin-top: 10px;
  }
}
</style>
