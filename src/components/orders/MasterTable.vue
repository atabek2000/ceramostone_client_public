<template>
  <div class="user-table">
    <a-table
      size="small"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataSource"
      :scroll="{ x: 500 }"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'city'">
          <p>{{ getCityById(record.cityId) }}</p>
        </template>
        <template
          v-if="
            column.dataIndex === 'action' &&
            ($store.state.user.id === 1 ||
              record.userId === $store.state.user.id)
          "
        >
          <svg
            class="button"
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
import { computed, defineComponent, onBeforeMount, createVNode, h } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config.js";
import store from "@/store/index";
import { Modal } from "ant-design-vue";
import getCityById from "../../utils/getCityById";
import { useI18n } from "vue-i18n";

const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/user/master/", {
    params,
    headers,
  });
};
export default defineComponent({
  setup() {
    const { t } = useI18n({ useScope: "global" });
    const columns = [
      {
        title: t("table.name"),
        dataIndex: "name",
        sorter: true,
        width: "20%",
      },
      {
        title: t("table.phone"),
        dataIndex: "phone",
        width: "20%",
      },
      {
        title: t("table.city"),
        dataIndex: "city",
        width: "20%",
      },
      {
        title: t("table.action"),
        dataIndex: "action",
        width: "20%",
        align: "center",
      },
    ];
    onBeforeMount(() => {
      getMastersCount();
    });
    const getMastersCount = async () => {
      await axios
        .get(config.API_URL + "api/user/master/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        })
        .then(async (res) => {
          store.commit("setSetTotalMasters", res.data.masters.count);
        })
        .catch((e) => console.log(e));
    };
    const confirm = (masterId) => {
      Modal.confirm({
        title: t("modal.deletingMaster"),
        icon: createVNode(ExclamationCircleOutlined),
        content: t("modal.wantDeleteMaster"),
        okText: t("modal.yes"),
        cancelText: t("modal.cancel"),
        onOk() {
          deleteMaster(masterId);
        },
      });
    };
    const success = () => {
      Modal.success({
        title: t("modal.success"),
        content: h("p", t("modal.masterSuccessDeleted")),
      });
    };
    const error = (errorText) => {
      Modal.error({
        title: t("modal.error"),
        content: errorText,
      });
    };
    const deleteMaster = async (masterId) => {
      store.commit("setIsLoading", true);
      try {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios
          .delete(config.API_URL + "api/user/master/", {
            data: { id: masterId },
          })
          .then(() => {
            success();
            refresh();
          });
      } catch (e) {
        console.log(e);
        error(e.message);
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
      formatResult: (res) => res.data.masters.rows,
      pagination: {
        currentKey: "page",
        pageSizeKey: "limit",
      },
    });
    const pagination = computed(() => ({
      total: store.state.totalMasters,
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
    return {
      dataSource,
      pagination,
      loading,
      columns,
      handleTableChange,
      confirm,
      refresh,
      config,
      getCityById,
      t,
    };
  },
  computed: {
    mastersCount() {
      return store.state.totalMasters;
    },
  },
  watch: {
    mastersCount() {
      this.refresh();
    },
  },
});
</script>
<style>
.ant-table-tbody {
  margin-top: 10px !important;
}
.ant-table-cell,
.ant-table-cell-fix-left,
.ant-table-cell-fix-right {
  background-color: #181734 !important;
  color: white !important;
}
.ant-table-pagination,
.ant-table-pagination-right {
  background-color: #181734 !important;
  color: white !important;
}
</style>
