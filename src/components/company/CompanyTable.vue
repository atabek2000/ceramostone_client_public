import { deprecate } from 'util'; import { deprecate } from 'util';
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
          v-if="
            column.dataIndex === 'num_cash' ||
            column.dataIndex === 'contractor' ||
            column.dataIndex === 'cash_item'
          "
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <filter-outlined
          v-else
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template
          v-if="
            column.dataIndex === 'directorId' ||
            column.dataIndex === 'chiefAccountantId' ||
            column.dataIndex === 'cashierId' ||
            column.dataIndex === 'cashierBankId'
          "
        >
          <template v-if="record[column.dataIndex]">
            <p v-if="getUserNameById(record[column.dataIndex])">
              {{ getUserNameById(record[column.dataIndex]) }}
            </p>
            <a-typography-text type="danger" v-else>
              Пользователь удален
            </a-typography-text>
          </template>
          <a-typography-text type="danger" v-else>Не указан</a-typography-text>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="pointer" @click="showEditModal(record)">
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
        </template>
      </template>
    </a-table>
  </div>

  <a-modal
    v-model:visible="editModal.visible"
    :title="$t('Редактировать')"
    :cancelText="' '"
    :width="700"
    @ok="editCompany()"
  >
    <a-form name="coord_data" :model="edit_form" :label-col="{ span: 10 }">
      <a-row justify="space-between">
        <a-col :md="11" :xs="24">
          <a-form-item label="Название">
            <a-input
              class="br-10"
              v-model:value="editModal.name"
              placeholder="*Название"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item label="Директор">
            <a-select
              class="br-10"
              v-model:value="editModal.directorId"
              style="width: 100%"
              :options="
                $store.state.users.filter(
                  (user) => user.roleId === 7 && user.sections && user.sections.includes('c_dir')
                )
              "
              placeholder="*Директор"
              :field-names="{ label: 'name', value: 'id' }"
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item label="Бухгалтер">
            <a-select
              class="br-10"
              v-model:value="editModal.chiefAccountantId"
              style="width: 100%"
              :options="$store.state.users.filter((user) => user.roleId === 20)"
              placeholder="*Бухгалтер"
              :field-names="{ label: 'name', value: 'id' }"
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item label="Кассир">
            <a-select
              class="br-10"
              v-model:value="editModal.cashierId"
              style="width: 100%"
              :options="$store.state.users.filter((user) => user.roleId === 3)"
              placeholder="*Кассир"
              :field-names="{ label: 'name', value: 'id' }"
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24">
          <a-form-item label="Кассир по банку">
            <a-select
              class="br-10"
              v-model:value="editModal.cashierBankId"
              style="width: 100%"
              :options="$store.state.users.filter((user) => user.roleId === 21)"
              placeholder="*Кассир по банку"
              :field-names="{ label: 'name', value: 'id' }"
            >
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import store from "@/store";
import getUserNameById from "@/utils/getUserNameById";
import validateSumm from "@/utils/validateSumm";
import axios from "axios";
import { computed, defineComponent, reactive, toRefs } from "vue";
import { usePagination } from "vue-request";
import config from "../../../config";
import columns from "../../utils/company/companyCols";

const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/company/companies", {
    params,
    headers,
  });
};

export default defineComponent({
  setup(props, { emit }) {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });

    const editModal = reactive({
      visible: false,
      id: undefined,
      name: undefined,
      directorId: undefined,
      chiefAccountantId: undefined,
      cashierId: undefined,
      cashierBankId: undefined,
    });

    const showEditModal = (company) => {
      editModal.visible = true;
      editModal.id = company.id;
      editModal.name = company.name;
      editModal.directorId = company.directorId;
      editModal.chiefAccountantId = company.chiefAccountantId;
      editModal.cashierId = company.cashierId;
      editModal.cashierBankId = company.cashierBankId;
    };

    const editCompany = async () => {
      emit("createCompany", editModal);

      editModal.visible = false;
      editModal.name = undefined;
      editModal.directorId = undefined;
      editModal.chiefAccountantId = undefined;
      editModal.cashierId = undefined;
      editModal.cashierBankId = undefined;
    };

    const { data, run, loading, current, pageSize, refresh } = usePagination(
      queryData,
      {
        formatResult: (res) => res.data.companies,
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
      columns,
      validateSumm,
      getUserNameById,
      showEditModal,
      editModal,
      editCompany,
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
