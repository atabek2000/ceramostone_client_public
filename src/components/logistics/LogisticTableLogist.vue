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
        <template
          v-if="column.dataIndex === 'dest_station' && record.dest_station"
        >
          {{ getCityById(record.dest_station) }}
        </template>
        <template v-if="column.dataIndex === 'transport_locations'">
          <div style="display: flex">
            <div>
              <svg
                v-if="record.transportStatusId === 1"
                @click="showEditLocation(record.id)"
                style="cursor: pointer"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1_3225)">
                  <path
                    d="M18.11 1.77002L19.07 0.810022C19.1625 0.717319 19.2724 0.643771 19.3934 0.59359C19.5143 0.543408 19.644 0.517578 19.775 0.517578C19.906 0.517578 20.0357 0.543408 20.1566 0.59359C20.2776 0.643771 20.3875 0.717319 20.48 0.810022L21.19 1.52002C21.58 1.91002 21.58 2.54002 21.19 2.93002L20.23 3.89002L18.11 1.77002ZM17.11 2.77002L19.23 4.89002L13.26 10.86C13.1671 10.9533 13.0417 11.0071 12.91 11.01H11.5C11.22 11.01 11 10.79 11 10.51V9.10002C11 8.97002 11.05 8.84002 11.15 8.75002L17.11 2.77002ZM15.13 2.64002L9.79 7.98002C9.61 8.17002 9.5 8.42002 9.5 8.69002V11.52C9.5 12.07 9.95 12.52 10.5 12.52H13.33C13.6 12.52 13.85 12.41 14.04 12.23L19.37 6.90002C19.77 7.88002 20 8.99002 20 10.21C20 13.39 17.55 17.13 12.66 21.44C12.28 21.77 11.71 21.77 11.33 21.44C6.45 17.13 4 13.39 4 10.21C4 5.23002 7.8 2.01002 12 2.01002C13.09 2.01002 14.16 2.23002 15.13 2.64002Z"
                    fill="lightgreen"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_3225">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div>
              <svg
                @click="showLocationsModal(record.transport_locations)"
                style="
                  cursor: pointer;
                  margin-left: 10px;
                  width: 24px;
                  height: 24px;
                "
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1_3542)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6 20H18C18.55 20 19 20.45 19 21C19 21.55 18.55 22 18 22H6C5.45 22 5 21.55 5 21C5 20.45 5.45 20 6 20ZM12 7C10.9 7 10 7.9 10 9C10 10.1 10.9 11 12 11C12.5304 11 13.0391 10.7893 13.4142 10.4142C13.7893 10.0391 14 9.53043 14 9C14 8.46957 13.7893 7.96086 13.4142 7.58579C13.0391 7.21071 12.5304 7 12 7ZM12 2C15.27 2 19 4.46 19 9.15C19 12.13 16.87 15.27 12.61 18.54C12.25 18.82 11.75 18.82 11.39 18.54C7.13 15.26 5 12.13 5 9.15C5 4.46 8.73 2 12 2Z"
                    fill="lightgreen"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_3542">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <p style="margin-left: 10px">
              {{ record.transport_locations[0]?.name }}
            </p>
          </div>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
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
              <template v-if="column.dataIndex == 'productNameId'">
                {{ record.product_purchase.product_article.name }}
              </template>
            </template>
          </a-table>
        </div>
      </template>
    </a-table>
  </div>
  <a-modal
    v-model:visible="editLocationModal.visible"
    :title="$t('modal.changingData')"
    @ok="handleOkLocation"
  >
    <a-form>
      <a-form-item>
        <a-input
          style="width: 100%"
          v-model:value="editLocationModal.location"
          :placeholder="$t('placeholder.addLocations')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
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
  ref,
  reactive,
  toRefs,
  onBeforeMount,
} from "vue";
import {
  QuestionCircleOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config";
import store from "@/store/index";
import { message, Upload } from "ant-design-vue";
import columns from "@/utils/logistics/logisticLogistCols";
import getPayById from "@/utils/getPayById";
import i18n from "@/i18n/i18n";
import getCityById from "@/utils/getCityById";
import getDepartmentNameById from "@/utils/getDepartmentNameById";
import defineReadyButton from "../../utils/purchases/defineReadyButton";
import defineCancelButton from "../../utils/purchases/defineCancelButton";
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
    title: t("placeholder.countPallets"),
    dataIndex: "count_pallet",
  },
  {
    title: t("placeholder.countBoxesPerPallet"),
    dataIndex: "count_box_per_pallet",
  },
  {
    title: t("placeholder.countBoxes"),
    dataIndex: "count_total_box",
  },
  {
    title: t("placeholder.countGoodsPerBox"),
    dataIndex: "count_product_per_box",
  },
  {
    title: t("placeholder.countGoods"),
    dataIndex: "amount_product",
  },
  {
    title: t("placeholder.colorNumber"),
    dataIndex: "color_num",
  },
  {
    title: t("placeholder.productDimensions"),
    dataIndex: "size_logistic",
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
  },

  setup() {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });

    const editLocationModal = reactive({
      visible: false,
      id: undefined,
      location: undefined,
    });

    const locatinsModal = reactive({
      visible: false,
      locations: [],
    });

    const showEditLocation = (id) => {
      editLocationModal.id = id;
      editLocationModal.visible = true;
    };

    const showLocationsModal = (locations) => {
      locatinsModal.locations = locations;
      locatinsModal.visible = true;
    };

    const handleOkLocation = async () => {
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .post(config.API_URL + "api/logistic/change_location", {
          id: editLocationModal.id,
          name: editLocationModal.location,
        })
        .then(() => {
          store.commit("setIsLoading", false);
          message.success(t("modal.successfullyChanged"));
          refresh();
          editLocationModal.id = undefined;
          editLocationModal.location = undefined;
          editLocationModal.visible = false;
        })
        .catch((err) => {
          store.commit("setIsLoading", false);
          if (
            err.response.data.errors &&
            err.response.data.errors.length !== 0
          ) {
            let errors = "";
            err.response.data.errors.map((error) => [
              (errors += error.msg + " "),
            ]);
            message.error(errors);
          } else {
            message.error(err.response.data.message);
          }
          editLocationModal.id = undefined;
          editLocationModal.location = undefined;
          editLocationModal.visible = false;
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

    const files = ref([]);
    const allowed_files = [
      "application/pdf",
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
    ];

    const beforeUploadFile = (file) => {
      const isAllowed = allowed_files.includes(file.type);
      if (isAllowed) {
        files.value = [...files.value, file];
        return false;
      } else {
        message.error(`${t("modal.errorFile")} ${file.name}!`);
        return Upload.LIST_IGNORE;
      }
    };

    const handleRemoveFile = (file) => {
      const index = files.value.indexOf(file);
      const newFileList = files.value.slice();
      newFileList.splice(index, 1);
      files.value = newFileList;
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
      getPayById,
      productsColumn,
      getCityById,
      getDepartmentNameById,
      defineCancelButton,
      defineReadyButton,
      getCategoryById,
      getArticleById,
      handleSearch,
      handleReset,
      ...toRefs(state),
      SearchOutlined,
      FilterOutlined,
      beforeUploadFile,
      handleRemoveFile,
      editLocationModal,
      locatinsModal,
      handleOkLocation,
      showEditLocation,
      showLocationsModal,
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
