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
          <div>
            <svg
              class="pointer"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              @click="confirm(record.id)"
            >
              <g clip-path="url(#clip0_1_263)">
                <path
                  d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V9C18 7.9 17.1 7 16 7H8C6.9 7 6 7.9 6 9V19ZM18 4H15.5L14.79 3.29C14.61 3.11 14.35 3 14.09 3H9.91C9.65 3 9.39 3.11 9.21 3.29L8.5 4H6C5.45 4 5 4.45 5 5C5 5.55 5.45 6 6 6H18C18.55 6 19 5.55 19 5C19 4.45 18.55 4 18 4Z"
                  fill="#ff0000"
                  fill-opacity="1"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_1_263">
                  <rect width="24" height="24" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
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
                  -
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
                  >
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
  h,
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
import { Modal } from "ant-design-vue";
import columns from "@/utils/purchases/purchaseAdminCols";
import colors from "@/utils/colors";
import getDateDiff from "@/utils/getDateDiff";
import getPayById from "@/utils/getPayById";
import i18n from "@/i18n/i18n";
import getCityById from "@/utils/getCityById";
import getDepartmentNameById from "@/utils/getDepartmentNameById";
import PurchaseStatus from "./PurchaseStatus.vue";
import getCategoryById from "@/utils/purchases/getCategoryById";
import getArticleById from "@/utils/purchases/getArticleById";
import getRemainPer from "@/utils/purchases/getRemainPer";
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
  setup() {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });

    const confirm = (orderId) => {
      Modal.confirm({
        title: t("modal.deletingOrder"),
        icon: createVNode(ExclamationCircleOutlined),
        content: t("modal.wantDeleteOrder"),
        okText: t("modal.yes"),
        cancelText: t("modal.cancel"),
        onOk() {
          deleteOrder(orderId);
        },
      });
    };
    const success = () => {
      Modal.success({
        title: t("modal.success"),
        content: h("p", t("modal.userSuccessDeleted")),
      });
    };
    const error = (errorText) => {
      Modal.error({
        title: t("modal.error"),
        content: errorText,
      });
    };
    const deleteOrder = async (orderId) => {
      store.commit("setIsLoading", true);
      try {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios
          .delete(config.API_URL + "api/purchase/" + orderId)
          .then(() => {
            success();
            refresh();
          });
      } catch (e) {
        console.log(e);
        error(e.message);
      }
      store.commit("setIsLoading", false);
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
      colors,
      QuestionCircleOutlined,
      getDateDiff,
      getPayById,
      productsColumn,
      filesColumn,
      getCityById,
      getDepartmentNameById,
      getCategoryById,
      getArticleById,
      handleSearch,
      handleReset,
      ...toRefs(state),
      SearchOutlined,
      FilterOutlined,
      getRemainPer,
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
