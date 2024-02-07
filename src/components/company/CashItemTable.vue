<template>
  <div class="limits-table">
    <a-table
      class="cash-table"
      size="small"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataSource"
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
          v-if="column.dataIndex === 'name'"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <filter-outlined
          v-else
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <svg
            class="pointer"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            @click="showConfirm(record.id)"
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
        </template>
      </template>
    </a-table>
  </div>
</template>
<script>
import store from "@/store";
import validateSumm from "@/utils/validateSumm";
import axios from "axios";
import { computed, defineComponent, reactive, toRefs } from "vue";
import { usePagination } from "vue-request";
import config from "../../../config";
import columns from "../../utils/company/cashItemCols";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;

const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/cash/get_cash_item", {
    params,
    headers,
  });
};

export default defineComponent({
  components: {
    FilterOutlined,
    SearchOutlined,
  },
  setup() {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });

    const { data, run, loading, current, pageSize, refresh } = usePagination(
      queryData,
      {
        formatResult: (res) => res.data.cash_items,
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

    const showConfirm = (itemId) => {
      Modal.confirm({
        title: "Хотите удалить статью ДДС?",
        content: "После удаление невозможно возвратить данную статью!",
        async onOk() {
          store.commit("setIsLoading", true);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${window.localStorage.getItem("jwt")}`;
          await axios({
            method: "delete",
            url: config.API_URL + "api/cash/delete_cash_item",
            data: {
              id: itemId,
            },
          })
            .then(async () => {
              store.commit("setIsLoading", false);
              message.success(t("modal.success"));
              refresh()
            })
            .catch((err) => {
              store.commit("setIsLoading", false);
              if (
                err.response &&
                err.response.data &&
                err.response.data.errors &&
                err.response.data.errors.length !== 0
              ) {
                let errors = "";
                err.response.data.errors.map((error) => {
                  errors += error.msg + " ";
                });
                message.error(errors);
              } else {
                console.log(err);
                message.error(err.response.data.message);
              }
            });
        },
        onCancel() {},
      });
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
      columns,
      validateSumm,
      showConfirm,
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
