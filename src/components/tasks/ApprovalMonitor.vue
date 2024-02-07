<template>
  <div class="user-table">
    <a-table
      size="small"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataSource"
      :scroll="{ x: 1200 }"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template
        #customFilterDropdown="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
      >
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="$t('placeholder.search')"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="
              (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
            "
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            <template #icon><SearchOutlined></SearchOutlined></template>
            {{ $t("placeholder.search") }}
          </a-button>
          <a-button
            size="small"
            style="width: 90px"
            @click="handleReset(clearFilters)"
          >
            {{ $t("button.reset") }}
          </a-button>
        </div>
      </template>
      <template #customFilterIcon="{ filtered, column }">
        <search-outlined
          v-if="
            column.dataIndex === 'order_num' ||
            column.dataIndex === 'client_name'
          "
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <filter-outlined
          v-else
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'num'">
          <router-link :to="'/approval/' + record.id">{{
            record.num
          }}</router-link>
        </template>
        <template v-if="column.dataIndex === 'theme'">
          <router-link :to="'/approval/' + record.id">
            {{ record.theme }}
          </router-link>
        </template>
        <template v-if="column.dataIndex === 'deadline'">
          {{ getLocaleDateAsString(record.deadline).split(" ")[0] }}
        </template>
        <template v-if="column.dataIndex === 'performs'">
          <p v-for="perform in record.task_performs" :key="perform.id">
            {{ perform.user.name }}
          </p>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <TaskStatus :task="record"></TaskStatus>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="order-col buttons">
            <div
              v-if="record.status === 'checking'"
              class="pointer"
              @click="readyConfirm(record.id)"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1_281)">
                  <path
                    d="M9.00012 16.2L5.50012 12.7C5.11012 12.31 4.49012 12.31 4.10012 12.7C3.71012 13.09 3.71012 13.71 4.10012 14.1L8.29012 18.29C8.68012 18.68 9.31012 18.68 9.70012 18.29L20.3001 7.70001C20.6901 7.31001 20.6901 6.69001 20.3001 6.30001C19.9101 5.91001 19.2901 5.91001 18.9001 6.30001L9.00012 16.2Z"
                    fill="lightgreen"
                    fill-opacity="1"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_281">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div
              v-if="record.status === 'checking'"
              class="pointer"
              @click="cancelConfirm(record.id)"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1_432)">
                  <path
                    d="M13.89 8.7L12 10.59L10.11 8.7C9.72 8.31 9.09 8.31 8.7 8.7C8.31 9.09 8.31 9.72 8.7 10.11L10.59 12L8.7 13.89C8.31 14.28 8.31 14.91 8.7 15.3C9.09 15.69 9.72 15.69 10.11 15.3L12 13.41L13.89 15.3C14.28 15.69 14.91 15.69 15.3 15.3C15.69 14.91 15.69 14.28 15.3 13.89L13.41 12L15.3 10.11C15.69 9.72 15.69 9.09 15.3 8.7C14.91 8.32 14.27 8.32 13.89 8.7ZM12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                    fill="#ef670c"
                    fill-opacity="1"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_431">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </template>
      </template>
    </a-table>
  </div>

  <a-modal
    v-model:visible="ready_modal.visible"
    :title="$t('modal.wantChangeOrder')"
    @ok="setReady"
  >
  </a-modal>
  <a-modal
    v-model:visible="cancel_modal.visible"
    :title="$t('modal.wantChangeOrder')"
    @ok="setRevision"
  >
    <a-row justify="space-between">
      <a-col :md="24" :xs="24">
        <a-form-item :name="cancel_text">
          <a-textarea
            v-model:value="cancel_modal.cancel_text"
            :placeholder="$t('Причина доработки')"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import { usePagination } from "vue-request";
import { computed, defineComponent, reactive, toRefs } from "vue";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons-vue";
import axios from "axios";
// import store from "@/store/index";
import columns from "@/utils/tasks/approvalMonitorCols";
import getLocaleDateAsString from "@/utils/getLocaleDateAsString";
import TaskStatus from "@/components/tasks/TaskStatus.vue";

import config from "../../../config";
import { message } from "ant-design-vue";
import store from "@/store";

import i18n from "@/i18n/i18n";
const { t } = i18n.global;

const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/task/approval_list", {
    params,
    headers,
  });
};

export default defineComponent({
  components: {
    SearchOutlined,
    FilterOutlined,
    TaskStatus,
  },
  setup() {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });

    const ready_modal = reactive({
      visible: false,
      taskId: undefined,
    });
    const cancel_modal = reactive({
      visible: false,
      cancel_text: undefined,
      taskId: undefined,
    });
    const { data, run, loading, current, pageSize, refresh } = usePagination(
      queryData,
      {
        formatResult: (res) => res.data,
        pagination: {
          currentKey: "page",
          pageSizeKey: "limit",
          totalKey: "data",
        },
      }
    );
    const dataSource = computed(() => data.value?.rows || []);
    const pagination = computed(() => ({
      total: data.value?.count || 100,
      current: current.value,
      pageSize: pageSize.value,
    }));
    const handleTableChange = (pag, filters, sorter) => {
      run({
        limit: pag.pageSize,
        page: pag?.current,
        sortBy: sorter.field,
        sortType: sorter.order === "ascend" ? "ASC" : "DESC",
        ...filters,
      });
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      state.searchText = selectedKeys[0];
      state.searchedColumn = dataIndex;
    };
    const handleReset = (clearFilters) => {
      clearFilters({
        confirm: true,
      });
      state.searchText = "";
    };

    const readyConfirm = (id) => {
      ready_modal.visible = true;
      ready_modal.taskId = id;
    };
    const cancelConfirm = (id) => {
      cancel_modal.visible = true;
      cancel_modal.taskId = id;
    };

    const setReady = async () => {
      store.commit("setIsLoading", true);
      axios({
        method: "put",
        url: config.API_URL + "api/task/ready",
        data: {
          taskId: ready_modal.taskId,
        },
      })
        .then(async () => {
          message.success(t("modal.statusSuccessChanged"));
          store.commit("setIsLoading", false);
          ready_modal.taskId = undefined;
          ready_modal.visible = false;
          refresh();
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

    const setRevision = async () => {
      if (!cancel_modal.cancel_text) {
        message.error(t("modal.fillFields"));
        return false;
      }
      store.commit("setIsLoading", true);
      axios({
        method: "put",
        url: config.API_URL + "api/task/revision",
        data: {
          taskId: cancel_modal.taskId,
          revision_text: cancel_modal.cancel_text,
        },
      })
        .then(async () => {
          message.success(t("modal.statusSuccessChanged"));
          store.commit("setIsLoading", false);
          cancel_modal.cancel_text = undefined;
          cancel_modal.taskId = undefined;
          cancel_modal.visible = false;
          refresh();
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

    return {
      dataSource,
      pagination,
      loading,
      handleTableChange,
      handleSearch,
      handleReset,
      refresh,
      ...toRefs(state),
      columns,
      getLocaleDateAsString,
      cancelConfirm,
      readyConfirm,
      ready_modal,
      cancel_modal,
      setRevision,
      setReady,
    };
  },
});
</script>

<style></style>
