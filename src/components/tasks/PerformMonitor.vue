<template>
  <div class="user-table">
    <a-table
      size="small"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataSource"
      :scroll="{ x: 1200 }"
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
        <template v-if="column.dataIndex === 'num'">
          <router-link :to="'/performs/' + record.id">{{
            record.num
          }}</router-link>
        </template>
        <template v-if="column.dataIndex === 'theme'">
          <router-link :to="'/performs/' + record.id">{{
            record.theme
          }}</router-link>
        </template>
        <template v-if="column.dataIndex === 'deadline'">
          {{ getLocaleDateAsString(record.deadline).split(" ")[0] }}
        </template>
        <template v-if="column.dataIndex === 'approver'">
          {{
            $store.state.users.filter((user) => user.id == record.approver)[0]
              ?.name
          }}
        </template>
        <template v-if="column.dataIndex === 'status'">
          <TaskStatus :task="record"></TaskStatus>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { usePagination } from "vue-request";
import { computed, defineComponent, reactive, toRefs } from "vue";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons-vue";
import axios from "axios";
// import store from "@/store/index";
import columns from "@/utils/tasks/performMonitorCols";
import getLocaleDateAsString from "@/utils/getLocaleDateAsString";
import TaskStatus from "@/components/tasks/TaskStatus.vue";

import config from "../../../config";
const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/task/perform_list", {
    params,
    headers,
  });
};

export default defineComponent({
  components: {
    SearchOutlined,
    FilterOutlined,
    TaskStatus,
  },
  setup() {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });
    const { data, run, loading, current, pageSize, refresh } = usePagination(
      queryData,
      {
        formatResult: (res) => res.data,
        pagination: {
          currentKey: "page",
          pageSizeKey: "limit",
          totalKey: "data",
        },
      }
    );
    const dataSource = computed(() => data.value?.rows || []);
    const pagination = computed(() => ({
      total: data.value?.count || 100,
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

    return {
      dataSource,
      pagination,
      loading,
      handleTableChange,
      handleSearch,
      handleReset,
      refresh,
      ...toRefs(state),
      columns,
      getLocaleDateAsString,
    };
  },
});
</script>

<style></style>
