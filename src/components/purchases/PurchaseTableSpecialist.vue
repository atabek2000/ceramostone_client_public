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
        <template v-if="column.dataIndex === 'headId'"
          ><span>{{ getUserNameById(record.headId) }}</span>
        </template>
        <template v-if="column.dataIndex === 'countryFrom'"
          ><span>{{ getCountryByCode(record.countryFrom) }}</span>
        </template>
        <template v-if="column.dataIndex === 'departmentId'"
          ><span>{{
            getDepartmentNameById(record.departmentId, "long")
          }}</span></template
        >
        <template v-if="column.dataIndex === 'order_num'">
          <span>{{ record.order_num }}</span> -
          <span
            :style="
              getRemainPurchPer(record.product_purchases) > 95
                ? 'color: lightgreen'
                : 'color: red'
            "
            >{{ getRemainPurchPer(record.product_purchases) }}%</span
          >
        </template>
        <template v-if="column.dataIndex === 'purchaseStatusId'">
          <PurchaseStatus :purchase="record" />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="order-col buttons">
            <div
              class="pointer"
              v-if="
                defineReadyButton(
                  $store.state.user.roleId,
                  record.purchaseStatusId
                ) &&
                !record.paid &&
                (!record.specialistId ||
                  record.specialistId === $store.state.user.id)
              "
              :title="$t('modal.ready')"
              @click="readyConfirm(record)"
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
                    fill="lightgreen"
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
              v-if="record.purchaseStatusId === 9"
              @click="arrivedConfirm(record.id)"
            >
              <carry-out-outlined style="font-size: 20px; color: lightgreen" />
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

                <template v-if="column.dataIndex == 'action'">
                  <div
                    class="pointer"
                    @click="sendConfirm(record.id)"
                    :title="$t('title.registrationSending')"
                    v-if="
                      getRemainPer(
                        record.volumePurchase,
                        record.transport_products
                      ) < 100
                    "
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_1_2144)">
                        <path
                          d="M10 16H14C14.55 16 15 15.55 15 15V9.99997H16.59C17.48 9.99997 17.93 8.91997 17.3 8.28997L12.71 3.69997C12.32 3.30997 11.69 3.30997 11.3 3.69997L6.71 8.28997C6.08 8.91997 6.52 9.99997 7.41 9.99997H9V15C9 15.55 9.45 16 10 16ZM6 18H18C18.55 18 19 18.45 19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19C5 18.45 5.45 18 6 18Z"
                          fill="orange"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1_2144">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
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
    <a-modal
      v-model:visible="modalVisible"
      :title="$t('title.purchaseRequest')"
      @ok="handleOkModal"
    >
      <a-form :model="formState">
        <a-row justify="space-between">
          <a-col :md="24" :xs="24">
            <a-form-item :name="logist_company">
              <a-input
                v-model:value="formState.logist_company"
                :placeholder="$t('placeholder.logisticsCompany')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item :name="order_num">
              <a-input
                v-model:value="formState.provider"
                :placeholder="$t('table.provider')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item>
              <a-upload
                :file-list="provider_files"
                :multiple="true"
                maxCount="5"
                :before-upload="beforeUploadProvider"
                @remove="handleRemoveProvider"
              >
                <a-button>
                  <upload-outlined></upload-outlined>
                  {{ $t("table.providerFiles") }} (.pdf, .png, .jpg, .jpeg,
                  .gif) 5
                </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item :name="formState.paid">
              <a-select
                :placeholder="$t('table.payment')"
                :options="piadOptions"
                v-model:value="formState.paid"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item>
              <a-upload
                :file-list="paid_files"
                :multiple="true"
                maxCount="5"
                :before-upload="beforeUploadPaid"
                @remove="handleRemovePaid"
              >
                <a-button>
                  <upload-outlined></upload-outlined>
                  {{ $t("table.paymentFiles") }} (.pdf, .png, .jpg, .jpeg, .gif)
                  5
                </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="sendState.modalVisible"
      :title="$t('title.registrationSending')"
      @ok="handleSendModal"
    >
      <a-form :model="sendState">
        <a-row justify="space-between">
          <a-col :md="24" :xs="24">
            <a-form-item :name="logist_company">
              <a-select
                :placeholder="$t('placeholder.transportType')"
                :options="transportTypes"
                v-model:value="sendState.transportType"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col
            :md="24"
            :xs="24"
            v-for="(num, index) in sendState.transportNums"
            :key="index"
          >
            <a-row>
              <a-col :xs="13">
                <a-form-item :name="logist_company">
                  <a-input
                    v-model:value="num.number"
                    :placeholder="$t('placeholder.transportNumber')"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :xs="1"></a-col>
              <a-col :xs="8">
                <a-form-item :name="logist_company">
                  <a-input
                    v-model:value="num.count"
                    :placeholder="$t('placeholder.productVolume')"
                    @change="() => (num.count = validateSumm(num.count))"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :xs="2">
                <div
                  v-if="sendState.transportNums.length > 1"
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 32px;
                  "
                >
                  <svg
                    @click="deleteTransportNum(index)"
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
              </a-col>
            </a-row>
          </a-col>
          <a-col :md="24" :xs="24" style="text-align: right">
            <a-form-item :name="logist_company">
              <a-button @click="addTransportNum">
                {{ $t("placeholder.addTransportNumber") }}
              </a-button>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item :name="logist_company">
              <a-select
                :placeholder="$t('placeholder.departCountry')"
                :options="$store.state.countries"
                v-model:value="sendState.country"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="arrived_confirm.visible"
      :title="$t('content.arrival_order')"
      @ok="handleOkArrived"
    >
      <a-form :model="arrived_confirm">
        <a-row justify="space-between">
          <a-col :md="24" :xs="24">
            <a-form-item :name="logist_company">
              <a-textarea
                v-model:value="arrived_confirm.comment"
                :placeholder="$t('placeholder.note')"
              />
            </a-form-item>
          </a-col>

          <a-col :md="24" :xs="24">
            <a-form-item :name="arrived_confirm.type">
              <a-select
                :placeholder="$t('content.arrival_type')"
                :options="arrivedOptions"
                v-model:value="arrived_confirm.type"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
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
  CarryOutOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config";
import store from "@/store/index";
import { Modal, message, Upload } from "ant-design-vue";
import columns from "@/utils/purchases/purchaseSpecialistCols";
import getPayById from "@/utils/getPayById";
import i18n from "@/i18n/i18n";
import getCityById from "@/utils/getCityById";
import getDepartmentNameById from "@/utils/getDepartmentNameById";
import PurchaseStatus from "./PurchaseStatus.vue";
import defineCancelButton from "../../utils/purchases/defineCancelButton";
import defineReadyButton from "../../utils/purchases/defineReadyButton";
import getCategoryById from "@/utils/purchases/getCategoryById";
import getArticleById from "@/utils/purchases/getArticleById";
import getUserNameById from "@/utils/getUserNameById";
import getCountryByCode from "@/utils/getCountryByCode";
import validateSumm from "@/utils/validateSumm";
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
    CarryOutOutlined,
  },
  setup(props, { emit }) {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });
    const arrived_confirm = reactive({
      visible: false,
      type: undefined,
      purchase: undefined,
      comment: undefined,
    });
    const provider_files = ref([]);
    const paid_files = ref([]);
    const allowed_files = [
      "application/pdf",
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
    ];
    const modalVisible = ref(false);
    const sendState = reactive({
      id: undefined,
      modalVisible: false,
      transportType: undefined,
      transportNums: ref([{ number: undefined, count: undefined }]),
      country: undefined,
    });
    const piadOptions = [
      {
        label: t("content.fully"),
        value: 1,
      },
      {
        label: t("content.byAdvance"),
        value: 2,
      },
    ];
    const transportTypes = [
      {
        label: "Вагон",
        value: "van",
      },
      {
        label: "Фура",
        value: "truck",
      },
      {
        label: "Самолет",
        value: "plane",
      },
      {
        label: "Судно",
        value: "ship",
      },
    ];
    const arrivedOptions = [
      {
        label: t("content.arrived_full"),
        value: 1,
      },
      {
        label: t("content.arrived_partially"),
        value: 2,
      },
    ];
    const formState = reactive({
      purchase_id: 0,
      provider: undefined,
      logist_company: undefined,
      paid: undefined,
    });
    const cancel_reason = ref("");

    const beforeUploadProvider = (file) => {
      const isAllowed = allowed_files.includes(file.type);
      if (isAllowed) {
        provider_files.value = [...provider_files.value, file];
        return false;
      } else {
        message.error(`${t("modal.errorFile")} ${file.name}!`);
        return Upload.LIST_IGNORE;
      }
    };

    const beforeUploadPaid = (file) => {
      const isAllowed = allowed_files.includes(file.type);
      if (isAllowed) {
        paid_files.value = [...paid_files.value, file];
        return false;
      } else {
        message.error(`${t("modal.errorFile")} ${file.name}!`);
        return Upload.LIST_IGNORE;
      }
    };

    const handleRemoveProvider = (file) => {
      const index = provider_files.value.indexOf(file);
      const newFileList = provider_files.value.slice();
      newFileList.splice(index, 1);
      provider_files.value = newFileList;
    };

    const handleRemovePaid = (file) => {
      const index = paid_files.value.indexOf(file);
      const newFileList = paid_files.value.slice();
      newFileList.splice(index, 1);
      paid_files.value = newFileList;
    };

    const sendConfirm = (id) => {
      sendState.modalVisible = true;
      sendState.id = id;
    };

    const handleSendModal = async () => {
      if (!sendState.transportType) {
        message.error("Выберите тип транспорта!");
        return false;
      }

      for (const t_num of sendState.transportNums) {
        if (
          !t_num.number ||
          t_num.number === "" ||
          !t_num.count ||
          t_num.count === "" ||
          t_num.count === 0
        ) {
          message.error("Укажите номер транспорта и количество товара!");
          return false;
        }
      }

      if (!sendState.country) {
        message.error("Выберите страну!");
        return false;
      }

      for (const i in sendState.transportNums) {
        sendState.transportNums[i].count = sendState.transportNums[
          i
        ].count.replaceAll(/[\s]/g, "");
      }

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/purchase/on_way", { ...sendState })
        .then(() => {
          message.success(t("modal.successfullyChanged"));
          sendState.modalVisible = false;
          sendState.id = undefined;
          sendState.country = undefined;
          sendState.transportType = undefined;
          sendState.transportNums = [{ number: undefined, count: undefined }];
          refresh();
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
          sendState.modalVisible = false;
          sendState.id = undefined;
          sendState.country = undefined;
          sendState.transportType = undefined;
          sendState.transportNums = [{ number: undefined, count: undefined }];
        });
    };

    const handleOkModal = () => {
      const bodyFormData = new FormData();
      bodyFormData.append("id", formState.purchase_id);
      if (formState.provider)
        bodyFormData.append("provider", formState.provider);
      if (formState.paid) bodyFormData.append("paid", formState.paid);
      if (formState.logist_company)
        bodyFormData.append("logist_company", formState.logist_company);

      for (const file of provider_files.value) {
        bodyFormData.append("provider_files", file);
      }
      for (const file of paid_files.value) {
        bodyFormData.append("paid_files", file);
      }
      emit("onReady", { body: bodyFormData, refreshTable: refresh });
      modalVisible.value = false;
      formState.provider = undefined;
      formState.paid = undefined;
      formState.logist_company = undefined;
      provider_files.value = [];
      paid_files.value = [];
    };
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
    const readyConfirm = (purchase) => {
      modalVisible.value = true;
      formState.purchase_id = purchase.id;
      formState.logist_company = purchase.logist_company;
      formState.paid = purchase.paid;
      formState.provider = purchase.provider;
    };

    const arrivedConfirm = (purchase) => {
      arrived_confirm.visible = true;
      arrived_confirm.purchase = purchase;
    };

    const handleOkArrived = async () => {
      if (!arrived_confirm.purchase || !arrived_confirm.type) {
        message.error(t("modal.fillFields"));
        return false;
      }

      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/purchase/arrived", {
          type: arrived_confirm.type,
          comment: arrived_confirm.comment,
          id: arrived_confirm.purchase,
        })
        .then(() => {
          message.success(t("modal.successfullyChanged"));
          store.commit("setIsLoading", false);
          refresh();
          arrived_confirm.visible = false;
        })
        .catch((err) => {
          {
            console.log(err);
            store.commit("setIsLoading", false);
            arrived_confirm.visible = false;
          }
        });
      arrived_confirm.purchase = undefined;
      arrived_confirm.type = undefined;
      arrived_confirm.comment = undefined;
    };

    const getRemainPer = (purchProduct, tranProducts) => {
      try {
        const remain_per = (
          (100 / Number(purchProduct)) *
          Number(
            tranProducts.length > 0
              ? tranProducts
                  .map((prod) => prod.amount_product)
                  .reduce(
                    (accumulator, currentValue) => accumulator + currentValue
                  )
              : 0
          )
        ).toFixed(0);

        return remain_per > 100 ? 100 : remain_per;
      } catch (e) {
        return 0;
      }
    };

    const getRemainPurchPer = (products) => {
      try {
        if (products.length > 0) {
          let purchase_count = 0;
          let transport_count = 0;
          for (const purchase of products) {
            purchase_count += Number(purchase.volumePurchase);
            if (purchase.transport_products.length > 0) {
              for (const transport of purchase.transport_products) {
                transport_count += Number(transport.amount_product);
              }
            }
          }

          const remain_per = ((100 / purchase_count) * transport_count).toFixed(
            0
          );
          return remain_per > 100 ? 100 : remain_per;
        } else {
          return 0;
        }
      } catch (e) {
        console.log(e);
        return 0;
      }
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

    const addTransportNum = () => {
      sendState.transportNums.push(reactive({ number: undefined }));
    };

    const deleteTransportNum = (index) => {
      sendState.transportNums.splice(index, 1);
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
      readyConfirm,
      defineCancelButton,
      defineReadyButton,
      formState,
      piadOptions,
      modalVisible,
      beforeUploadProvider,
      beforeUploadPaid,
      handleRemovePaid,
      handleRemoveProvider,
      handleOkModal,
      getCategoryById,
      getArticleById,
      handleSearch,
      handleReset,
      ...toRefs(state),
      SearchOutlined,
      FilterOutlined,
      handleSendModal,
      sendState,
      sendConfirm,
      getRemainPurchPer,
      getRemainPer,
      arrivedConfirm,
      arrived_confirm,
      arrivedOptions,
      handleOkArrived,
      getUserNameById,
      getCountryByCode,
      transportTypes,
      addTransportNum,
      deleteTransportNum,
      validateSumm,
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
