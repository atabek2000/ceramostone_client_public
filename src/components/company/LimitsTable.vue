<template>
  <div class="limits-table">
    <a-table
      class="cash-table"
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
          v-if="column.dataIndex === 'year'"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <filter-outlined
          v-else
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'company'">
          {{ record.department?.company?.name }}
        </template>
        <template v-if="column.dataIndex === 'department'">
          <a
            @click="
              limitModel.data = record;
              limitModel.visible = true;
            "
            >{{ record.department?.name }}</a
          >
        </template>
        <template v-if="column.dataIndex === 'year'">
          {{ record.year }}
        </template>
        <template v-if="column.dataIndex === 'limit'">
          {{
            validateSumm(
              String(
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].reduce((acc, index) => {
                  return acc + record["limit_" + index];
                }, 0)
              )
            )
          }}
        </template>
        <template v-if="column.dataIndex === 'limit_spent'">
          {{
            validateSumm(
              String(
                record.department?.cash_orders.reduce((acc, obj) => {
                  return acc + obj.sum;
                }, 0)
              )
            )
          }}
        </template>
        <template v-if="column.dataIndex === 'limit_un_spent'">
          {{
            validateSumm(
              String(
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].reduce((acc, index) => {
                  return acc + record["limit_" + index];
                }, 0) -
                  record.department?.cash_orders?.reduce((acc, obj) => {
                    return acc + obj.sum;
                  }, 0)
              )
            )
          }}
        </template>
      </template>
    </a-table>
  </div>

  <a-modal
    v-model:visible="limitModel.visible"
    title="Лимит отдела"
    @ok="limitModel.visible = false"
  >
    <a-typography-title :level="2">
      {{ limitModel.data.year }} год</a-typography-title
    >
    <a-row :gutter="[8, 8]">
      <a-col :md="11" :xs="24" v-for="mth in 12" :key="mth">
        <a-typography-title :level="5"
          >{{ mth }} месяц:
          {{
            limitModel.data[`limit_${mth}`]
              ? validateSumm(String(limitModel.data[`limit_${mth}`]))
              : 0
          }}
          тг</a-typography-title
        >
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import store from "@/store";
import validateSumm from "@/utils/validateSumm";
import axios from "axios";
import { computed, defineComponent, reactive, ref, toRefs } from "vue";
import { usePagination } from "vue-request";
import config from "../../../config";
import columns from "../../utils/company/limitsCols";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons-vue";

const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/company/limits_by_company", {
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

    const limitModel = reactive({
      visible: false,
      data: undefined,
    });

    const { data, run, loading, current, pageSize, refresh } = usePagination(
      queryData,
      {
        formatResult: (res) => res.data.limits,
        pagination: {
          currentKey: "page",
          pageSizeKey: "limit",
          totalKey: "data",
        },
      }
    );
    const dataSource = computed(() => data.value?.rows || []);
    const pagination = computed(() => ({
      total: data.value?.count,
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
      handleSearch,
      handleReset,
      pagination,
      handleTableChange,
      dataSource,
      loading,
      refresh,
      ...toRefs(state),
      columns: ref(columns),
      validateSumm,
      limitModel,
    };
  },
  computed: {
    companies() {
      return store.state.companies;
    },
    departments() {
      return store.state.departments;
    },
    orderCount() {
      return store.state.totalPurchases;
    },
  },
  watch: {
    companies() {
      this.columns.value = this.columns.map((col) => {
        if (col.dataIndex === "company") {
          col.filters = store.state.companies.map((dep) => {
            return { text: dep.text, value: dep.value };
          });
        }
        return col;
      });
    },
    departments() {
      this.columns.value = this.columns.map((col) => {
        if (col.dataIndex === "department") {
          col.filters = store.state.departments.map((dep) => {
            return { text: dep.label, value: dep.value };
          });
        }
        return col;
      });
    },
    orderCount() {
      this.refresh();
    },
  },
});
</script>
