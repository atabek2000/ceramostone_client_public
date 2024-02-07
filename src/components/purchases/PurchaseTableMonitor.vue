<template>
  <div class="user-table">
    <a-table
      size="small"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataSource"
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
            column.dataIndex === 'wagon_num_kz' ||
            column.dataIndex === 'product' ||
            column.dataIndex === 'headId' ||
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
        <template v-if="column.dataIndex === 'departmentId'"
          ><span>{{
            getDepartmentNameById(record.purchase.departmentId, "long")
          }}</span></template
        >
        <template v-if="column.dataIndex === 'product'">
          {{ record.product_purchase.product_article.name }} -
          <span
            :style="
              'color:' +
              (getRemainPurchPer(
                record.product_purchase.volumePurchase,
                record.product_purchase.transport_products
              ) >= 100
                ? 'lightgreen'
                : 'orange')
            "
            >{{
              getRemainPurchPer(
                record.product_purchase.volumePurchase,
                record.product_purchase.transport_products
              ) + "%"
            }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'client_name'">
          {{ record.purchase.client_name }}
        </template>
        <template v-if="column.dataIndex === 'size'">
          {{ record.amount_product }}
          {{
            $store.state.purchaseUnits.filter(
              (unit) => unit.id === record.product_purchase.purchaseUnitId
            )[0]?.short
          }}
        </template>
        <template v-if="column.dataIndex === 'send_date'">
          {{
            new Date(record.transport.createdAt)
              .toLocaleString()
              .replace(",", "")
              ?.split(" ")[0]
          }}
        </template>
        <template v-if="column.dataIndex === 'cityId'"
          ><span>{{ getCityById(record.purchase.cityId) }}</span></template
        >
        <template v-if="column.dataIndex === 'wagon_num_kz'"
          ><span>
            <span v-if="record.transport.transport_type == 'ship'">
              <img src="../../assets/transport_boat.svg" alt="" />
            </span>
            <span v-else-if="record.transport.transport_type === 'plane'">
              <img src="../../assets/transport_plane.svg" alt="" />
            </span>
            <span v-else-if="record.transport.transport_type === 'truck'">
              <img src="../../assets/transport_truck.svg" alt="" />
            </span>
            <span v-else>
              <img src="../../assets/transport_van.svg" alt="" />
            </span>
            &nbsp;
            <span :style="!record.transport.wagon_num_kz ? 'color: red' : ''">
              {{
                record.transport.wagon_num_kz
                  ? record.transport.wagon_num_kz
                  : $t("content.notSpecified")
              }}
            </span>
          </span></template
        >
        <template v-if="column.dataIndex === 'headId'"
          ><span>{{ getUserNameById(record.purchase.headId) }}</span>
        </template>
        <template v-if="column.dataIndex === 'countryFrom'"
          ><span>{{ getCountryByCode(record.purchase.countryFrom) }}</span>
        </template>
        <template v-if="column.dataIndex === 'order_num'">
          <span>{{ record.purchase.order_num }} </span>

          <!-- <span
            :style="
              getRemainPurchPer(record.product_purchases) > 95
                ? 'color: lightgreen'
                : 'color: red'
            "
            >{{ getRemainPurchPer(record.product_purchases) }}%</span
          > -->
        </template>
        <template v-if="column.dataIndex === 'location'"
          ><span v-if="record.transport.transport_locations.length > 0">{{
            record.transport.transport_locations[
              record.transport.transport_locations.length - 1
            ]?.name
          }}</span></template
        >
        <template v-if="column.dataIndex === 'arrived'">
          <span style="font-weight: bold">
            {{
              record.arrive_type
                ? record.arrive_type && record.arrive_type === 1
                  ? $t("content.arrived_full")
                  : $t("content.arrived_partially")
                : ""
            }} </span
          ><br />
          {{
            record.arrive_type ? getLocaleDateAsString(record.arrive_time) : ""
          }}
          <br />
          {{
            record.arrive_comment
              ? $t("placeholder.note") + ": " + record.arrive_comment
              : ""
          }}
        </template>
        <template v-if="column.dataIndex === 'purchaseStatusId'">
          <TransportStatus :transport="record.transport" />
        </template>
      </template>
      <!-- <template #expandedRowRender="{ record }">
        <div style="margin: 10px 0px">
          <a-steps status="process">
            <a-step>
              <template #title
                ><span style="color: white">{{
                  $t("status.onApproval")
                }}</span></template
              >
              <template #icon>
                <check-circle-outlined
                  v-if="record.purchaseStatusId > 7"
                  style="color: lightgreen"
                />
                <clock-circle-outlined v-else style="color: #1890ff" />
              </template>
            </a-step>
            <a-step>
              <template #title
                ><span style="color: white">{{
                  $t("button.purchase")
                }}</span></template
              >
              <template v-if="record.purchaseStatusId >= 8" #icon>
                <check-circle-outlined
                  v-if="record.purchaseStatusId > 8"
                  style="color: lightgreen"
                />
                <clock-circle-outlined
                  v-else-if="record.purchaseStatusId == 8"
                  style="color: #1890ff"
                />
              </template>
            </a-step>
            <a-step>
              <template #title
                ><span style="color: white">{{
                  $t("status.onWay")
                }}</span></template
              >
              <template v-if="record.purchaseStatusId >= 9" #icon>
                <check-circle-outlined
                  v-if="record.purchaseStatusId > 11"
                  style="color: lightgreen"
                />
                <clock-circle-outlined
                  v-else-if="record.purchaseStatusId <= 11"
                  style="color: #1890ff"
                />
              </template>
            </a-step>
            <a-step>
              <template #title
                ><span style="color: white">{{
                  $t("status.stock")
                }}</span></template
              >
              <template v-if="record.purchaseStatusId >= 12" #icon>
                <check-circle-outlined
                  v-if="record.purchaseStatusId > 12"
                  style="color: lightgreen"
                />
                <clock-circle-outlined
                  v-else-if="record.purchaseStatusId == 12"
                  style="color: #1890ff"
                />
              </template>
            </a-step>
            <a-step>
              <template #title
                ><span style="color: white">{{
                  $t("status.accounting")
                }}</span></template
              >
              <template v-if="record.purchaseStatusId >= 13" #icon>
                <check-circle-outlined
                  v-if="record.purchaseStatusId > 13"
                  style="color: lightgreen"
                />
                <clock-circle-outlined
                  v-else-if="record.purchaseStatusId == 13"
                  style="color: #1890ff"
                />
              </template>
            </a-step>
            <a-step>
              <template #title
                ><span style="color: white">{{
                  $t("status.ready")
                }}</span></template
              >
              <template v-if="record.purchaseStatusId == 14" #icon>
                <check-circle-outlined style="color: lightgreen" />
              </template>
            </a-step>
          </a-steps>
        </div>
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
                <template v-if="column.dataIndex == 'product_on_way'">
                  {{
                    record.transport_products
                      .filter((tr_pr) => tr_pr.arrived === 0)
                      .reduce((total, obj) => obj.amount_product + total, 0) +
                    " " +
                    $store.state.purchaseUnits.filter(
                      (unit) => unit.id === record.purchaseUnitId
                    )[0]?.short
                  }}
                </template>
                <template v-if="column.dataIndex == 'product_arrival'">
                  {{
                    record.transport_products
                      .filter((tr_pr) => tr_pr.arrived === 1)
                      .reduce((total, obj) => obj.amount_product + total, 0) +
                    " " +
                    $store.state.purchaseUnits.filter(
                      (unit) => unit.id === record.purchaseUnitId
                    )[0]?.short
                  }}
                </template>
              </template>
            </a-table>
          </template>
          <template v-if="record.purchase_files.length > 0">
                        <h2 style="color: white;margin-top: 20px;">Файлы: </h2>
                        <a-table :columns="filesColumn" :data-source="record.purchase_files" :pagination="false">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.dataIndex === 'type'">
                                    <span v-if="record.type === 'purchase_files'">Файлы руководителя</span>
                                    <span v-else-if="record.type === 'provider_files'">Файлы поставщика</span>
                                    <span v-else-if="record.type === 'paid_files'">Файлы оплаты</span>
                                </template>
                                <template v-else-if="column.dataIndex === 'name'">
                                    <a :href="config.API_HOST+record.type+'/'+record.name" target="_blank">{{record.name}} </a>
                                </template>
                            </template>
                        </a-table>
                    </template>
        </div>
      </template> -->
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
  // CheckCircleOutlined,
  // ClockCircleOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config";
import store from "@/store/index";
import { Modal, message } from "ant-design-vue";
import columns from "@/utils/purchases/purchaseMonitorCols";
import getPayById from "@/utils/getPayById";
import i18n from "@/i18n/i18n";
import getCityById from "@/utils/getCityById";
import getDepartmentNameById from "@/utils/getDepartmentNameById";
// import PurchaseStatus from './PurchaseStatus.vue';
import defineCancelButton from "../../utils/purchases/defineCancelButton";
import defineReadyButton from "../../utils/purchases/defineReadyButton";
import getCategoryById from "@/utils/purchases/getCategoryById";
import getArticleById from "@/utils/purchases/getArticleById";
import getRemainPer from "@/utils/purchases/getRemainPer";
import TransportStatus from "../logistics/TransportStatus.vue";
import getLocaleDate from "@/utils/getLocaleDateFromISO";
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
    title: t("table.onWay"),
    dataIndex: "product_on_way",
  },
  {
    title: t("table.received"),
    dataIndex: "product_arrival",
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

  return axios.get(config.API_URL + "api/logistic/transport_products", {
    params,
    headers,
  });
};
export default defineComponent({
  components: {
    // PurchaseStatus,
    SearchOutlined,
    // CheckCircleOutlined,
    FilterOutlined,
    // ClockCircleOutlined,
    TransportStatus,
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

    const getRemainPurchPer = (volume, trans_products) => {
      try {
        let products_sum = 0;
        for (const trans_product of trans_products) {
          products_sum += Number(trans_product.amount_product);
        }

        const per = (100 / Number(volume)) * products_sum;
        return per > 98 ? 100 : per.toFixed(0);
      } catch (e) {
        console.log(e);
        return 0;
      }
    };

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
    const dataSource = computed(() => data.value?.products.rows || []);
    const pagination = computed(() => ({
      total: data.value?.products.count,
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

    const getLocaleDateAsString = (iso) => {
      const ldt = getLocaleDate(iso);
      return (
        ldt.date[0] +
        "-" +
        ldt.date[1] +
        "-" +
        ldt.date[2] +
        " " +
        ldt.time[0] +
        ":" +
        ldt.time[1] +
        ":" +
        ldt.time[2]
      );
    };

    onBeforeMount(async () => {
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/purchase/monitor_count")
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
      getRemainPurchPer,
      getRemainPer,
      getLocaleDateAsString,
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
