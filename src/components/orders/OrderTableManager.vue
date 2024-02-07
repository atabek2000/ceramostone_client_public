<template>
  <div class="user-table">
    <a-table
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
            column.dataIndex === 'managerId' ||
            column.dataIndex === 'num_1c' ||
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
          <OrderStatus :key="record.id" :order="record" />
        </template>
        <template v-if="column.dataIndex === 'managerId'">
          {{ $store.getters.getManagerById(record.managerId) }}
        </template>
        <template v-if="column.dataIndex === 'depId'">
          {{ depName(record.num_act.match(/[a-zA-Z]/)[0], "by_short") }}
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
          <span>{{ record.num_act }}</span>
          <span
            v-if="record.paid_type"
            :style="
              'color:' +
              colors.light.dark +
              ';background:' +
              colors.light.secondary +
              ';padding: 1px; border-radius:2px;'
            "
            >{{ getPayById(record.paid_type) }}</span
          >
          <p
            v-if="record.order_updates.length > 0"
            style="color: red; cursor: pointer"
            @click="showUpdates(record.order_updates)"
          >
            {{ $t("modal.changed") }}: {{ record.order_updates.length }}
          </p>
        </template>
        <template v-if="column.dataIndex === 'word'">
          <a :href="config.API_HOST + 'word/' + record.word" target="_blank">{{
            record.word
          }}</a>
        </template>
        <template v-if="column.dataIndex === 'excel'">
          <a
            :href="config.API_HOST + 'excel/' + record.excel"
            target="_blank"
            >{{ record.excel }}</a
          >
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div style="display: flex; justify-content: center">
            <div
              v-if="
                defineCancelButton(
                  $store.state.user.roleId,
                  record.orderStatusId,
                  $store.state.user.id,
                  record.managerId
                )
              "
            >
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
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_263">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div>
              <svg
                v-if="
                  (record.orderStatusId === 4 || record.orderStatusId === 6) &&
                  record.managerId === $store.state.user.id
                "
                class="pointer"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                @click="stopConfirm(record.id)"
              >
                <g clip-path="url(#clip0_1_1311)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9 16H15C15.55 16 16 15.55 16 15V9C16 8.45 15.55 8 15 8H9C8.45 8 8 8.45 8 9V15C8 15.55 8.45 16 9 16ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                    :fill="colors.light.warning"
                    fill-opacity="1"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_1311">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <svg
                v-else-if="
                  record.orderStatusId === 9 &&
                  record.managerId === $store.state.user.id
                "
                class="pointer"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                @click="runConfirm(record.id)"
              >
                <path
                  d="M12 4V2.21C12 1.76 11.46 1.54 11.15 1.86L8.35 4.65C8.15 4.85 8.15 5.16 8.35 5.36L11.14 8.15C11.46 8.46 12 8.24 12 7.79V6C15.31 6 18 8.69 18 12C18 12.79 17.85 13.56 17.56 14.25C17.41 14.61 17.52 15.02 17.79 15.29C18.3 15.8 19.16 15.62 19.43 14.95C19.8 14.04 20 13.04 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 11.21 6.15 10.44 6.44 9.75C6.59 9.39 6.48 8.98 6.21 8.71C5.7 8.2 4.84 8.38 4.57 9.05C4.2 9.96 4 10.96 4 12C4 16.42 7.58 20 12 20V21.79C12 22.24 12.54 22.46 12.85 22.14L15.64 19.35C15.84 19.15 15.84 18.84 15.64 18.64L12.85 15.85C12.54 15.54 12 15.76 12 16.21V18Z"
                  :fill="colors.light.warning"
                  fill-opacity="1"
                />
              </svg>
            </div>
            <div
              v-if="record.managerId === $store.state.user.id"
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
              :file-list="edit_form.fileSmeta"
              :multiple="false"
              maxCount="1"
              :before-upload="beforeUploadFileSmeta"
              @remove="handleRemoveSmeta"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                {{ $t("button.estim") }} (.pdf)
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
  createVNode,
  reactive,
  ref,
  toRefs,
} from "vue";
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config";
import store from "@/store/index";
import { Modal, message, Upload } from "ant-design-vue";
import defineCancelButton from "@/utils/defineCancelButton";
import defineReadyButton from "@/utils/defineReadyButton";
import columns from "@/utils/orders/orderManagerCols";
import getDateDiff from "@/utils/getDateDiff";
import colors from "@/utils/colors";
import OrderStatus from "./OrderStatus.vue";
import depName from "@/utils/getDepartmentNameById";
import getPayById from "@/utils/getPayById";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;

const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/order/", {
    params,
    headers,
  });
};

export default defineComponent({
  components: {
    OrderStatus,
    SearchOutlined,
    FilterOutlined,
  },
  setup(props, { emit }) {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });
    const edit_form = reactive({
      orderNum1c: undefined,
      orderSumm: undefined,
      orderTerm: undefined,
      edit_reason: undefined,
      fileSpec: [],
      fileSmeta: [],
      visible: false,
      id: undefined,
    });
    const cancel_reason = ref("");
    const stop_reason = ref("");
    const searchInput = ref();
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
    const stopConfirm = (orderId) => {
      Modal.confirm({
        title: t("modal.stoppingOrder"),
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode("textarea", {
          onChange: (e) => {
            stop_reason.value = e.target.value;
          },
        }),
        okText: t("modal.yes"),
        cancelText: t("modal.cancel"),
        onOk() {
          if (stop_reason.value == "") {
            message.error(t("modal.stopReason"));
          } else {
            emit("onStop", {
              orderId,
              stop_reason: stop_reason.value,
              refreshTable: refresh,
            });
          }
        },
      });
    };
    const runConfirm = (orderId) => {
      Modal.confirm({
        title: t("modal.renewallingOrder"),
        icon: createVNode(ExclamationCircleOutlined),
        content: t("modal.wantRenewalOrder"),
        okText: t("modal.yes"),
        cancelText: t("modal.cancel"),
        onOk() {
          emit("onRun", { orderId, refreshTable: refresh });
        },
      });
    };

    const showEditModal = (id) => {
      edit_form.id = id;
      edit_form.visible = true;
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
        formData.append("word", edit_form.fileSpec[0]);
        formData.append("excel", edit_form.fileSmeta[0]);

        store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios
          .put(config.API_URL + "api/order/edit", formData)
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
            edit_form.fileSmeta = [];
            edit_form.fileSpec = [];
          })
          .catch((err) => {
            edit_form.visible = false;
            edit_form.id = undefined;
            edit_form.edit_reason = undefined;
            edit_form.orderNum1c = undefined;
            edit_form.orderSumm = undefined;
            edit_form.orderTerm = undefined;
            edit_form.fileSmeta = [];
            edit_form.fileSpec = [];
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

    const beforeUploadFileSmeta = (file) => {
      if (file.type === "application/pdf") {
        edit_form.fileSmeta = [file];
        return false;
      } else {
        message.error(`${t("modal.errorFile")} ${file.name}!`);
        return Upload.LIST_IGNORE;
      }
    };

    const handleRemoveSmeta = () => {
      edit_form.fileSmeta = undefined;
    };
    const handleRemoveSpec = () => {
      edit_form.fileSpec = undefined;
    };

    const showUpdates = (updates) => {
      emit("showUpdates", updates);
    };

    const { data, run, loading, current, pageSize, refresh } = usePagination(
      queryData,
      {
        formatResult: (res) => res.data.orders,
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
      store.commit("setOrderFilters", filters);
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
      state.searchText = selectedKeys[0];
      state.searchedColumn = dataIndex;
    };
    const handleReset = (clearFilters) => {
      clearFilters({
        confirm: true,
      });
      state.searchText = "";
    };
    return {
      dataSource,
      pagination,
      loading,
      columns,
      handleTableChange,
      confirm,
      refresh,
      defineReadyButton,
      defineCancelButton,
      getDateDiff,
      config,
      colors,
      runConfirm,
      stopConfirm,
      getPayById,
      searchInput,
      handleSearch,
      handleReset,
      ...toRefs(state),
      SearchOutlined,
      FilterOutlined,
      edit_form,
      showEditModal,
      editForm,
      beforeUploadFileSpec,
      beforeUploadFileSmeta,
      handleRemoveSmeta,
      handleRemoveSpec,
      showUpdates,
      depName,
    };
  },
  computed: {
    ordersCount() {
      return store.state.totalOrders;
    },
  },
  watch: {
    ordersCount() {
      this.refresh();
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
</style>
