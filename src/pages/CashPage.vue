<template>
  <div class="orderPageBlock container">
    <h2 style="color: red; text-align: center">
      Уважаемые пользователи, данный раздел сайта работает в тестовом режиме!
    </h2>
    <CompanyLogo />

    <AddCash
      v-if="![7].includes($store.state.user.roleId)"
      :currencyOptions="currencyOptions"
      :issuanOptions="issuanOptions"
      :contractorTypes="contractorTypes"
      @fetchDepartmentLimits="fetchDepartmentLimits"
    />

    <div class="excelButtonBlock">
      <a class="excelButton" @click="createExcel">Скачать отчет</a>
    </div>

    <!-- создатель -->
    <CashTableCreator
      v-if="
        ![3, 20, 21].includes($store.state.user.roleId) &&
        !$store.state.user.section?.includes('c_head') &&
        !$store.state.user.section?.includes('c_dir')
      "
      :currencyOptions="currencyOptions"
      :issuanOptions="issuanOptions"
      :contractorTypes="contractorTypes"
      @showJournal="showJournal"
      @cancel="cancel"
    />
    <!-- руководитель -->
    <CashTableHead
      v-else-if="$store.state.user.section?.includes('c_head')"
      :currencyOptions="currencyOptions"
      :issuanOptions="issuanOptions"
      :contractorTypes="contractorTypes"
      @showJournal="showJournal"
      @cancel="cancel"
      @ready="ready"
    />
    <!-- глав бух. -->
    <CashTableAccountant
      v-else-if="$store.state.user.roleId === 20"
      :currencyOptions="currencyOptions"
      :issuanOptions="issuanOptions"
      :contractorTypes="contractorTypes"
      @showJournal="showJournal"
      @cancel="cancel"
      @ready="ready"
    />
    <!-- директор -->
    <CashTableDirector
      v-else-if="
        $store.state.user.roleId === 7 &&
        $store.state.user.section?.includes('c_dir')
      "
      :currencyOptions="currencyOptions"
      :issuanOptions="issuanOptions"
      :contractorTypes="contractorTypes"
      @showJournal="showJournal"
      @cancel="cancel"
      @ready="ready"
    />
    <!-- кассир -->
    <CashTableCashier
      v-else-if="
        $store.state.user.roleId === 3 || $store.state.user.roleId === 21
      "
      :currencyOptions="currencyOptions"
      :issuanOptions="issuanOptions"
      :contractorTypes="contractorTypes"
      @showJournal="showJournal"
      @cancel="cancel"
      @ready="ready"
    />
  </div>

  <a-modal
    v-model:visible="journalModal.visible"
    title="Журнал согласований"
    @ok="journalModal.visible = false"
  >
    <a-timeline>
      <a-timeline-item class="journal-done" color="green">
        <template #dot
          ><CheckCircleOutlined style="font-size: 16px"
        /></template>
        {{ getUserNameById(journalModal.order.creatorId) }} создал(а) заявку
        <br />
        Описание:
        <span style="color: black">
          {{ journalModal.order.desc }}
        </span>
        <br />
        <a-typography-text type="secondary" style="font-size: 13px">{{
          getLocaleDateAsString(journalModal.order.createdAt)
        }}</a-typography-text>
      </a-timeline-item>

      <a-timeline-item
        v-if="journalModal.order.cash_order_status.id == 1"
        class="journal-cancel"
        color="red"
      >
        <template #dot
          ><CloseCircleOutlined style="font-size: 16px"
        /></template>
        {{ getUserNameById(journalModal.order.creatorId) }} удалил(а) заявку
        <br />
        Причина удаление:
        <span style="color: red; font-weight: bold">
          {{ journalModal.order.cancel_reason }}
        </span>
      </a-timeline-item>

      <a-timeline-item
        v-if="
          journalModal.order.cash_order_status.id > 3 &&
          journalModal.order.creatorId !== journalModal.order.headId
        "
        class="journal-done"
        color="green"
      >
        <template #dot
          ><CheckCircleOutlined style="font-size: 16px"
        /></template>
        Руководитель {{ getUserNameById(journalModal.order.headId) }} одобрил(а)
        заявку
        <br />
        <template v-if="journalModal.order.head_comment">
          Комментарии:
          <span style="color: black; font-weight: bold">
            {{ journalModal.order.head_comment }}
          </span>
          <br />
        </template>
        <a-typography-text type="secondary" style="font-size: 13px"
          >{{ getLocaleDateAsString(journalModal.order.head_time) }}
        </a-typography-text>
      </a-timeline-item>
      <a-timeline-item
        v-else-if="journalModal.order.cash_order_status.id == 3"
        class="journal-cancel"
        color="red"
      >
        <template #dot
          ><CloseCircleOutlined style="font-size: 16px"
        /></template>
        Руководитель {{ getUserNameById(journalModal.order.headId) }} отменил(а)
        заявку
        <br />
        Причина отмены:
        <span style="color: red; font-weight: bold">
          {{ journalModal.order.cancel_reason }}
        </span>
        <br />
        <a-typography-text type="secondary" style="font-size: 13px"
          >{{ getLocaleDateAsString(journalModal.order.head_time) }}
        </a-typography-text>
      </a-timeline-item>
      <a-timeline-item
        v-else-if="journalModal.order.cash_order_status.id == 2"
        class="journal-wait"
        color="orange"
      >
        <template #dot
          ><ClockCircleOutlined style="font-size: 16px"
        /></template>
        Ожидание руководителя</a-timeline-item
      >

      <a-timeline-item
        v-if="journalModal.order.cash_order_status.id > 5"
        class="journal-done"
        color="green"
      >
        <template #dot
          ><CheckCircleOutlined style="font-size: 16px"
        /></template>
        Директор
        {{ getUserNameById(journalModal.order.directorId) }} одобрил(а) заявку
        <br />
        <template v-if="journalModal.order.director_comment">
          Комментарии:
          <span style="color: black; font-weight: bold">
            {{ journalModal.order.director_comment }}
          </span>
          <br />
        </template>
        <a-typography-text type="secondary" style="font-size: 13px"
          >{{ getLocaleDateAsString(journalModal.order.director_time) }}
        </a-typography-text>
      </a-timeline-item>
      <a-timeline-item
        v-else-if="journalModal.order.cash_order_status.id == 5"
        class="journal-cancel"
        color="red"
      >
        <template #dot
          ><CloseCircleOutlined style="font-size: 16px"
        /></template>
        Директор
        {{ getUserNameById(journalModal.order.directorId) }} отменил(а) заявку
        <br />
        Причина отмены:
        <span style="color: red; font-weight: bold">
          {{ journalModal.order.cancel_reason }}
        </span>
        <br />
        <a-typography-text type="secondary" style="font-size: 13px"
          >{{ getLocaleDateAsString(journalModal.order.director_time) }}
        </a-typography-text>
      </a-timeline-item>
      <a-timeline-item
        v-else-if="journalModal.order.cash_order_status.id == 4"
        class="journal-wait"
        color="orange"
      >
        <template #dot
          ><ClockCircleOutlined style="font-size: 16px"
        /></template>
        Ожидание директора</a-timeline-item
      >

      <a-timeline-item
        v-if="journalModal.order.cash_order_status.id > 7"
        class="journal-done"
        color="green"
      >
        <template #dot
          ><CheckCircleOutlined style="font-size: 16px"
        /></template>
        Бухгалтер
        {{ getUserNameById(journalModal.order.accountantId) }} одобрил(а) заявку
        <br />
        <template v-if="journalModal.order.accountant_comment">
          Комментарии:
          <span style="color: black; font-weight: bold">
            {{ journalModal.order.accountant_comment }}
          </span>
          <br />
        </template>
        <a-typography-text type="secondary" style="font-size: 13px"
          >{{ getLocaleDateAsString(journalModal.order.accountant_time) }}
        </a-typography-text>
      </a-timeline-item>
      <a-timeline-item
        v-else-if="journalModal.order.cash_order_status.id == 7"
        class="journal-cancel"
        color="red"
      >
        <template #dot
          ><CloseCircleOutlined style="font-size: 16px"
        /></template>
        Бухгалтер
        {{ getUserNameById(journalModal.order.accountantId) }} отменил(а) заявку
        <br />
        Причина отмены:
        <span style="color: red; font-weight: bold">
          {{ journalModal.order.cancel_reason }}
        </span>
        <br />
        <a-typography-text type="secondary" style="font-size: 13px"
          >{{ getLocaleDateAsString(journalModal.order.accountant_time) }}
        </a-typography-text>
      </a-timeline-item>
      <a-timeline-item
        v-else-if="journalModal.order.cash_order_status.id == 6"
        class="journal-wait"
        color="orange"
      >
        <template #dot
          ><ClockCircleOutlined style="font-size: 16px"
        /></template>
        Ожидание бухгалтера</a-timeline-item
      >

      <a-timeline-item
        v-if="journalModal.order.cash_order_status.id > 8"
        class="journal-done"
        color="green"
      >
        <template #dot
          ><CheckCircleOutlined style="font-size: 16px"
        /></template>
        Кассир
        {{ getUserNameById(journalModal.order.directorId) }} одобрил(а) заявку
        <br />
        <template v-if="journalModal.order.cashier_comment">
          Комментарии:
          <span style="color: black; font-weight: bold">
            {{ journalModal.order.cashier_comment }}
          </span>
          <br />
        </template>
        <a-typography-text type="secondary" style="font-size: 13px"
          >{{ getLocaleDateAsString(journalModal.order.cashier_time) }}
        </a-typography-text>
      </a-timeline-item>
      <a-timeline-item
        v-else-if="journalModal.order.cash_order_status.id == 8"
        class="journal-wait"
        color="orange"
      >
        <template #dot
          ><ClockCircleOutlined style="font-size: 16px"
        /></template>
        Ожидание кассира
      </a-timeline-item>
      <a-timeline-item
        v-if="journalModal.order.cash_order_status.id == 9"
        class="journal-done"
        color="green"
      >
        <template #dot
          ><CheckCircleOutlined style="font-size: 16px"
        /></template>
        Готово
        <br />
        <a-typography-text type="secondary" style="font-size: 13px"
          >{{ getLocaleDateAsString(journalModal.order.cashier_time) }}
        </a-typography-text>
      </a-timeline-item>
    </a-timeline>
  </a-modal>
</template>

<script>
import AddCash from "../components/cash/AddCash.vue";
import CashTableCreator from "../components/cash/CashTableCreator.vue";
import CashTableHead from "../components/cash/CashTableHead.vue";
import CashTableDirector from "../components/cash/CashTableDirector.vue";
import CashTableCashier from "../components/cash/CashTableCashier.vue";
import CashTableAccountant from "../components/cash/CashTableAccountant.vue";
import CompanyLogo from "@/components/CompanyLogo.vue";
import getLocaleDate from "../utils/getLocaleDateFromISO";
import config from "../../config.js";
import store from "@/store/index";
import axios from "axios";
import { reactive } from "vue";
import getUserNameById from "@/utils/getUserNameById";
import getLocaleDateAsString from "@/utils/getLocaleDateAsString";
import fetchUsers from "@/utils/fetchUsers";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import depName from "@/utils/getDepartmentNameById";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import i18n from "@/i18n/i18n";
import DBDateToCalendarDate from "@/utils/DBDateToCalendarDate";
const { t } = i18n.global;

export default {
  components: {
    AddCash,
    CashTableCreator,
    CashTableHead,
    CashTableDirector,
    CashTableCashier,
    CompanyLogo,
    CashTableAccountant,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
  },
  data() {
    // курсы валют
    const currencyOptions = [
      {
        label: "тг.",
        value: "KZT",
        position: "after",
      },
      {
        label: "руб.",
        value: "RUB",
        position: "after",
      },
      {
        label: "$",
        value: "USD",
        position: "before",
      },
      {
        label: "€",
        value: "EUR",
        position: "before",
      },
    ];

    // тип выдача
    const issuanOptions = [
      {
        label: "Наличными с документами",
        value: "with_doc",
      },
      {
        label: "Наличными без документов",
        value: "no_doc",
      },
      {
        label: "Перевод через банк",
        value: "bank",
      },
    ];

    // типы контрагентов
    const contractorTypes = [
      {
        label: "Клиент",
        value: "client",
      },
      {
        label: "Поставщик",
        value: "provider",
      },
      {
        label: "Конкурент",
        value: "competitor",
      },
      {
        label: "Партнер",
        value: "partner",
      },
      {
        label: "Другое",
        value: "other",
      },
    ];

    const journalModal = reactive({
      visible: false,
      order: undefined,
    });

    const showJournal = (order) => {
      journalModal.order = order;
      journalModal.visible = true;
    };

    return {
      currencyOptions,
      issuanOptions,
      contractorTypes,
      journalModal,
      getUserNameById,
      getLocaleDateAsString,
      showJournal,
    };
  },

  methods: {
    getLocaleDate(iso) {
      return getLocaleDate(iso);
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

    async fetchCashItems() {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/cash/get_cash_item")
        .then((res) => {
          const cash_items = [];
          res.data.cash_items.rows.forEach((item) => {
            cash_items.push({ value: item.id, label: item.name });
          });
          store.commit("setCashItems", cash_items);
        })
        .catch((e) => console.log(e));
    },

    async fetchCashStatuses() {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/cash/get_statuses")
        .then((res) => {
          store.commit("setCashStatuses", res.data.statuses);
        })
        .catch((e) => console.log(e));
    },

    async fetchDepartmentLimits(department = store.state.user.departmentId) {
      console.log(department);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(
          config.API_URL +
            `api/company/department_limit?departmentId=${department}&year=${new Date().getFullYear()}`
        )
        .then((res) => {
          store.commit("setDepartmentLimits", res.data.department_limits.rows);
        })
        .catch((e) => console.log(e));
    },

    async cancel({ id,  cancel_reason, callback }) {
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios({
        method: "put",
        url: config.API_URL + "api/cash/cancel",
        data: {
          id,
          cancel_reason,
        },
      })
        .then(async () => {
          store.commit("setIsLoading", false);
          message.success(t("modal.successfullyAdded"));
          callback();
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

    async ready({ id, status_id=undefined, comment, callback }) {
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      let url = "on_director";
      if (store.state.user.section?.includes("c_head") && status_id === 2) url = "on_director";
      else if (store.state.user.roleId === 7) url = "on_accountant";
      else if (store.state.user.roleId === 20) url = "on_cashier";
      else if (store.state.user.roleId === 3) url = "ready";
      else if (store.state.user.roleId === 21) url = "ready";
      await axios({
        method: "put",
        url: config.API_URL + "api/cash/" + url,
        data: {
          id,
          comment,
        },
      })
        .then(async () => {
          store.commit("setIsLoading", false);
          message.success(t("modal.successfullyAdded"));
          callback();
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

    async createExcel() {
      const filters = store.state.orderFilters;
      const req_params = {};
      let arr = [];
      for (const key in filters) {
        if (filters[key]) {
          req_params[key] = filters[key];
        }
      }
      this.$store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/cash/", {
          params: {
            ...req_params,
            limit: 100000,
          },
        })
        .then((res) => {
          arr = res.data.cash_orders.rows;
          this.$store.commit("setIsLoading", false);
        })
        .catch(async (err) => {
          this.$store.commit("setIsLoading", false);
          if (
            err.response.data.errors &&
            err.response.data.errors.length !== 0
          ) {
            let errors = "";
            err.response.data.errors.map((error) => [
              (errors += error.msg + " "),
            ]);
            this.error(errors);
          } else {
            this.error(err.response.data.message);
          }
        });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("sheet", {
        pageSetup: { paperSize: 9, orientation: "landscape" },
      });
      worksheet.columns = [
        {
          header: `Создатель ${
            filters.creatorId ? "(" + filters.creatorId[0] + ")" : ""
          }`,
          key: "creatorId",
          width: 20,
        },
        {
          header: `Контрагент ${
            filters.contractor ? "(" + filters.contractor[0] + ")" : ""
          }`,
          key: "contractor",
          width: 20,
        },
        {
          header: `ДДС ${
            filters.cash_item ? "(" + filters.cash_item + ")" : ""
          }`,
          key: "cash_item",
          width: 20,
        },
        {
          header: `Компания ${
            filters.company
              ? "(" +
                store.state.companies.filter(
                  (com) => com.value == filters.company
                )[0]?.text +
                ")"
              : ""
          }`,
          key: "company",
          width: 20,
        },
        {
          header: `Отдел ${
            filters.departmentId
              ? "(" + depName(filters.departmentId, "long") + ")"
              : ""
          }`,
          key: "departmentId",
          width: 20,
        },
        { header: "Сумма", key: "sum", width: 20 },
        {
          header: `Номер ${
            filters.num_cash ? "(" + filters.num_cash[0] + ")" : ""
          }`,
          key: "num_cash",
          width: 20,
        },
        { header: "Дата", key: "createdAt", width: 20 },
        { header: "Описание", key: "desc", width: 20 },
      ];
      arr.forEach((order) => {
        // console.log(order.managerId);
        const description =
          `Создатель(${DBDateToCalendarDate(order.createdAt)}): ${
            order.desc
          }; \n` +
          (order.head_time
            ? `Руководитель(${DBDateToCalendarDate(order.head_time)}): ${
                order.head_comment ? order.head_comment : ""
              }; \n`
            : "") +
          (order.accountant_time
            ? `Бухгалтер(${DBDateToCalendarDate(order.accountant_time)}): ${
                order.accountant_comment ? order.accountant_comment : ""
              }; \n`
            : "") +
          (order.director_time
            ? `Директор(${DBDateToCalendarDate(order.director_time)}): ${
                order.director_comment ? order.director_comment : ""
              }; \n`
            : "") +
          (order.cashier_time
            ? `Кассир(${DBDateToCalendarDate(order.cashier_time)}): ${
                order.cashier_comment ? order.cashier_comment : ""
              }; \n`
            : "");

        worksheet.addRow({
          creatorId: getUserNameById(order.creatorId),
          contractor: order.contractor.name,
          cash_item: order.cash_item.name,
          company: order.company.name,
          departmentId: depName(order.departmentId, "long"),
          sum: order.sum,
          num_cash: order.num_cash,
          createdAt: DBDateToCalendarDate(order.createdAt),
          desc: description,
        });
      });

      const newRow = worksheet.addRow({
        manager: "Итого: ",
        summa: arr.reduce((acc, cur) => {
          return acc + cur.summa;
        }, 0),
      });
      newRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4daaff" },
      };

      const firstRow = worksheet.getRow(1);
      firstRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4daaff" },
      };

      const buffer = await workbook.xlsx.writeBuffer();
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const fileExtension = ".xlsx";

      const blob = new Blob([buffer], { type: fileType });

      saveAs(blob, "Отчет" + fileExtension);
    },
  },
  async beforeMount() {
    await fetchUsers();
    await this.fetchCompanies();
    await this.fetchDepartments();
    await this.fetchCashItems();
    await this.fetchCashStatuses();
    await this.fetchDepartmentLimits();
  },
};
</script>

<style>
.orderPageBlock {
  padding-bottom: 50px;
}

.order-col.buttons {
  display: flex;
  justify-content: center;
  max-width: 100px;
}

.order-col.buttons div {
  margin-right: 3px;
  cursor: pointer;
}

.journal-done {
  color: green;
}
.journal-wait {
  color: orange;
  font-size: 16px;
}
.journal-cancel {
  color: lightcoral;
}

.excelButtonBlock {
  margin-top: 20px;
}
</style>
