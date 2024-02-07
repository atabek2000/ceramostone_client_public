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
      tableLayout="auto"
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
          v-if="column.dataIndex === 'transport_type' && record.transport_type"
        >
          <div v-if="record.transport_type == 'ship'">
            <img src="../../assets/transport_boat.svg" alt="" />
          </div>
          <div v-else-if="record.transport_type === 'plane'">
            <img src="../../assets/transport_plane.svg" alt="" />
          </div>
          <div v-else-if="record.transport_type === 'truck'">
            <img src="../../assets/transport_truck.svg" alt="" />
          </div>
          <div v-else>
            <img src="../../assets/transport_van.svg" alt="" />
          </div>
        </template>
        <template
          v-else-if="column.dataIndex === 'wagon_num_cn' && record.wagon_num_cn"
        >
          {{ record.wagon_num_cn }}
        </template>
        <template
          v-else-if="column.dataIndex === 'wagon_num_kz' && record.wagon_num_kz"
        >
          {{ record.wagon_num_kz }}
        </template>
        <template
          v-else-if="
            column.dataIndex === 'depart_station' && record.depart_station
          "
        >
          {{ record.depart_station }}
        </template>
        <template
          v-else-if="column.dataIndex === 'dest_station' && record.dest_station"
        >
          {{ getCityById(record.dest_station) }}
        </template>
        <template
          v-else-if="
            column.dataIndex === 'promotion_date' && record.promotion_date
          "
        >
          {{
            new Date(record.promotion_date).toLocaleString().replace(",", "")
          }}
        </template>
        <template
          v-else-if="column.dataIndex === 'regist_date' && record.regist_date"
        >
          {{ new Date(record.regist_date).toLocaleString().replace(",", "") }}
        </template>
        <template
          v-else-if="
            column.dataIndex === 'status_arrived' && record.status_arrived
          "
        >
          {{
            new Date(record.status_arrived).toLocaleString().replace(",", "")
          }}
        </template>
        <!-- <template
          v-else-if="
            column.dataIndex === 'emp_recycling' && record.emp_recycling
          "
        >
          {{ record.emp_recycling }}
        </template> -->
        <template v-else-if="column.dataIndex === 'seals' && record.seals">
          {{ record.seals }}
        </template>
        <template
          v-else-if="column.dataIndex === 'account_num' && record.account_num"
        >
          {{ record.account_num }}
        </template>
        <template
          v-else-if="
            column.dataIndex === 'wagon_expenses' && record.wagon_expenses
          "
        >
          {{ record.wagon_expenses }}
        </template>
        <template v-else-if="column.dataIndex === 'tek_pay' && record.tek_pay">
          {{ record.tek_pay }}
        </template>
        <!-- <template
          v-else-if="column.dataIndex === 'control_pay' && record.control_pay"
        >
          {{ record.control_pay }}
        </template> -->
        <template
          v-else-if="
            column.dataIndex === 'zholashar_pay' && record.zholashar_pay
          "
        >
          {{ record.zholashar_pay }}
        </template>
        <template
          v-else-if="
            column.dataIndex === 'almaty_iron_pay' && record.almaty_iron_pay
          "
        >
          {{ record.almaty_iron_pay }}
        </template>
        <template
          v-else-if="column.dataIndex === 'total_pay' && record.total_pay"
        >
          {{ record.total_pay }}
        </template>
        <template
          v-else-if="
            column.dataIndex === 'dest_readdress' && record.dest_readdress
          "
        >
          {{ record.dest_readdress }}
        </template>
        <template
          v-else-if="
            column.dataIndex === 'depart_country' && record.depart_country
          "
        >
          {{ getCountryById(record.depart_country) }}
        </template>

        <template
          v-else-if="
            column.dataIndex === 'declorate_num' && record.declorate_num
          "
        >
          {{ record.declorate_num }}
        </template>
        <template
          v-else-if="
            column.dataIndex === 'declorate_date' && record.declorate_date
          "
        >
          {{
            new Date(record.declorate_date).toLocaleString().replace(",", "")
          }}
        </template>
        <template
          v-else-if="
            column.dataIndex === 'expenses_paid' && record.expenses_paid
          "
        >
          {{ new Date(record.expenses_paid).toLocaleString().replace(",", "") }}
        </template>
        <template
          v-else-if="
            column.dataIndex !== 'action' &&
            column.dataIndex !== 'location' &&
            column.dataIndex !== 'transportStatusId'
          "
        >
          _
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div style="display: flex; align-items: center">
            <edit-outlined
              @click="editRow(index, record)"
              style="color: lightgreen"
            />
          </div>
        </template>
        <template v-if="column.dataIndex === 'transportStatusId'">
          <TransportStatus :transport="record" />
        </template>
        <template v-if="column.dataIndex === 'location'">
          <div style="display: flex; align-items: center">
            <div style="cursor: pointer">
              <svg
                @click="showEditLocation(record.id)"
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
            <div style="cursor: pointer; margin-left: 10px">
              <svg
                @click="showLocationsModal(record.transport_locations)"
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
                    fill="LightSalmon"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_3542">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <p style="margin: 0; padding-left: 10px">
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
    v-model:visible="modalVisible"
    :title="$t('modal.changingData')"
    @ok="modalOk"
  >
    <a-form name="coord_data" :model="formState">
      <a-row justify="space-between">
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              v-model:value="formState.wagon_num_kz"
              :placeholder="$t('table.wagonKz')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              v-model:value="formState.dest_readdress"
              :placeholder="$t('table.reAdd')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              v-model:value="formState.depart_station"
              :placeholder="$t('table.departStation')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-select
              v-model:value="formState.dest_station"
              style="width: 100%"
              :placeholder="$t('table.dest_station')"
              :options="$store.state.cities"
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-date-picker
              :show-time="{ format: 'HH:mm' }"
              v-model:value="formState.promotion_date"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="$t('table.creditingDocuments')"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-date-picker
              :show-time="{ format: 'HH:mm' }"
              v-model:value="formState.regist_date"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="$t('table.registDate1')"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-select
              v-model:value="formState.status_arrived"
              style="width: 100%"
              :placeholder="$t('table.stArr')"
              :disabled="dataSource[currentIndex].status_arrived ? true : false"
            >
              <a-select-option :value="1">{{
                $t("modal.yes")
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <!-- <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              v-model:value="formState.emp_recycling"
              :placeholder="$t('table.empRecycling')"
            />
          </a-form-item>
        </a-col> -->

        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              v-model:value="formState.seals"
              :placeholder="$t('table.seals')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              v-model:value="formState.account_num"
              :placeholder="$t('table.account_num')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              @change="onChangePrices('wagon_expenses')"
              v-model:value="formState.wagon_expenses"
              :placeholder="$t('table.wagonExpenses')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              @change="onChangePrices('tek_pay')"
              v-model:value="formState.tek_pay"
              :placeholder="$t('table.tekPay')"
            />
          </a-form-item>
        </a-col>
        <!-- <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              @change="onChangePrices('control_pay')"
              v-model:value="formState.control_pay"
              :placeholder="$t('table.controlPay')"
            />
          </a-form-item>
        </a-col> -->
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              @change="onChangePrices('zholashar_pay')"
              v-model:value="formState.zholashar_pay"
              :placeholder="$t('table.zholpay')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              @change="onChangePrices('almaty_iron_pay')"
              v-model:value="formState.almaty_iron_pay"
              :placeholder="$t('table.almIron')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              disabled="true"
              v-model:value="formState.total_pay"
              :placeholder="$t('table.total')"
            />
          </a-form-item>
        </a-col>
        <!-- <a-col :md="11" :xs="24" v-if="!dataSource[currentIndex].expenses_paid">
                    <a-form-item>
                        <a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="formState.expenses_paid" value-format="YYYY-MM-DD HH:mm:ss" :placeholder="$t('table.expPaid')" style="width: 100%;"/>
                    </a-form-item>
                </a-col> -->
      </a-row>
    </a-form>
  </a-modal>
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
    :title="$t('modal.changingData')"
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
            background-color: lightgray;
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
  EditOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config";
import store from "@/store/index";
import { message } from "ant-design-vue";
import columns from "@/utils/logistics/logisticCoordCols";
import getPayById from "@/utils/getPayById";
import i18n from "@/i18n/i18n";
import getCountryById from "@/utils/getCountryById";
import getCategoryById from "@/utils/purchases/getCategoryById";
import getArticleById from "@/utils/purchases/getArticleById";
import TransportStatus from "./TransportStatus.vue";
import validateSumm from "@/utils/validateSumm";
import convertDate from "@/utils/DBDateToCalendarDate";
import getCityById from "@/utils/getCityById";

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
      promotion_date: undefined,
      regist_date: undefined,
      expenses_paid: undefined,
      status_arrived: undefined,
      // emp_recycling: undefined,
      wagon_num_kz: undefined,
      dest_readdress: undefined,
      depart_station: undefined,
      dest_station: undefined,
      seals: undefined,
      wagon_expenses: undefined,
      tek_pay: undefined,
      // control_pay: undefined,
      zholashar_pay: undefined,
      almaty_iron_pay: undefined,
      total_pay: undefined,
      account_num: undefined,
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
    const editRow = (index, record) => {
      formState.promotion_date = convertDate(
        dataSource.value[index].promotion_date
      );
      formState.regist_date = convertDate(dataSource.value[index].regist_date);
      // formState.status_arrived = dataSource.value[index].status_arrived ? 1 : undefined;

      // formState.emp_recycling = dataSource.value[index].emp_recycling;
      formState.wagon_num_kz = dataSource.value[index].wagon_num_kz;
      formState.dest_readdress = dataSource.value[index].dest_readdress;
      formState.depart_station = dataSource.value[index].depart_station;
      formState.dest_station = dataSource.value[index].dest_station;
      formState.seals = dataSource.value[index].seals;
      formState.account_num = dataSource.value[index].account_num;

      if (record.total_pay)
        formState.total_pay = validateSumm(record.total_pay.toString());
      else formState.total_pay = undefined;
      if (record.almaty_iron_pay)
        formState.almaty_iron_pay = validateSumm(
          record.almaty_iron_pay.toString()
        );
      else formState.almaty_iron_pay = undefined;
      // if (record.control_pay)
      //   formState.control_pay = validateSumm(record.control_pay.toString());
      // else formState.control_pay = undefined;
      if (record.zholashar_pay)
        formState.zholashar_pay = validateSumm(record.zholashar_pay.toString());
      else formState.zholashar_pay = undefined;
      if (record.wagon_expenses)
        formState.wagon_expenses = validateSumm(
          record.wagon_expenses.toString()
        );
      else formState.wagon_expenses = undefined;
      if (record.tek_pay)
        formState.tek_pay = validateSumm(record.tek_pay.toString());
      else formState.tek_pay = undefined;
      currentId.value = record.id;
      currentIndex.value = index;
      formState.id = record.id;
      modalVisible.value = true;
    };

    const onChangePrices = (type) => {
      formState[type] = validateSumm(formState[type]);
      const prices = {
        almaty_iron_pay: 0,
        // control_pay: 0,
        zholashar_pay: 0,
        wagon_expenses: 0,
        tek_pay: 0,
      };

      if (formState.almaty_iron_pay)
        prices.almaty_iron_pay = parseFloat(
          formState.almaty_iron_pay.replaceAll(/\s/g, "")
        );
      // if (formState.control_pay)
      //   prices.control_pay = parseFloat(
      //     formState.control_pay.replaceAll(/\s/g, "")
      //   );
      if (formState.zholashar_pay)
        prices.zholashar_pay = parseFloat(
          formState.zholashar_pay.replaceAll(/\s/g, "")
        );
      if (formState.wagon_expenses)
        prices.wagon_expenses = parseFloat(
          formState.wagon_expenses.replaceAll(/\s/g, "")
        );
      if (formState.tek_pay)
        prices.tek_pay = parseFloat(formState.tek_pay.replaceAll(/\s/g, ""));

      formState.total_pay = validateSumm(
        (
          prices.almaty_iron_pay +
          // prices.control_pay +
          prices.zholashar_pay +
          prices.wagon_expenses +
          prices.tek_pay
        ).toString()
      );
    };

    const modalOk = async () => {
      formState.almaty_iron_pay = formState.almaty_iron_pay?.replaceAll(
        /[\s]/g,
        ""
      );
      formState.wagon_expenses = formState.wagon_expenses?.replaceAll(
        /[\s]/g,
        ""
      );
      formState.tek_pay = formState.tek_pay?.replaceAll(/[\s]/g, "");
      // formState.control_pay = formState.control_pay?.replaceAll(/[\s]/g, "");
      formState.zholashar_pay = formState.zholashar_pay?.replaceAll(
        /[\s]/g,
        ""
      );
      formState.total_pay = formState.total_pay?.replaceAll(/[\s]/g, "");
      for (const iterator in formState) {
        if (formState[iterator] == null || formState[iterator] == "")
          formState[iterator] = undefined;
      }
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/logistic/on_stockman", formState)
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

      formState.id = undefined;
      formState.promotion_date = undefined;
      formState.regist_date = undefined;
      formState.expenses_paid = undefined;
      formState.status_arrived = undefined;
      // formState.emp_recycling = undefined;
      formState.wagon_num_kz = undefined;
      formState.dest_readdress = undefined;
      formState.depart_station = undefined;
      formState.dest_station = undefined;
      formState.seals = undefined;
      formState.account_num = undefined;
      formState.wagon_expenses = undefined;
      formState.tek_pay = undefined;
      // formState.control_pay = undefined;
      formState.zholashar_pay = undefined;
      formState.almaty_iron_pay = undefined;
      formState.total_pay = undefined;
    };

    const editLocationModal = reactive({
      visible: false,
      id: undefined,
      location: undefined,
    });

    const locatinsModal = reactive({
      visible: false,
      locations: [],
    });

    const showLocationsModal = (locations) => {
      locatinsModal.locations = locations;
      locatinsModal.visible = true;
    };

    const showEditLocation = (id) => {
      editLocationModal.id = id;
      editLocationModal.visible = true;
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
          editLocationModal.id = undefined;
          editLocationModal.location = undefined;
          editLocationModal.visible = false;
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
      productsColumn,
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
      validateSumm,
      showLocationsModal,
      locatinsModal,
      editLocationModal,
      handleOkLocation,
      showEditLocation,
      onChangePrices,
      filesColumn,
      getCountryById,
      getCityById,
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
