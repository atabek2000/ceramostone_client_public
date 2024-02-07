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
      </template>
    </a-table>
  </div>
</template>

<script>
import { usePagination } from "vue-request";
import { computed, defineComponent, reactive, ref, toRefs } from "vue";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config";
import store from "@/store/index";
import defineCancelButton from "@/utils/defineCancelButton";
import defineReadyButton from "@/utils/defineReadyButton";
import columns from "@/utils/orders/orderMonitorCols";
import getDateDiff from "@/utils/getDateDiff";
import colors from "@/utils/colors";
import OrderStatus from "./OrderStatus.vue";
import depName from "@/utils/getDepartmentNameById";
import getPayById from "@/utils/getPayById";
// import i18n from "@/i18n/i18n";
// const { t } = i18n.global;

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

    const searchInput = ref();

    const showEditModal = (id) => {
      edit_form.id = id;
      edit_form.visible = true;
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
      getPayById,
      searchInput,
      handleSearch,
      handleReset,
      ...toRefs(state),
      SearchOutlined,
      FilterOutlined,
      showEditModal,
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
