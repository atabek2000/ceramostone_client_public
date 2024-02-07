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
        <template v-if="column.dataIndex === 'transportStatusId'">
          <TransportStatus :transport="record" />
        </template>
        <template
          v-else-if="column.dataIndex === 'regist_date' && record.regist_date"
        >
          {{ new Date(record.regist_date).toLocaleString().replace(",", "") }}
        </template>
        <template v-if="column.dataIndex == 'action' && !record.depozit_refund">
          <div class="pointer" @click="transportModal(record.id)">
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
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <div style="margin-left: 20px">
          <h2 style="color: white">{{ $t("title.products") }}:</h2>
          <a-table
            :columns="productsColumn"
            :data-source="
              record.transport_products.sort(
                (a, b) =>
                  a.product_purchase.productCategoryId -
                  b.product_purchase.productCategoryId
              )
            "
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex == 'purchase'">
                {{ record.product_purchase.purchase.order_num }} <br />
              </template>
              <template v-if="column.dataIndex == 'productCategoryId'">
                {{ record.product_purchase.product_category.name }}
              </template>
              <template v-if="column.dataIndex == 'productNameId'">
                {{ record.product_purchase.product_article.name }}
              </template>
              <template v-if="column.dataIndex == 'article'">
                {{
                  record.article
                    ? record.article
                    : record.product_purchase.product_article.article
                }}
              </template>
              <template
                v-if="
                  record.sorted === 0 &&
                  (column.dataIndex === 'volumeDefect' ||
                    column.dataIndex === 'volumeRemain' ||
                    column.dataIndex === 'volumeActual')
                "
              >
                {{ $t("table.notSpecified") }}
              </template>
              <template v-else-if="column.dataIndex === 'volumeDefect'">
                {{ record.volumeDefect }}
                {{
                  $store.state.purchaseUnits.filter(
                    (unit) => unit.id === record.defectUnitId
                  )[0]?.short
                }}
              </template>
              <template v-else-if="column.dataIndex === 'volumeRemain'">
                {{ record.volumeRemain }}
                {{
                  $store.state.purchaseUnits.filter(
                    (unit) => unit.id === record.remainUnitId
                  )[0]?.short
                }}
              </template>
              <template v-else-if="column.dataIndex === 'volumeActual'">
                {{ record.volumeActual }}
                {{
                  $store.state.purchaseUnits.filter(
                    (unit) => unit.id === record.actualUnitId
                  )[0]?.short
                }}
              </template>
              <template v-if="column.dataIndex === 'volumePurchase'">
                {{ record.product_purchase.volumePurchase }}
                {{
                  $store.state.purchaseUnits.filter(
                    (unit) => unit.id === record.product_purchase.purchaseUnitId
                  )[0]?.short
                }}
              </template>
              <template v-if="column.dataIndex === 'action'">
                <div
                  v-if="record.on1C === 0"
                  style="cursor: pointer"
                  @click="productModal(record.id)"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_1_128)">
                      <path
                        d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM9.29 16.29L6.7 13.7C6.31 13.31 6.31 12.68 6.7 12.29C7.09 11.9 7.72 11.9 8.11 12.29L10 14.17L15.88 8.29C16.27 7.9 16.9 7.9 17.29 8.29C17.68 8.68 17.68 9.31 17.29 9.7L10.7 16.29C10.32 16.68 9.68 16.68 9.29 16.29Z"
                        fill="#91d5ff"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_128">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </template>
            </template>
          </a-table>
        </div>
        <div v-if="record.transport_files.length > 0" style="margin-left: 20px">
          <h2 style="color: white; margin-top: 20px">
            {{ $t("title.files") }}:
          </h2>
          <a-table
            :columns="filesColumn"
            :data-source="
              record.transport_files.filter(
                (file) => file.type === 'declorant_files'
              )
            "
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'type'">
                <span v-if="record.type === 'declorant_files'">{{
                  $t("content.declarantFiles")
                }}</span>
                <span v-else-if="record.type === 'forward_images'">{{
                  $t("content.forwarderFiles")
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
        </div>
      </template>
    </a-table>
  </div>
  <a-modal
    v-model:visible="formState.modalVisible"
    :title="$t('title.put1C')"
    @ok="productHandleOk"
  >
    {{ $t("modal.want1C") }}
  </a-modal>
  <a-modal
    v-model:visible="transportModalState.modalVisible"
    :title="$t('modal.changingData')"
    @ok="transportHandleOk"
  >
    <a-form :model="transportModalState">
      <a-form-item>
        <a-select
          v-model:value="transportModalState.depozit_refund"
          style="width: 100%"
          :placeholder="$t('placeholder.refundDeposit')"
        >
          <a-select-option value="1">{{ $t("modal.yes") }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { usePagination } from "vue-request";
import {
  computed,
  defineComponent,
  onBeforeMount,
  reactive,
  toRefs,
} from "vue";
import {
  QuestionCircleOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config";
import store from "@/store/index";
import { message, Modal } from "ant-design-vue";
import columns from "@/utils/purchases/purchaseAccountantCols";
import getPayById from "@/utils/getPayById";
import i18n from "@/i18n/i18n";
import getCityById from "@/utils/getCityById";
import getDepartmentNameById from "@/utils/getDepartmentNameById";
import TransportStatus from "../logistics/TransportStatus.vue";
import defineReadyButton from "../../utils/purchases/defineReadyButton";
import getCategoryById from "@/utils/purchases/getCategoryById";
import getArticleById from "@/utils/purchases/getArticleById";

const { t } = i18n.global;

const productsColumn = [
  {
    title: t("table.applicationNumber"),
    dataIndex: "purchase",
  },
  {
    title: t("table.category"),
    dataIndex: "productCategoryId",
  },
  {
    title: t("table.productName"),
    dataIndex: "productNameId",
  },
  {
    title: t("table.article"),
    dataIndex: "article",
  },
  {
    title: t("table.sizes"),
    dataIndex: "size_logistic",
  },
  {
    title: t("table.volumeContract"),
    dataIndex: "volumePurchase",
  },
  {
    title: t("table.actualVolume"),
    dataIndex: "volumeActual",
  },
  {
    title: t("table.forDebiting"),
    dataIndex: "volumeDefect",
  },
  {
    title: t("table.toParish"),
    dataIndex: "volumeRemain",
  },
  {
    title: t("table.action"),
    dataIndex: "action",
  },
];

const filesColumn = [
  {
    title: t("table.type"),
    dataIndex: "type",
  },
  {
    title: t("table.title"),
    dataIndex: "name",
  },
];

const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/logistic/transports", {
    params,
    headers,
  });
};
export default defineComponent({
  components: {
    TransportStatus,
    SearchOutlined,
    FilterOutlined,
  },
  setup() {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });
    const formState = reactive({
      modalVisible: false,
      productId: 0,
    });
    const transportModalState = reactive({
      modalVisible: false,
      productId: 0,
      depozit_refund: undefined,
    });
    const productModal = (id) => {
      formState.modalVisible = true;
      formState.productId = id;
    };
    const transportModal = (id) => {
      transportModalState.modalVisible = true;
      transportModalState.id = id;
    };
    const error = (errorText) => {
      Modal.error({
        title: t("modal.error"),
        content: errorText,
      });
    };
    const productHandleOk = async () => {
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/purchase/product/on_1c", {
          id: formState.productId,
        })
        .then(() => {
          formState.modalVisible = false;
          store.commit("setIsLoading", false);
          message.success(t("modal.successfullyChanged"));
          refresh();
        })
        .catch((err) => {
          store.commit("setIsLoading", false);
          formState.modalVisible = false;
          if (
            err.response.data.errors &&
            err.response.data.errors.length !== 0
          ) {
            let errors = "";
            err.response.data.errors.map((error) => [
              (errors += error.msg + " "),
            ]);
            error(errors);
          } else {
            error(err.response.data.message);
          }
        });
    };
    const transportHandleOk = async () => {
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      console.log(transportModalState);
      await axios
        .put(config.API_URL + "api/logistic/accountant_changes", {
          id: transportModalState.id,
          depozit_refund: transportModalState.depozit_refund,
        })
        .then(() => {
          transportModalState.modalVisible = false;
          store.commit("setIsLoading", false);
          message.success(t("modal.successfullyChanged"));
          refresh();
        })
        .catch((err) => {
          store.commit("setIsLoading", false);
          transportModalState.modalVisible = false;
          if (
            err.response.data.errors &&
            err.response.data.errors.length !== 0
          ) {
            let errors = "";
            err.response.data.errors.map((error) => [
              (errors += error.msg + " "),
            ]);
            error(errors);
          } else {
            error(err.response.data.message);
          }
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
      formatResult: (res) => res.data.transports,
      pagination: {
        currentKey: "page",
        pageSizeKey: "limit",
        totalKey: "data",
      },
    });
    const pagination = computed(() => ({
      total: store.state.totalTransports,
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
        .get(config.API_URL + "api/logistic/transports/count")
        .then((res) => {
          if (res.data.count) {
            store.commit("setTotalTransports", res.data.count);
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
      defineReadyButton,
      getCategoryById,
      getArticleById,
      handleSearch,
      handleReset,
      ...toRefs(state),
      SearchOutlined,
      FilterOutlined,
      productModal,
      formState,
      productHandleOk,
      transportModal,
      transportHandleOk,
      transportModalState,
    };
  },
  computed: {
    orderCount() {
      return store.state.totalTransports;
    },
  },
  watch: {
    orderCount() {
      this.refresh();
    },
  },
});
</script>
