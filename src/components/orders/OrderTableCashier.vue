<template>
  <div class="user-table">
    <a-table
      sticky
      size="small"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataSource"
      :scroll="{ x: 960 }"
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
            column.dataIndex === 'num_act' ||
            column.dataIndex === 'managerId' ||
            column.dataIndex === 'num_1c' ||
            column.dataIndex === 'reciever'
          "
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <filter-outlined
          v-else
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'managerId'">
          {{ $store.getters.getManagerById(record.managerId) }}
        </template>
        <template v-if="column.dataIndex === 'depId'">
          {{ depName(record.num_act.match(/[a-zA-Z]/)[0], "by_short") }}
        </template>
        <template v-if="column.dataIndex == 'num_act'">
          <span>{{ record.num_act }}</span>
          <span
            v-if="record.paid_type"
            :style="
              'color:' +
              colors.light.dark +
              ';background:' +
              colors.light.secondary +
              ';padding: 1px; border-radius:2px;'
            "
            >{{ getPayById(record.paid_type) }}</span
          >
          <p
            v-if="record.order_updates.length > 0"
            style="color: red; cursor: pointer"
            @click="showUpdates(record.order_updates)"
          >
            {{ $t("modal.changed") }}: {{ record.order_updates.length }}
          </p>
        </template>
        <template v-if="column.dataIndex === 'reciever'">
          <span style="white-space: nowrap">{{ record.reciever }}</span>
        </template>
        <template v-if="column.dataIndex === 'orderStatusId'">
          <OrderStatus :order="record" />
        </template>
        <template v-if="column.dataIndex === 'word'">
          <a :href="config.API_HOST + 'word/' + record.word" target="_blank">{{
            record.word
          }}</a>
        </template>

        <template v-else-if="column.dataIndex === 'excel'">
          <a
            :href="config.API_HOST + 'excel/' + record.excel"
            target="_blank"
            >{{ record.excel }}</a
          >
        </template>

        <template v-if="column.dataIndex === 'date'">
          <span style="white-space: nowrap">{{ record.date }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'term'">
          <span style="white-space: nowrap">{{ record.term }}</span>
        </template>

        <template v-if="column.dataIndex === 'action'">
          <div class="order-col buttons">
            <div
              class="pointer"
              v-if="
                defineReadyButton(
                  $store.state.user.roleId,
                  record.orderStatusId
                )
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
              class="pointer"
              v-if="
                defineCancelButton(
                  $store.state.user.roleId,
                  record.orderStatusId
                )
              "
              :title="$t('modal.ready')"
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
</template>
<script>
import { usePagination } from "vue-request";
import { computed, defineComponent, createVNode, reactive, ref } from "vue";
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config.js";
import store from "@/store/index";
import { Modal, message } from "ant-design-vue";
import defineCancelButton from "@/utils/defineCancelButton";
import defineReadyButton from "@/utils/defineReadyButton";
import columns from "@/utils/orders/orderCashierCols";
import colors from "@/utils/colors";
import OrderStatus from "./OrderStatus.vue";
import getPayById from "@/utils/getPayById";
import depName from "@/utils/getDepartmentNameById";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;

const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/order/", {
    params,
    headers,
  });
};
export default defineComponent({
  components: {
    OrderStatus,
    SearchOutlined,
    FilterOutlined,
  },
  setup(props, { emit }) {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });
    const cancel_reason = ref("");
    const masterFormState = reactive({
      masterId: 0,
      datePicker: ref(),
    });
    const cancelConfirm = (orderId) => {
      Modal.confirm({
        title: t("modal.cancellingOrder"),
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode("textarea", {
          onChange: (e) => {
            cancel_reason.value = e.target.value;
          },
        }),
        okText: t("modal.yes"),
        cancelText: t("modal.cancel"),
        onOk() {
          if (cancel_reason.value == "") {
            message.error(t("modal.cancelReason"));
          } else {
            emit("onCancel", orderId, cancel_reason.value, refresh);
          }
        },
      });
    };
    const readyConfirm = (orderId) => {
      Modal.confirm({
        title: t("modal.changingOrderStatus"),
        icon: createVNode(ExclamationCircleOutlined),
        content: t("modal.wantChangeOrder"),
        okText: t("modal.yes"),
        cancelText: t("modal.cancel"),
        onOk() {
          emit("onReady", {
            orderId,
            masterId: masterFormState.masterId,
            datePicker: masterFormState.datePicker,
            refreshTable: refresh,
          });
        },
      });
    };

    const showUpdates = (updates) => {
      emit("showUpdates", updates);
    };

    const { data, run, loading, current, pageSize, refresh } = usePagination(
      queryData,
      {
        formatResult: (res) => res.data.orders,
        pagination: {
          currentKey: "page",
          pageSizeKey: "limit",
          totalKey: "data",
        },
      }
    );
    const dataSource = computed(() => data.value?.rows || []);
    const pagination = computed(() => ({
      total: data.value?.count || store.state.totalOrders,
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
    return {
      dataSource,
      pagination,
      loading,
      columns,
      handleTableChange,
      cancelConfirm,
      refresh,
      config,
      defineCancelButton,
      defineReadyButton,
      readyConfirm,
      masterFormState,
      colors,
      getPayById,
      handleSearch,
      handleReset,
      showUpdates,
      depName,
    };
  },
  computed: {
    orderCount() {
      return store.state.totalOrders;
    },
    managerChange() {
      return store.state.managers;
    },
  },
  watch: {
    orderCount() {
      this.refresh();
    },
    managerChange() {
      this.columns[0].filters = store.state.managers?.map((manager) => {
        return { text: manager.name, value: manager.id };
      });
    },
  },
});
</script>
