<template>
  <div class="container">
    <CompanyLogo />

    <a-tabs v-model:activeKey="activeKey" class="company-tab">
      <a-tab-pane key="1">
        <template #tab>
          <a-typography-text type="danger">Лимиты отдела</a-typography-text>
        </template>
        <AddLImits @fetchDepartments="fetchDepartments" />
        <LimitsTable />
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #tab>
          <a-typography-text type="danger">Статья ДДС</a-typography-text>
        </template>
        <AddCashItem @createCashItem="createCashItem" />
        <CashItemTable />
      </a-tab-pane>
      <a-tab-pane key="3">
        <template #tab>
          <a-typography-text type="danger">Список компаний</a-typography-text>
        </template>
        <AddCompany @createCompany="createCompany" />
        <CompanyTable @createCompany="createCompany" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import CompanyLogo from "@/components/CompanyLogo.vue";
import axios from "axios";
import AddLImits from "../components/company/AddLImits.vue";
import AddCashItem from "../components/company/AddCashItem.vue";
import AddCompany from "../components/company/AddCompany.vue";
import LimitsTable from "../components/company/LimitsTable.vue";
import CashItemTable from "../components/company/CashItemTable.vue";
import CompanyTable from "../components/company/CompanyTable.vue";
import config from "../../config.js";
import store from "@/store/index.js";
import fetchUsers from "@/utils/fetchUsers";
import { message } from "ant-design-vue";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default {
  components: {
    AddLImits,
    AddCashItem,
    LimitsTable,
    CompanyLogo,
    CashItemTable,
    AddCompany,
    CompanyTable,
  },
  setup() {
    return {};
  },
  methods: {
    async fetchDepartments() {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/user/departments")
        .then((res) => {
          const departments = [];
          res.data.departments.rows.forEach((dep) => {
            departments.push({ value: dep.id, label: dep.name });
          });
          store.commit("setDepartments", departments);
        })
        .catch((e) => console.log(e));
    },
    async fetchCompanies() {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/company/companies")
        .then((res) => {
          store.commit(
            "setCompanies",
            res.data.companies.rows.map((st) => {
              return {
                text: st.name,
                value: st.id,
              };
            })
          );
          return true;
        })
        .catch((e) => console.log(e));
    },

    async createCompany(companyModal) {
      if (companyModal.name) {
        store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios({
          method: "post",
          url: config.API_URL + "api/company/create_company",
          data: {
            name: companyModal.name,
            id: companyModal.id,
            directorId: companyModal.directorId,
            chiefAccountantId: companyModal.chiefAccountantId,
            cashierId: companyModal.cashierId,
            cashierBankId: companyModal.cashierBankId,
          },
        })
          .then(async () => {
            store.commit("setIsLoading", false);
            message.success(t("modal.successfullyAdded"));
            store.commit("setSetTotalPurchases", Math.random());
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
      } else {
        message.error("Заполните обязательные поля");
      }
    },
  },
  async beforeMount() {
    await this.fetchDepartments();
    await this.fetchCompanies();
    await fetchUsers();
  },
};
</script>

<style scoped>
.company-tab .ant-typography {
  font-size: 18px;
}
</style>
