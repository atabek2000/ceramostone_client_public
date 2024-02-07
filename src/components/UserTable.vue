<template>
  <div class="user-table">
    <a-table
      class="user-table"
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
            column.dataIndex === 'name' ||
            column.dataIndex === 'phone' ||
            column.dataIndex === 'email'
          "
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <filter-outlined
          v-else
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          {{ record.id }} ) {{ record.name }}
        </template>
        <template v-if="column.dataIndex === 'role'">
          <p>{{ getRoleNameById(record.roleId).value }}</p>
        </template>
        <template v-if="column.dataIndex === 'city'">
          <p>{{ getCityById(record.cityId) }}</p>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <svg
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
        </template>
      </template>
    </a-table>
  </div>
</template>
<script>
import { usePagination } from "vue-request";
import {
  computed,
  defineComponent,
  onBeforeMount,
  createVNode,
  h,
  reactive,
} from "vue";
import {
  ExclamationCircleOutlined,
  ScheduleFilled,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../config.js";
import store from "@/store/index";
import { Modal } from "ant-design-vue";
import getRoleNameById from "@/utils/getRoleNameById";
import getCityById from "@/utils/getCityById";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;

const columns = [
  {
    title: t("table.name"),
    dataIndex: "name",
    key: "name",
    customFilterDropdown: true,
  },
  {
    title: t("table.email"),
    dataIndex: "email",
    customFilterDropdown: true,
  },
  {
    title: t("table.phone"),
    dataIndex: "phone",
    key: "phone",
    customFilterDropdown: true,
  },
  {},
  {
    title: t("table.role"),
    dataIndex: "role",
  },
  {},
  {
    title: t("table.city"),
    dataIndex: "city",
  },
  {
    title: t("table.action"),
    dataIndex: "action",
    align: "center",
  },
];
const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/user/", {
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
    onBeforeMount(async () => {
      await axios
        .get(config.API_URL + "api/user/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        })
        .then(async (res) => {
          store.commit("setSetTotalUsers", res.data.users.count);
        })
        .catch((e) => console.log(e));
    });
    const confirm = (userId) => {
      Modal.confirm({
        title: t("modal.deletingUser"),
        icon: createVNode(ExclamationCircleOutlined),
        content: t("modal.wantDeleteUser"),
        okText: t("modal.yes"),
        cancelText: t("modal.cancel"),
        onOk() {
          deleteUser(userId);
        },
      });
    };
    const success = () => {
      Modal.success({
        title: t("modal.success"),
        content: h("p", t("modal.userSuccessDeleted")),
      });
    };
    const error = (errorText) => {
      Modal.error({
        title: t("modal.error"),
        content: errorText,
      });
    };
    const deleteUser = async (userId) => {
      store.commit("setIsLoading", true);
      try {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios
          .delete(config.API_URL + "api/user/", { data: { id: userId } })
          .then(() => {
            success();
            refresh();
          });
      } catch (err) {
        if (err.response && err.response.data.errors.length !== 0) {
          let errors = "";
          err.response.data.errors.map((error) => [
            (errors += error.msg + " "),
          ]);
          error(errors);
        } else {
          error(err.response.data.message);
        }
      }
      store.commit("setIsLoading", false);
    };
    const {
      data: dataSource,
      run,
      loading,
      current,
      pageSize,
      refresh,
    } = usePagination(queryData, {
      formatResult: (res) => res.data.users.rows,
      pagination: {
        currentKey: "page",
        pageSizeKey: "limit",
        totalKey: "data",
      },
    });
    const pagination = computed(() => ({
      total: store.state.totalUsers,
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
      columns,
      handleTableChange,
      confirm,
      refresh,
      getRoleNameById,
      getCityById,
      ScheduleFilled,
      SearchOutlined,
      FilterOutlined,
      handleSearch,
      handleReset,
    };
  },
  computed: {
    usersCount() {
      return store.state.totalUsers;
    },
  },
  watch: {
    usersCount() {
      this.refresh();
    },
  },
});
</script>
