<template>
  <div class="user-table">
    <a-table
      class="cash-table"
      size="small"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataSource"
      :scroll="{ x: 1100 }"
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
            column.dataIndex === 'num_cash' ||
            column.dataIndex === 'creatorId' ||
            column.dataIndex === 'contractor' ||
            column.dataIndex === 'cash_item'
          "
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <filter-outlined
          v-else
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'num_cash'">
          <a-typography-paragraph style="color: white; display: flex" copyable>
            {{ record.num_cash }}
          </a-typography-paragraph>
        </template>
        <template v-if="column.dataIndex === 'contractor'">{{
          record.contractor.name
        }}</template>
        <template v-if="column.dataIndex === 'creatorId'">{{
          getUserNameById(record.creatorId)
        }}</template>
        <template v-if="column.dataIndex === 'cash_item'">{{
          record.cash_item.name
        }}</template>
        <template v-if="column.dataIndex === 'company'">{{
          record.company?.name
        }}</template>
        <template v-if="column.dataIndex === 'createdAt'">{{
          getLocaleDateAsString(record.createdAt).split(" ")[0]
        }}</template>
        <template v-if="column.dataIndex === 'sum'">
          <p style="white-space: nowrap">
            {{
              props.currencyOptions.filter(
                (cur) => cur.value === record.currency
              )[0]?.position !== "before"
                ? record.sum
                : ""
            }}
            {{
              props.currencyOptions.filter(
                (cur) => cur.value === record.currency
              )[0]?.label
            }}
            {{
              props.currencyOptions.filter(
                (cur) => cur.value === record.currency
              )[0]?.position === "before"
                ? record.sum
                : ""
            }}
          </p>
        </template>
        <template v-if="column.dataIndex === 'desc'">
          <a-typography-paragraph
            style="color: white; max-width: 400px"
            :ellipsis="{ rows: 1, expandable: true }"
            :content="record.desc"
          >
          </a-typography-paragraph>
          {{
        }}</template>
        <template v-if="column.dataIndex === 'departmentId'">{{
          getDepartmentNameById(record.departmentId, "long")
        }}</template>
        <template v-if="column.dataIndex === 'journal'"> </template>
        <template v-if="column.dataIndex === 'cash_files'">
          <div style="display: flex; flex-direction: column">
            <a
              v-for="(file, index) in record.cash_files"
              :key="file"
              :href="config.API_HOST + 'cash_files/' + '/' + file.name"
              target="_blank"
              rel="noopener noreferrer"
              style="display: inline-block"
              >{{ index + 1 }}) {{ file.name }}</a
            >
          </div>
        </template>
        <template v-if="column.dataIndex === 'cashOrderStatusId'">
          <CashStatus :order="record"></CashStatus>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="order-col buttons">
            <div
              class="pointer"
              v-if="
                record.directorId === $store.state.user.id &&
                record.cash_order_status.id === 4
              "
              :title="$t('modal.ready')"
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
                    fill="#008000"
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
              v-if="
                record.cash_order_status.id === 4 &&
                record.directorId === $store.state.user.id
              "
              @click="confirm(record.id)"
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
          <ScheduleFilled
            style="
              color: lightgreen;
              font-size: 30px;
              display: block;
              margin: auto;
              cursor: pointer;
            "
            @click="showJournalModal(record.id)"
          />
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:visible="cancelModal.visible"
      :title="$t('modal.changingData')"
      :cancelText="' '"
      @ok="handleCancel"
    >
      <a-form name="" :model="cancelModal">
        <a-row justify="space-between">
          <a-col :xs="24">
            <a-form-item>
              <a-textarea
                v-model:value="cancelModal.cancel_reason"
                :placeholder="$t('Укажите причину отмены')"
              >
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="readyModal.visible"
      :title="$t('modal.changingData')"
      :cancelText="' '"
      @ok="handleReady"
    >
      <a-form name="" :model="readyModal">
        <a-row justify="space-between">
          <a-col :xs="24">
            <a-form-item>
              <a-textarea
                v-model:value="readyModal.comment"
                :placeholder="$t('Комментарий (необязательно)')"
              >
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import axios from "axios";
import config from "../../../config";
import { usePagination } from "vue-request";
import { computed, defineComponent, reactive, toRefs } from "vue";
import columns from "@/utils/cash_orders/cashHeadCols";
import getDepartmentNameById from "@/utils/getDepartmentNameById";
import {
  ScheduleFilled,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons-vue";
import getLocaleDateAsString from "@/utils/getLocaleDateAsString";
import getUserNameById from "@/utils/getUserNameById";
import CashStatus from "./CashStatus.vue";
import { message } from "ant-design-vue";
import store from "@/store";

const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/cash/", {
    params,
    headers,
  });
};

export default defineComponent({
  props: {
    currencyOptions: Object,
    issuanOptions: Object,
    contractorTypes: Object,
  },
  components: {
    // ScheduleTwoTone,
    ScheduleFilled,
    CashStatus,
    SearchOutlined,
    FilterOutlined,
  },

  setup(props, { emit }) {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });

    const { data, run, loading, current, pageSize, refresh } = usePagination(
      queryData,
      {
        formatResult: (res) => res.data.cash_orders,
        pagination: {
          currentKey: "page",
          pageSizeKey: "limit",
          totalKey: "data",
        },
      }
    );
    const dataSource = computed(() => data.value?.rows || []);
    const pagination = computed(() => ({
      total: data.value?.count,
      current: current.value,
      pageSize: pageSize.value,
    }));
    const handleTableChange = (pag, filters, sorter) => {
      store.commit("setOrderFilters", filters);
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

    const showJournalModal = (id) => {
      emit("showJournal", dataSource.value.filter((ord) => ord.id === id)[0]);
    };

    const cancelModal = reactive({
      visible: false,
      id: undefined,
      cancel_reason: undefined,
    });

    const readyModal = reactive({
      visible: false,
      id: undefined,
      comment: undefined,
    });

    const confirm = (id) => {
      cancelModal.visible = true;
      cancelModal.id = id;
    };

    const readyConfirm = (id) => {
      readyModal.visible = true;
      readyModal.id = id;
    };

    const handleCancel = () => {
      if (cancelModal.cancel_reason) {
        emit("cancel", {
          id: cancelModal.id,
          cancel_reason: cancelModal.cancel_reason,
          callback: refresh,
        });
        cancelModal.cancel_reason = undefined;
        cancelModal.visible = false;
      } else {
        message.error("Укажите причину отмены");
      }
    };

    const handleReady = () => {
      emit("ready", {
        id: readyModal.id,
        comment: readyModal.comment,
        callback: refresh,
      });
      readyModal.comment = undefined;
      readyModal.visible = false;
    };

    return {
      handleSearch,
      handleReset,
      pagination,
      handleTableChange,
      dataSource,
      loading,
      refresh,
      ...toRefs(state),
      columns,
      getDepartmentNameById,
      config,
      props,
      getLocaleDateAsString,
      getUserNameById,
      showJournalModal,
      confirm,
      cancelModal,
      handleCancel,
      readyModal,
      readyConfirm,
      handleReady,
    };
  },
  computed: {
    companies() {
      return (
        // store.state.companies &&
        // store.state.departments &&
        store.state.cash_statuses
      );
    },
    orderCount() {
      return store.state.totalPurchases;
    },
  },
  watch: {
    companies() {
      this.columns.value = this.columns.map((col) => {
        if (col.dataIndex === "company") {
          col.filters = store.state.companies;
        }
        if (col.dataIndex === "departmentId") {
          col.filters = store.state.departments.map((dep) => {
            return { text: dep.label, value: dep.value };
          });
        }
        if (col.dataIndex === "cashOrderStatusId") {
          col.filters = store.state.cash_statuses.map((dep) => {
            return { text: dep.title_ru, value: dep.id };
          });
        }
        return col;
      });
    },
    orderCount() {
      this.refresh();
    },
  },
});
</script>
