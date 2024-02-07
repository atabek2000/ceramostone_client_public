<template>
  <div class="user-table">
    <a-table
      size="small"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataSource"
      :scroll="{ x: 720 }"
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
            column.dataIndex === 'client_name' ||
            column.dataIndex === 'headId'
          "
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <filter-outlined
          v-else
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'cityId'"
          ><span>{{ getCityById(record.cityId) }}</span></template
        >
        <template v-if="column.dataIndex === 'paid'"
          ><span>{{
            record.paid === 0
              ? $t("content.no")
              : record.paid === 1
              ? $t("content.fully")
              : record.paid === 2
              ? $t("content.byAdvance")
              : $t("button.byAgreement")
          }}</span></template
        >
        <template v-if="column.dataIndex === 'departmentId'"
          ><span>{{
            getDepartmentNameById(record.departmentId, "long")
          }}</span></template
        >
        <template v-if="column.dataIndex === 'headId'"
          ><span>{{ getUserNameById(record.headId) }}</span>
        </template>
        <template v-if="column.dataIndex === 'countryFrom'"
          ><span>{{ getCountryByCode(record.countryFrom) }}</span>
        </template>
        <template v-if="column.dataIndex === 'purchaseStatusId'">
          <PurchaseStatus :purchase="record" />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="order-col buttons">
            <div
              v-if="
                defineCancelButton(
                  $store.state.user.roleId,
                  record.purchaseStatusId,
                  $store.state.user.id
                ) && $store.state.user.id === record.analystId
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
            <div
              class="pointer"
              v-if="
                defineReadyButton(
                  $store.state.user.roleId,
                  record.purchaseStatusId
                ) && $store.state.user.id === record.analystId
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
          </div>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <div style="margin-left: 20px">
          <template v-if="record.product_purchases.length > 0">
            <h2 style="color: white">{{ $t("title.products") }}:</h2>
            <a-table
              :columns="productsColumn"
              :data-source="record.product_purchases"
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex == 'productCategoryId'">
                  {{ getCategoryById(record.productCategoryId) }}
                </template>
                <template v-if="column.dataIndex == 'productArticleId'">
                  {{ getArticleById(record.productArticleId) }}
                </template>
                <template v-if="column.dataIndex == 'volumePurchase'">
                  <span>{{
                    record.volumePurchase +
                    " " +
                    (record.volumePurchase
                      ? $store.state.purchaseUnits.filter(
                          (unit) => unit.id === record.purchaseUnitId
                        )[0]?.short
                      : "")
                  }}</span>
                  <!-- -
                  <span
                    :style="
                      getRemainPer(
                        record.volumePurchase,
                        record.transport_products
                      ) > 95
                        ? 'color: lightgreen'
                        : 'color: red'
                    "
                    >{{
                      getRemainPer(
                        record.volumePurchase,
                        record.transport_products
                      )
                    }}%</span
                  > -->
                </template>
                <template v-if="column.dataIndex == 'volumeStock'">
                  {{
                    record.volumeStock
                      ? record.volumeStock +
                        " " +
                        $store.state.purchaseUnits.filter(
                          (unit) => unit.id === record.purchaseUnitId
                        )[0]?.short
                      : ""
                  }}
                </template>
                <template v-if="column.dataIndex == 'volumeWay'">
                  {{
                    record.volumeWay +
                    " " +
                    (record.volumeWay
                      ? $store.state.purchaseUnits.filter(
                          (unit) => unit.id === record.purchaseUnitId
                        )[0]?.short
                      : "")
                  }}
                </template>
              </template>
            </a-table>
          </template>
          <template v-if="record.purchase_files.length > 0">
            <h2 style="color: white; margin-top: 20px">
              {{ $t("title.files") }}:
            </h2>
            <a-table
              :columns="filesColumn"
              :data-source="record.purchase_files"
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'type'">
                  <span v-if="record.type === 'purchase_files'">{{
                    $t("table.headFiles")
                  }}</span>
                  <span v-else-if="record.type === 'provider_files'">{{
                    $t("table.providerFiles")
                  }}</span>
                  <span v-else-if="record.type === 'paid_files'">{{
                    $t("table.paymentFiles")
                  }}</span>
                </template>
                <template v-else-if="column.dataIndex === 'name'">
                  <a
                    :href="config.API_HOST + record.type + '/' + record.name"
                    target="_blank"
                    >{{ record.name }}
                  </a>
                </template>
              </template>
            </a-table>
          </template>
        </div>
      </template>
    </a-table>
  </div>
</template>
<script>
import { usePagination } from "vue-request";
import {
  computed,
  defineComponent,
  createVNode,
  ref,
  reactive,
  toRefs,
  onBeforeMount,
} from "vue";
import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config";
import store from "@/store/index";
import { Modal, message } from "ant-design-vue";
import columns from "@/utils/purchases/purchaseAnalystCols";
import getPayById from "@/utils/getPayById";
import i18n from "@/i18n/i18n";
import getCityById from "@/utils/getCityById";
import getDepartmentNameById from "@/utils/getDepartmentNameById";
import PurchaseStatus from "./PurchaseStatus.vue";
import defineReadyButton from "../../utils/purchases/defineReadyButton";
import defineCancelButton from "../../utils/purchases/defineCancelButton";
import getCategoryById from "@/utils/purchases/getCategoryById";
import getArticleById from "@/utils/purchases/getArticleById";
import getUserNameById from "@/utils/getUserNameById";
import getCountryByCode from "@/utils/getCountryByCode";

const { t } = i18n.global;

const productsColumn = [
  {
    title: t("table.category"),
    dataIndex: "productCategoryId",
  },
  {
    title: t("table.article"),
    dataIndex: "productArticleId",
  },
  {
    title: t("table.sizes"),
    dataIndex: "size",
  },
  {
    title: t("table.sizesBag"),
    dataIndex: "volumePurchase",
  },
  {
    title: t("table.sizesEx"),
    dataIndex: "volumeStock",
  },
  {
    title: t("table.stockNote"),
    dataIndex: "stockNote",
  },
  {
    title: t("table.volumeTransit"),
    dataIndex: "volumeWay",
  },
  {
    title: t("table.wayNote"),
    dataIndex: "wayNote",
  },
];

const filesColumn = [
  {
    title: t("table.type"),
    dataIndex: "type",
  },
  {
    title: t("table.name"),
    dataIndex: "name",
  },
];

const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/purchase/", {
    params,
    headers,
  });
};
export default defineComponent({
  components: {
    PurchaseStatus,
    SearchOutlined,
    FilterOutlined,
  },

  setup(props, { emit }) {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });

    const cancel_reason = ref("");
    const confirm = (orderId) => {
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
          emit("onReady", { orderId, refreshTable: refresh });
        },
      });
    };
    const {
      data: dataSource,
      run,
      loading,
      current,
      pageSize,
      refresh,
    } = usePagination(queryData, {
      formatResult: (res) => res.data.orders,
      pagination: {
        currentKey: "page",
        pageSizeKey: "limit",
        totalKey: "data",
      },
    });
    const pagination = computed(() => ({
      total: store.state.totalPurchases,
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

    onBeforeMount(async () => {
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/purchase/count")
        .then((res) => {
          if (res.data.count) {
            store.commit("setSetTotalPurchases", res.data.count);
          }
          store.commit("setIsLoading", false);
        })
        .catch((err) => {
          {
            console.log(err);
            store.commit("setIsLoading", false);
          }
        });
    });

    return {
      dataSource,
      pagination,
      loading,
      columns,
      handleTableChange,
      confirm,
      refresh,
      config,
      QuestionCircleOutlined,
      getPayById,
      productsColumn,
      filesColumn,
      getCityById,
      getDepartmentNameById,
      defineCancelButton,
      defineReadyButton,
      readyConfirm,
      getCategoryById,
      getArticleById,
      handleSearch,
      handleReset,
      ...toRefs(state),
      SearchOutlined,
      FilterOutlined,
      getUserNameById,
      getCountryByCode,
    };
  },
  computed: {
    orderCount() {
      return store.state.totalPurchases;
    },
  },
  watch: {
    orderCount() {
      this.refresh();
    },
  },
});
</script>
