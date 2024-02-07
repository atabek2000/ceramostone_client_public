<template>
  <div class="user-table">
    <a-table
      size="small"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataSource"
      :scroll="{ x: 1600 }"
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
        <template
          v-if="column.dataIndex === 'wagon_num_kz' && record.wagon_num_kz"
        >
          {{ record.wagon_num_kz }}
        </template>
        <template
          v-if="column.dataIndex === 'promotion_date' && record.promotion_date"
        >
          {{
            new Date(record.promotion_date).toLocaleString().replace(",", "")
          }}
        </template>
        <template
          v-if="column.dataIndex === 'status_arrived' && record.status_arrived"
        >
          {{
            new Date(record.status_arrived).toLocaleString().replace(",", "")
          }}
        </template>
        <template
          v-if="column.dataIndex === 'regist_date' && record.regist_date"
        >
          {{ new Date(record.regist_date).toLocaleString().replace(",", "") }}
        </template>
        <template
          v-if="column.dataIndex === 'declorate_date' && record.declorate_date"
        >
          {{
            new Date(record.declorate_date).toLocaleString().replace(",", "")
          }}
        </template>
        <template
          v-if="
            column.dataIndex === 'customs_clearens' && record.customs_clearens
          "
        >
          {{
            new Date(record.customs_clearens).toLocaleString().replace(",", "")
          }}
        </template>
        <template v-if="column.dataIndex === 'wagon_feed' && record.wagon_feed">
          {{ new Date(record.wagon_feed).toLocaleString().replace(",", "") }}
        </template>
        <template v-if="column.dataIndex === 'unload_end' && record.unload_end">
          {{ new Date(record.unload_end).toLocaleString().replace(",", "") }}
        </template>
        <template v-if="column.dataIndex === 'overload' && record.overload">
          {{ new Date(record.overload).toLocaleString().replace(",", "") }}
        </template>
        <template
          v-if="column.dataIndex === 'depozit_refund' && record.depozit_refund"
        >
          {{
            new Date(record.depozit_refund).toLocaleString().replace(",", "")
          }}
        </template>
        <template
          v-if="column.dataIndex === 'expenses_paid' && record.expenses_paid"
        >
          {{ new Date(record.expenses_paid).toLocaleString().replace(",", "") }}
        </template>
        <template
          v-if="column.dataIndex === 'dest_station' && record.dest_station"
        >
          {{ getCityById(record.dest_station) }}
        </template>
        <template v-if="column.dataIndex === 'transportStatusId'">
          <TransportStatus :transport="record" />
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <div style="margin: 10px 0px">
          <a-steps status="process">
            <a-step>
              <template #title
                ><span style="color: white"
                  >{{ $t("status.onWay") }} ({{
                    record.transport_locations.length > 0
                      ? record.transport_locations[0].name
                      : $t("content.notSpecified")
                  }})</span
                ></template
              >
              <template v-if="record.transportStatusId >= 1" #icon>
                <check-circle-outlined
                  @click="showLocationsModal(record.transport_locations)"
                  v-if="record.transportStatusId > 2"
                  style="color: lightgreen"
                />
                <clock-circle-outlined
                  @click="showLocationsModal(record.transport_locations)"
                  v-else-if="record.transportStatusId <= 2"
                  style="color: #1890ff"
                />
              </template>
            </a-step>
            <a-step>
              <template #title
                ><span style="color: white">{{
                  $t("status.onDestinationCity")
                }}</span></template
              >
              <template v-if="record.transportStatusId >= 3" #icon>
                <check-circle-outlined
                  v-if="record.transportStatusId > 3"
                  style="color: lightgreen"
                />
                <clock-circle-outlined
                  v-else-if="record.transportStatusId == 3"
                  style="color: #1890ff"
                />
              </template>
            </a-step>
            <a-step>
              <template #title
                ><span style="color: white">{{
                  $t("status.onStock")
                }}</span></template
              >
              <template v-if="record.transportStatusId >= 4" #icon>
                <check-circle-outlined
                  v-if="record.transportStatusId > 4"
                  style="color: lightgreen"
                />
                <clock-circle-outlined
                  v-else-if="record.transportStatusId == 4"
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
              <template v-if="record.transportStatusId == 5" #icon>
                <check-circle-outlined style="color: lightgreen" />
              </template>
            </a-step>
          </a-steps>
        </div>
        <div style="margin-left: 20px">
          <h2 style="color: white">{{ $t("title.products") }}:</h2>
          <a-table
            :columns="productsColumn"
            :data-source="record.transport_products"
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex == 'purchase'">
                {{ record.product_purchase.purchase.order_num }} <br />
              </template>
              <template v-if="column.dataIndex == 'productCategoryId'">
                {{ record.product_purchase.product_category.name }}
              </template>
              <template v-if="column.dataIndex == 'productArticleId'">
                {{ record.product_purchase.product_article.name }}
              </template>
            </template>
          </a-table>
        </div>
        <div
          v-if="
            record.transport_files.filter(
              (file) => file.type === 'declorant_files'
            ).length > 0
          "
          style="margin-left: 20px"
        >
          <h2 style="color: white; margin-top: 20px">
            {{ $t("title.files") }}:
          </h2>
          <a-table
            :columns="filesColumn"
            :data-source="record.transport_files"
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template
                v-if="
                  column.dataIndex === 'type' &&
                  record.type === 'declorant_files'
                "
              >
                <span>{{ $t("content.declarantFiles") }}</span>
              </template>
              <template
                v-else-if="
                  column.dataIndex === 'name' &&
                  record.type === 'declorant_files'
                "
              >
                <a
                  :href="config.API_HOST + record.type + '/' + record.name"
                  target="_blank"
                  >{{ record.name }}
                </a>
              </template>
            </template>
          </a-table>
        </div>
        <div
          v-if="
            record.transport_files &&
            record.transport_files.filter(
              (file) => file.type === 'forward_images'
            ).length > 0
          "
          style="margin-left: 20px"
        >
          <h2 style="color: white; margin-top: 20px">
            {{ $t("content.photoFromForwarder") }}:
          </h2>
          <div>
            <a-image-preview-group>
              <a-image
                :width="100"
                v-for="file in record.transport_files.filter(
                  (file) => file.type === 'forward_images'
                )"
                :key="file.id"
                :src="config.API_HOST + '/' + file.type + '/' + file.name"
              />
            </a-image-preview-group>
          </div>
        </div>
        <div
          v-if="
            record.transport_files &&
            record.transport_files.filter(
              (file) => file.type === 'stockman_images'
            ).length > 0
          "
          style="margin-left: 20px"
        >
          <h2 style="color: white; margin-top: 20px">
            {{ $t("content.photosFromStockman") }}:
          </h2>
          <div>
            <a-image-preview-group>
              <a-image
                :width="100"
                v-for="file in record.transport_files.filter(
                  (file) => file.type === 'stockman_images'
                )"
                :key="file.id"
                :src="config.API_HOST + '/' + file.type + '/' + file.name"
              />
            </a-image-preview-group>
          </div>
        </div>
      </template>
    </a-table>
  </div>
  <a-modal
    v-model:visible="locatinsModal.visible"
    :title="$t('title.tracking')"
    :cancelText="' '"
    @ok="() => (locatinsModal.visible = false)"
  >
    <template v-if="locatinsModal.locations.length === 0">
      <a-empty style="width: 100%" />
    </template>
    <template v-else>
      <div v-for="location in locatinsModal.locations" :key="location.id">
        <div
          style="
            display: flex;
            justify-content: space-between;
            width: 100%;
            background-color: #aae9ff;
            padding: 10px;
            margin-bottom: 10px;
          "
        >
          <p>{{ location.name }}</p>
          <p>
            {{ new Date(location.createdAt).toLocaleString().replace(",", "") }}
          </p>
        </div>
      </div>
    </template>
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
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config";
import store from "@/store/index";
import columns from "@/utils/logistics/logisticAdminCols";
import i18n from "@/i18n/i18n";
import getCityById from "@/utils/getCityById";
import getCategoryById from "@/utils/purchases/getCategoryById";
import getArticleById from "@/utils/purchases/getArticleById";
import TransportStatus from "./TransportStatus.vue";

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
    dataIndex: "productArticleId",
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
    SearchOutlined,
    FilterOutlined,
    TransportStatus,
    CheckCircleOutlined,
    ClockCircleOutlined,
  },

  setup() {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });

    const locatinsModal = reactive({
      visible: false,
      locations: [],
    });

    const showLocationsModal = (locations) => {
      locatinsModal.locations = locations;
      locatinsModal.visible = true;
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
      refresh,
      config,
      QuestionCircleOutlined,
      productsColumn,
      getCityById,
      getCategoryById,
      getArticleById,
      handleSearch,
      handleReset,
      ...toRefs(state),
      SearchOutlined,
      FilterOutlined,
      locatinsModal,
      showLocationsModal,
      filesColumn,
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
