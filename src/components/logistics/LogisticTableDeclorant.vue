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
          v-else-if="
            column.dataIndex === 'declorate_num' && record.declorate_num
          "
        >
          {{
            record.declorate_num +
            " ( " +
            new Date(record.declorate_date).toLocaleString().replace(",", "") +
            " )"
          }}
        </template>
        <template
          v-else-if="
            column.dataIndex === 'customs_clearens' && record.customs_clearens
          "
        >
          {{
            new Date(record.customs_clearens).toLocaleString().replace(",", "")
          }}
        </template>
        <template
          v-else-if="column.dataIndex === 'customs_pay' && record.customs_pay"
        >
          {{ record.customs_pay }}
        </template>
        <template v-else-if="column.dataIndex === 'depozit' && record.depozit">
          {{ record.depozit }}
        </template>
        <template
          v-else-if="
            column.dataIndex !== 'action' &&
            column.dataIndex !== 'transportStatusId' &&
            column.dataIndex !== 'declorant_files'
          "
        >
          _
        </template>
        <template v-if="column.dataIndex === 'action'">
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
            </template>
          </a-table>
        </div>
        <div
          v-if="
            record.transport_files &&
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
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              v-model:value="formState.declorate_num"
              :placeholder="$t('table.declorateNum')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-date-picker
              :show-time="{ format: 'HH:mm' }"
              v-model:value="formState.declorate_date"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="$t('table.declorateDate')"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-date-picker
              :show-time="{ format: 'HH:mm' }"
              v-model:value="formState.customs_clearens"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="$t('table.custClear')"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <!-- <a-col
          :md="11"
          :xs="24"
          v-if="!dataSource[currentIndex].customs_clearens"
        >
          <a-form-item>
            <a-select
              v-model:value="formState.customs_clearens"
              style="width: 100%"
              :placeholder="$t('table.custClear')"
            >
              <a-select-option value="1">{{ $t("modal.yes") }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col> -->
        <!-- <a-col :md="11" :xs="24" v-if="!dataSource[currentIndex].customs_pay">
          <a-form-item>
            <a-input
              @change="
                () =>
                  (formState.customs_pay = validateSumm(formState.customs_pay))
              "
              v-model:value="formState.customs_pay"
              :placeholder="$t('table.customsPay')"
            />
          </a-form-item>
        </a-col> -->
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              @change="
                () => (formState.depozit = validateSumm(formState.depozit))
              "
              v-model:value="formState.depozit"
              :placeholder="$t('table.depo')"
            />
          </a-form-item>
        </a-col>
        <a-col
          :md="24"
          :xs="24"
          v-if="
            dataSource[currentIndex].transport_files.filter(
              (file) => file.type === 'declorant_files'
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
                {{ $t("formLabel.documents") }} (.pdf, .png, .jpg, .jpeg, .gif)
                - 5
              </a-button>
            </a-upload>
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
import columns from "@/utils/logistics/logisticDeclorantCols";
import getPayById from "@/utils/getPayById";
import i18n from "@/i18n/i18n";
import getCityById from "@/utils/getCityById";
import getDepartmentNameById from "@/utils/getDepartmentNameById";
import defineReadyButton from "../../utils/purchases/defineReadyButton";
import defineCancelButton from "../../utils/purchases/defineCancelButton";
import getCategoryById from "@/utils/purchases/getCategoryById";
import getArticleById from "@/utils/purchases/getArticleById";
import TransportStatus from "./TransportStatus.vue";
import validateSumm from "@/utils/validateSumm";
import convertDate from "@/utils/DBDateToCalendarDate";
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
    EditOutlined,
    TransportStatus,
  },

  setup() {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });
    const modalVisible = ref(false);
    const currentId = ref(0);
    const currentIndex = ref(-1);
    const formState = reactive({
      id: undefined,
      declorate_num: undefined,
      customs_clearens: undefined,
      customs_pay: undefined,
      depozit: undefined,
      declorate_date: undefined,
    });

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
      formState.customs_clearens = dataSource.value[index].customs_clearens;
      formState.declorate_date = convertDate(
        dataSource.value[index].declorate_date
      );
      // formState.declorate_date = dataSource.value[index].declorate_date;
      formState.declorate_num = dataSource.value[index].declorate_num;
      formState.depozit = String(dataSource.value[index].depozit);
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

    const modalOk = async () => {
      formState.customs_pay = formState.customs_pay?.replaceAll(/[\s]/g, "");
      formState.depozit = formState.depozit?.replaceAll(/[\s]/g, "");
      const bodyFormData = new FormData();
      for (const index in formState) {
        if (formState[index]) {
          bodyFormData.append(index, formState[index]);
        }
      }
      for (const file of files.value) {
        bodyFormData.append("declorant_files", file);
      }
      store.commit("setIsLoading", true);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/logistic/on_declorate", bodyFormData)
        .then(() => {
          store.commit("setIsLoading", false);
          message.success(t("modal.successfullyChanged"));
          refresh();
          formState.id = undefined;
          modalVisible.value = false;
          files.value = [];
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
          files.value = [];
        });
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
      filesColumn,
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
      modalVisible,
      editRow,
      currentId,
      modalOk,
      formState,
      currentIndex,
      beforeUploadFile,
      validateSumm,
      handleRemoveFile,
      productsColumn,
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
