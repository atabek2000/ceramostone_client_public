<template>
  <div class="user-table">
    <a-table
      class="industry"
      sticky
      size="small"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataSource"
      :scroll="{ x: 960 }"
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
            column.dataIndex === 'num_act' ||
            column.dataIndex === 'num_1c' ||
            column.dataIndex === 'managerId' ||
            column.dataIndex === 'reciever'
          "
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <filter-outlined
          v-else
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'masterId' && !record.masterId">
          <span style="color: red">{{ $t("table.notSpecified") }} </span>
        </template>
        <template v-else-if="column.dataIndex === 'masterId'">
          {{ $store.getters.getMasterById(record.masterId) }}
        </template>
        <template v-if="column.dataIndex === 'orderStatusId'">
          <IndustryStatus :key="record.id" :order="record" />
        </template>
        <template v-if="column.dataIndex === 'managerId'">
          {{ $store.getters.getManagerById(record.managerId) }}
        </template>
        <template
          v-if="column.dataIndex === 'coord_date' && !record.coord_date"
        >
          <span style="color: red">{{ $t("table.notSpecified") }} </span>
        </template>
        <template
          v-else-if="
            column.dataIndex === 'coord_date' && record.orderStatusId !== 8
          "
        >
          <span style="white-space: nowrap">{{ record.coord_date }}</span
          ><br />
          <span :style="' color:' + getDateDiff(record.coord_date)[1]">
            {{ getDateDiff(record.coord_date)[0] }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'reciever'">
          <span style="white-space: nowrap">{{ record.reciever }}</span>
        </template>
        <template v-if="column.dataIndex === 'term'">
          <span style="white-space: nowrap">{{ record.term }}</span>
        </template>
        <template v-if="column.dataIndex === 'date'">
          <span style="white-space: nowrap">{{ record.date }}</span>
        </template>
        <template v-if="column.dataIndex == 'summa'">
          <span style="white-space: nowrap">{{ record.summa }} ₸</span>
        </template>
        <template v-if="column.dataIndex == 'num_act'">
          <span>{{ record.num_act }}</span> <br />
          <span
            v-if="record.industry_order_updates.length > 0"
            class="order-update-text"
            @click="showOrderUpdates(record.industry_order_updates)"
            >Обновлено</span
          >
        </template>
        <template v-if="column.dataIndex === 'industry_contract'">
          <a
            :href="
              config.API_HOST + 'industry_contract/' + record.industry_contract
            "
            target="_blank"
            >{{ record.industry_contract }}</a
          >
        </template>
        <template v-if="column.dataIndex === 'industry_pay'">
          <a
            :href="config.API_HOST + 'industry_pay/' + record.industry_pay"
            target="_blank"
            >{{ record.industry_pay }}</a
          >
        </template>
        <template v-if="column.dataIndex === 'industry_spec'">
          <a
            :href="config.API_HOST + 'industry_spec/' + record.industry_spec"
            target="_blank"
            >{{ record.industry_spec }}</a
          >
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div
            class="actions-block"
            style="display: flex; justify-content: center"
          >
            <div
              v-if="
                $store.state.user.roleId === 11 &&
                record.industryOrderStatusId === 7
              "
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="pointer"
                @click="readySend(record.id)"
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
            <div>
              <svg
                v-if="
                  defineReadyButton(
                    $store.state.user.roleId,
                    record.industryOrderStatusId
                  )
                "
                @click="readyConfirm(record.id, record.industryOrderStatusId)"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="pointer"
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
            <div>
              <svg
                v-if="
                  defineCancelButton(
                    $store.state.user.roleId,
                    record.industryOrderStatusId
                  )
                "
                @click="confirm(record.id)"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="pointer"
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
              v-if="
                record.managerId === $store.state.user.id &&
                record.industryOrderStatusId < 6
              "
              class="pointer"
              @click="showEditModal(record.id)"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1_2331)">
                  <path
                    d="M3 17.46V20.5C3 20.78 3.22 21 3.5 21H6.54C6.67 21 6.8 20.95 6.89 20.85L17.81 9.94L14.06 6.19L3.15 17.1C3.05 17.2 3 17.32 3 17.46ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                    fill="lightgreen"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_2331">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div
              v-if="
                $store.state.user.roleId === 5 &&
                record.industryOrderStatusId === 6
              "
            >
              <span
                style="
                  border: 1px solid green;
                  background-color: lightgreen;
                  border-radius: 5px;
                  padding: 5px;
                  color: black;
                  cursor: pointer;
                "
                @click="readyConfirm(record.id, record.industryOrderStatusId)"
                >{{ $t("table.complete") }}</span
              >
            </div>
            <div v-if="record.industry_order_sends.length > 0">
              <InfoCircleOutlined
                style="font-size: 20px; color: orange; margin-top: 3px"
                @click="showSends(record.industry_order_sends)"
              />
            </div>
          </div>
        </template>
      </template>
    </a-table>
  </div>
  <a-modal
    v-model:visible="edit_form.visible"
    :title="$t('modal.changingData')"
    :cancelText="' '"
    @ok="editForm()"
  >
    <a-form name="coord_data" :model="edit_form">
      <a-row justify="space-between">
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              v-model:value="edit_form.orderNum1c"
              :placeholder="$t('placeholder.num1C')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              v-model:value="edit_form.orderSumm"
              :placeholder="$t('placeholder.summa')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-date-picker
              v-model:value="edit_form.orderTerm"
              value-format="YYYY-MM-DD"
              :placeholder="$t('placeholder.term')"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-input
              v-model:value="edit_form.edit_reason"
              :placeholder="$t('placeholder.editReason')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item>
            <a-upload
              class="manager-files"
              :file-list="edit_form.fileSpec"
              :multiple="false"
              maxCount="1"
              :before-upload="beforeUploadFileSpec"
              @remove="handleRemoveSpec"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                {{ $t("button.spec") }} (.pdf)
              </a-button>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item>
            <a-upload
              class="manager-files"
              :file-list="edit_form.fileContract"
              :multiple="false"
              maxCount="1"
              :before-upload="beforeUploadfileContract"
              @remove="handleRemoveContract"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                {{ $t("table.contract") }} (.pdf)
              </a-button>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item>
            <a-upload
              class="manager-files"
              :file-list="edit_form.filePay"
              :multiple="false"
              maxCount="1"
              :before-upload="beforeUploadfilePay"
              @remove="handleRemovePay"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                {{ $t("table.payment") }} (.pdf)
              </a-button>
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>

  <a-modal
    v-model:visible="ready_form.visible"
    :title="$t('modal.changingOrderStatus')"
    :cancelText="' '"
    @ok="readyForm()"
  >
    <a-form name="ready_data" :model="ready_form">
      <p>{{ $t("modal.wantChangeOrder") }}</p>
      <a-row justify="space-between" v-if="ready_form.orderStatus === 4">
        <a-col :md="11" :xs="24">
          <a-form-item>
            <a-date-picker
              style="width: 100%"
              v-model:value="ready_form.date"
              :placeholder="$t('table.termDate')"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>

  <a-modal
    v-model:visible="send_form.visible"
    :title="$t('Отправка товара')"
    :cancelText="' '"
    @ok="readySendForm()"
  >
    <a-form name="ready_data" :model="send_form">
      <p>Введите комментарии</p>
      <a-row justify="space-between">
        <a-col :md="24" :xs="24">
          <a-form-item>
            <a-textarea
              style="width: 100%"
              v-model:value="send_form.text"
              placeholder="Комментарии"
            >
            </a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>

  <a-modal
    v-model:visible="sends_form.visible"
    :title="$t('table.shippedItems')"
    :cancelText="' '"
    @ok="sends_form.visible = false"
  >
    <div
      :style="
        'border-radius: 3px; padding: 10px; margin-bottom: 5px; background-color: ' +
        (index % 2 === 0 ? 'GhostWhite' : 'WhiteSmoke')
      "
      v-for="(send, index) in sends_form.sends"
      :key="send.id"
    >
      <span class="send-title">{{
        new Date(send.createdAt).toLocaleString().replace(",", "")
      }}</span>
      <span>{{ send.text }}</span>
    </div>
  </a-modal>
</template>

<script>
import { usePagination } from "vue-request";
import {
  computed,
  defineComponent,
  createVNode,
  reactive,
  ref,
  toRefs,
} from "vue";
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config";
import store from "@/store/index";
import { Modal, message, Upload } from "ant-design-vue";
import defineCancelButton from "@/utils/industry/defineCancelButton";
import defineReadyButton from "@/utils/industry/defineReadyButton";
import columns from "@/utils/industry/industryManagerCols";
import columns_stock from "@/utils/industry/industryStockCols";
import getDateDiff from "@/utils/getDateDiff";
import colors from "@/utils/colors";
import IndustryStatus from "./IndustryStatus.vue";
import getPayById from "@/utils/getPayById";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;

const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/industry/", {
    params,
    headers,
  });
};

export default defineComponent({
  components: {
    IndustryStatus,
    SearchOutlined,
    FilterOutlined,
    InfoCircleOutlined,
  },
  setup(props, { emit }) {
    const cols = ref(store.state.user.roleId === 11 ? columns_stock : columns);
    const state_search = reactive({
      searchText: "",
      searchedColumn: "",
    });
    const edit_form = reactive({
      orderNum1c: undefined,
      orderSumm: undefined,
      orderTerm: undefined,
      edit_reason: undefined,
      fileContract: [],
      fileSpec: [],
      filePay: [],
      visible: false,
      id: undefined,
    });
    const ready_form = reactive({
      visible: false,
      date: undefined,
      orderId: undefined,
      orderStatus: undefined,
    });
    const cancel_reason = ref("");
    const searchInput = ref();
    const send_form = reactive({
      visible: false,
      orderId: undefined,
      text: undefined,
    });

    const readySend = (id) => {
      send_form.visible = true;
      send_form.orderId = id;
    };

    const readySendForm = async () => {
      if (!send_form.text) {
        message.error("Введите комментарии");
        return false;
      }
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/industry/stock_send", {
          id: send_form.orderId,
          text: send_form.text,
        })
        .then(() => {
          store.commit("setIsLoading", false);
          message.success(t("modal.successfullyChanged"));
          refresh();
          send_form.visible = false;
          send_form.orderId = undefined;
          send_form.text = undefined;
        })
        .catch((err) => {
          store.commit("setIsLoading", false);
          send_form.visible = false;
          send_form.orderId = undefined;
          send_form.text = undefined;
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

    const confirm = (orderId) => {
      Modal.confirm({
        title: t("modal.deletingOrder"),
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
            message.error(t("modal.deleteReason"));
          } else {
            emit("onCancel", orderId, cancel_reason.value, refresh);
          }
        },
      });
    };

    const readyConfirm = (id, status) => {
      ready_form.visible = true;
      ready_form.orderStatus = status;
      ready_form.orderId = id;
    };

    const readyForm = () => {
      if (ready_form.orderStatus === 4 && !ready_form.date) {
        message.error("Укажите дату!");
        return false;
      }
      emit("onReady", {
        orderId: ready_form.orderId,
        refreshTable: refresh,
        date: ready_form.date,
      });
      ready_form.visible = false;
      ready_form.orderId = undefined;
      ready_form.orderStatus = undefined;
      ready_form.date = undefined;
    };

    const showEditModal = (id) => {
      edit_form.id = id;
      edit_form.visible = true;
    };

    const sends_form = reactive({
      visible: false,
      sends: undefined,
    });

    const showSends = (sends) => {
      sends_form.visible = true;
      sends_form.sends = sends;
    };

    const editForm = async () => {
      if (edit_form.edit_reason) {
        edit_form.visible = false;
        const formData = new FormData();
        if (edit_form.orderNum1c)
          formData.append("num_1c", edit_form.orderNum1c);
        if (edit_form.orderSumm) formData.append("summa", edit_form.orderSumm);
        if (edit_form.orderTerm) formData.append("term", edit_form.orderTerm);
        formData.append("reason", edit_form.edit_reason);
        formData.append("id", edit_form.id);
        formData.append("industry_spec", edit_form.fileSpec[0]);
        formData.append("industry_contract", edit_form.fileContract[0]);
        formData.append("industry_pay", edit_form.filePay[0]);

        store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios
          .put(config.API_URL + "api/industry/edit", formData)
          .then(() => {
            store.commit("setIsLoading", false);
            message.success(t("modal.successfullyChanged"));
            refresh();
            edit_form.visible = false;
            edit_form.id = undefined;
            edit_form.edit_reason = undefined;
            edit_form.orderNum1c = undefined;
            edit_form.orderSumm = undefined;
            edit_form.orderTerm = undefined;
            edit_form.fileContract = [];
            edit_form.fileSpec = [];
            edit_form.filePay = [];
          })
          .catch((err) => {
            edit_form.visible = false;
            edit_form.id = undefined;
            edit_form.edit_reason = undefined;
            edit_form.orderNum1c = undefined;
            edit_form.orderSumm = undefined;
            edit_form.orderTerm = undefined;
            edit_form.fileContract = [];
            edit_form.fileSpec = [];
            edit_form.filePay = [];
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
      } else {
        message.error(t("modal.editReason"));
      }
    };

    const beforeUploadFileSpec = (file) => {
      if (file.type === "application/pdf") {
        edit_form.fileSpec = [file];
        return false;
      } else {
        message.error(`${t("modal.errorFile")} ${file.name}!`);
        return Upload.LIST_IGNORE;
      }
    };

    const beforeUploadfileContract = (file) => {
      if (file.type === "application/pdf") {
        edit_form.fileContract = [file];
        return false;
      } else {
        message.error(`${t("modal.errorFile")} ${file.name}!`);
        return Upload.LIST_IGNORE;
      }
    };

    const beforeUploadfilePay = (file) => {
      if (file.type === "application/pdf") {
        edit_form.filePay = [file];
        return false;
      } else {
        message.error(`${t("modal.errorFile")} ${file.name}!`);
        return Upload.LIST_IGNORE;
      }
    };

    const handleRemovePay = () => {
      edit_form.filePay = undefined;
    };
    const handleRemoveContract = () => {
      edit_form.fileContract = undefined;
    };
    const handleRemoveSpec = () => {
      edit_form.fileSpec = undefined;
    };

    const showOrderUpdates = (updates) => {
      emit("showUpdates", updates);
    };

    const { data, run, loading, current, pageSize, refresh } = usePagination(
      queryData,
      {
        formatResult: (res) => {
          store.commit("setSetTotalOrders", res.data.orders.count);
          return res.data.orders;
        },
        pagination: {
          currentKey: "page",
          pageSizeKey: "limit",
          totalKey: "count",
        },
      }
    );
    const dataSource = computed(() => data.value?.rows || []);
    const pagination = computed(() => ({
      total: data.value?.count || store.state.totalOrders,
      current: current.value,
      pageSize: pageSize.value,
    }));
    const handleTableChange = (pag, filters, sorter) => {
      run({
        limit: pag.pageSize,
        page: pag?.current,
        sortBy: sorter.field,
        sortType: sorter.order === "descend" || !sorter.field ? "DESC" : "ASC",
        ...filters,
      });
    };
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      state_search.searchText = selectedKeys[0];
      state_search.searchedColumn = dataIndex;
    };
    const handleReset = (clearFilters) => {
      clearFilters({
        confirm: true,
      });
      state_search.searchText = "";
    };
    return {
      dataSource,
      pagination,
      loading,
      columns: cols,
      handleTableChange,
      confirm,
      refresh,
      defineReadyButton,
      defineCancelButton,
      getDateDiff,
      config,
      colors,
      getPayById,
      searchInput,
      handleSearch,
      handleReset,
      ...toRefs(state_search),
      SearchOutlined,
      FilterOutlined,
      edit_form,
      showEditModal,
      editForm,
      beforeUploadFileSpec,
      beforeUploadfileContract,
      beforeUploadfilePay,
      handleRemoveContract,
      handleRemovePay,
      handleRemoveSpec,
      showOrderUpdates,
      readyConfirm,
      ready_form,
      readyForm,
      readySend,
      readySendForm,
      send_form,
      InfoCircleOutlined,
      showSends,
      sends_form,
    };
  },
  computed: {
    ordersCount() {
      return store.state.totalOrders;
    },
    orderStatus() {
      return store.state.orderStatuses;
    },
  },
  watch: {
    ordersCount() {
      this.refresh();
    },
    orderStatus() {
      this.columns.filter((col) => {
        if (col.dataIndex == "orderStatusId") {
          col.filters = store.state.orderStatuses;
        }
      });
    },
    dataSource: function () {
      if (store.state.user.roleId === 11) {
        this.columns = columns_stock;
        this.columns.filter((col) => {
          if (col.dataIndex == "orderStatusId") {
            col.filters = store.state.orderStatuses;
          }
        });
      }
    },
  },
});
</script>

<style>
.manager-files .ant-upload {
  width: 100%;
}
.manager-files .ant-btn {
  width: 100%;
}

.send-block {
  border: 1px solid #1890ff;
  background-color: lightblue;
  padding: 5px;
  border-radius: 5px;
  color: black;
  margin-bottom: 10px;
}

.send-title {
  font-size: 10px;
  display: block;
}

.send-text {
  display: block;
}

.actions-block div {
  margin-right: 5px;
}

.order-update-text {
  color: black;
  font-size: 12px;
  background-color: lightseagreen;
  padding: 3px;
  border-radius: 3px;
  cursor: pointer;
}
</style>
