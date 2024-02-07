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
        <SearchOutlined
          v-if="
            column.dataIndex === 'num_cash' ||
            column.dataIndex === 'contractor' ||
            column.dataIndex === 'cash_item'
          "
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <FilterOutlined
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
          <div
            class="order-col buttons"
            style="display: flex; justify-content: space-around"
          >
            <div
              v-if="
                record.cash_order_status.id === 2 &&
                record.creatorId === $store.state.user.id
              "
              @click="confirm(record.id)"
            >
              <svg
                class="pointer"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1_263)">
                  <path
                    d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V9C18 7.9 17.1 7 16 7H8C6.9 7 6 7.9 6 9V19ZM18 4H15.5L14.79 3.29C14.61 3.11 14.35 3 14.09 3H9.91C9.65 3 9.39 3.11 9.21 3.29L8.5 4H6C5.45 4 5 4.45 5 5C5 5.55 5.45 6 6 6H18C18.55 6 19 5.55 19 5C19 4.45 18.55 4 18 4Z"
                    fill="#ff0000"
                    fill-opacity="1"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_263">
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
  </div>
</template>
<script>
import axios from "axios";
import config from "../../../config";
import { usePagination } from "vue-request";
import { computed, defineComponent, reactive, ref, toRefs } from "vue";
import columns from "@/utils/cash_orders/cashCreatorCols";
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

    const confirm = (id) => {
      cancelModal.visible = true;
      cancelModal.id = id;
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

    return {
      handleSearch,
      handleReset,
      pagination,
      handleTableChange,
      dataSource,
      loading,
      refresh,
      ...toRefs(state),
      columns: ref(columns),
      getDepartmentNameById,
      config,
      props,
      getLocaleDateAsString,
      getUserNameById,
      showJournalModal,
      confirm,
      cancelModal,
      handleCancel,
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
