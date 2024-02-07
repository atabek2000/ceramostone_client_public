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
      <template #bodyCell="{ column, record, index }">
        <template
          v-if="column.dataIndex === 'wagon_num_kz' && record.wagon_num_kz"
        >
          {{ record.wagon_num_kz }}
        </template>
        <template
          v-else-if="column.dataIndex === 'wagon_feed' && record.wagon_feed"
        >
          {{ new Date(record.wagon_feed).toLocaleString().replace(",", "") }}
        </template>
        <template
          v-else-if="column.dataIndex === 'unload_end' && record.unload_end"
        >
          {{ new Date(record.unload_end).toLocaleString().replace(",", "") }}
        </template>
        <template
          v-else-if="
            column.dataIndex !== 'action' &&
            column.dataIndex !== 'transportStatusId'
          "
        >
          _
        </template>
        <template
          v-if="
            column.dataIndex === 'action' &&
            (!record.wagon_feed || !record.unload_end) &&
            record.transportStatusId !== 5
          "
        >
          <edit-outlined
            @click="editRow(index, record.id)"
            style="color: lightgreen"
          />
        </template>
        <template v-if="column.dataIndex === 'transportStatusId'">
          <TransportStatus :transport="record" />
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
                {{ $t("content.notSpecified") }}
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
                  v-if="record.sorted === 0"
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
    v-model:visible="modalVisible"
    :title="$t('modal.changingData')"
    @ok="modalOk"
  >
    <a-form name="coord_data" :model="formState">
      <a-row justify="space-between">
        <a-col :md="11" :xs="24" v-if="!dataSource[currentIndex].wagon_feed">
          <a-form-item>
            <a-date-picker
              :show-time="{ format: 'HH:mm' }"
              v-model:value="formState.wagon_feed"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="$t('table.wagonFeed')"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24" v-if="!dataSource[currentIndex].unload_end">
          <a-form-item>
            <a-date-picker
              :show-time="{ format: 'HH:mm' }"
              v-model:value="formState.unload_end"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="$t('table.unloadEnd')"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col
          :md="24"
          :xs="24"
          v-if="
            dataSource[currentIndex].transport_files.filter(
              (file) => file.type === 'stockman_images'
            ).length === 0
          "
        >
          <a-form-item>
            <a-upload
              :file-list="files"
              :multiple="true"
              maxCount="5"
              :before-upload="beforeUploadFile"
              @remove="handleRemoveFile"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                {{ $t("content.photosFromStockman") }} (.png, .jpg, .jpeg, .gif)
                - 10
              </a-button>
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
  <a-modal
    v-model:visible="formState.modalVisible"
    :title="$t('modal.sortingGoods')"
    @ok="productHandleOk"
  >
    <a-form :model="formState">
      <a-row justify="space-between">
        <a-col :md="15" :xs="24">
          <a-form-item :name="remain">
            <a-input
              v-model:value="formState.actual"
              :placeholder="$t('placeholder.actualVolume')"
              @change="onChangeActual"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="7" :xs="24">
          <a-form-item :name="formState.UnitId">
            <a-select
              :placeholder="$t('placeholder.unitMeasurement')"
              :options="$store.state.purchaseUnits"
              :field-names="{ label: 'short', value: 'id' }"
              v-model:value="formState.UnitId"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :md="15" :xs="24">
          <a-form-item :name="defect">
            <a-input
              v-model:value="formState.defect"
              :placeholder="$t('placeholder.defectiveGoods')"
              @change="onChangeDefect"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="15" :xs="24">
          <a-form-item :name="remain">
            <a-input
              v-model:value="formState.remain"
              :disabled="true"
              :placeholder="$t('placeholder.remains')"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
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
  EditOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config";
import store from "@/store/index";
import { message, Upload } from "ant-design-vue";
import columns from "@/utils/purchases/purchaseStockmanCols";
import getPayById from "@/utils/getPayById";
import i18n from "@/i18n/i18n";
import getCityById from "@/utils/getCityById";
import getCategoryById from "@/utils/purchases/getCategoryById";
import getArticleById from "@/utils/purchases/getArticleById";
import TransportStatus from "../logistics/TransportStatus.vue";
import validateSumm from "@/utils/validateSumm";

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
    title: t("table.colorNumber"),
    dataIndex: "color_num",
  },
  {
    title: t("table.sizesBag"),
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
    EditOutlined,
    TransportStatus,
  },

  setup(props, { emit }) {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });
    const modalVisible = ref(false);
    const currentId = ref(0);
    const currentIndex = ref(-1);
    const formState = reactive({
      id: undefined,
      wagon_feed: undefined,
      unload_end: undefined,
    });

    const productModal = (id) => {
      formState.modalVisible = true;
      formState.purchaseId = id;
    };
    const productHandleOk = () => {
      if (
        (!formState.defect && formState.defect !== 0) ||
        !formState.UnitId ||
        (!formState.remain && formState.remain !== 0)
      ) {
        message.error(t("modal.fillFields"));
      } else {
        emit("onProductSort", { ...formState, refresh });
        formState.modalVisible = false;
        formState.defect = undefined;
        formState.UnitId = undefined;
        formState.remain = undefined;
        (formState.actual = undefined), (formState.purchaseId = 0);
      }
    };

    const onChangeDefect = () => {
      formState.defect = validateSumm(formState.defect);
      if (
        typeof formState.defect === "string" &&
        typeof formState.actual === "string"
      )
        formState.remain = validateSumm(
          (
            parseFloat(formState.actual.replaceAll(/\s/g, "")) -
            parseFloat(formState.defect.replaceAll(/\s/g, ""))
          ).toString()
        );
    };
    const onChangeActual = () => {
      formState.actual = validateSumm(formState.actual);
      if (
        typeof formState.defect === "string" &&
        typeof formState.actual === "string"
      )
        formState.remain = validateSumm(
          (
            parseFloat(formState.actual.replaceAll(/\s/g, "")) -
            parseFloat(formState.defect.replaceAll(/\s/g, ""))
          ).toString()
        );
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

    const editRow = (index, id) => {
      modalVisible.value = true;
      currentId.value = id;
      currentIndex.value = index;
      formState.id = id;
    };

    const modalOk = async () => {
      store.commit("setIsLoading", true);
      const bodyFormData = new FormData();
      for (const index in formState) {
        if (formState[index]) {
          bodyFormData.append(index, formState[index]);
        }
      }
      for (const file of files.value) {
        bodyFormData.append("stockman_images", file);
      }
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/logistic/on_acountant", bodyFormData)
        .then(() => {
          store.commit("setIsLoading", false);
          message.success(t("modal.successfullyChanged"));
          refresh();
          formState.id = undefined;
          modalVisible.value = false;
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
          formState.id = undefined;
          modalVisible.value = false;
        });
    };

    const files = ref([]);
    const allowed_files = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

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
      getCategoryById,
      getArticleById,
      handleSearch,
      handleReset,
      ...toRefs(state),
      SearchOutlined,
      FilterOutlined,
      modalVisible,
      editRow,
      currentId,
      modalOk,
      formState,
      currentIndex,
      productModal,
      productHandleOk,
      onChangeDefect,
      onChangeActual,
      beforeUploadFile,
      handleRemoveFile,
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
