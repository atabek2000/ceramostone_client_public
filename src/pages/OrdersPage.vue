<template>
  <div class="orderPageBlock container">
    <CompanyLogo />
    <AddOrder
      v-if="$store.state.user.roleId == 2 || $store.state.user.roleId == 6"
    />
    <div class="excelButtonBlock">
      <a class="excelButton" @click="createExcel">Скачать отчет</a>
    </div>
    <OrderTableAdmin
      v-if="$store.state.user.roleId == 1"
      @createExcel="createExcel"
    />
    <OrderTableManager
      v-else-if="$store.state.user.roleId == 2 || $store.state.user.roleId == 6"
      @onCancel="onCancel"
      @onStop="onStop"
      @onRun="onRun"
      @showUpdates="showUpdates"
      @createExcel="createExcel"
    />
    <OrderTableCashier
      v-else-if="$store.state.user.roleId == 3"
      @onCancel="onCancel"
      @onReady="onReady"
      @showUpdates="showUpdates"
    />
    <OrderTableCoord
      v-else-if="$store.state.user.roleId == 4"
      @onCancel="onCancel"
      @onReady="onReady"
      @showUpdates="showUpdates"
    />
    <OrderTableForeman
      v-else-if="$store.state.user.roleId == 5"
      @onCancel="onCancel"
      @onReady="onReady"
      @showUpdates="showUpdates"
    />
    <OrderTableMonitor
      v-else-if="
        $store.state.user.roleId == 7 ||
        $store.state.user.roleId == 8 ||
        $store.state.user.roleId == 6
      "
      @showUpdates="showUpdates"
    />
  </div>
  <a-modal
    v-model:visible="updatesModal.visible"
    :title="$t('modal.changingData')"
    :cancelText="' '"
    @ok="
      () => {
        updatesModal.visible = false;
      }
    "
  >
    <a-row justify="space-between">
      <a-col :md="15" :xs="12">
        <p style="font-weight: bold">{{ $t("modal.reason") }}</p>
      </a-col>
      <a-col :md="9" :xs="12">
        <p style="font-weight: bold">{{ $t("modal.time") }}</p>
      </a-col>
    </a-row>
    <div
      v-for="(update_data, index) in updatesModal.updates"
      :key="update_data.id"
    >
      <a-row
        justify="space-between"
        :style="
          'border-radius: 3px; padding: 10px; margin-bottom: 5px; background-color: ' +
          (index % 2 === 0 ? 'GhostWhite' : 'WhiteSmoke')
        "
      >
        <a-col :md="15" :xs="12">
          <p>{{ update_data.reason }}</p>
        </a-col>
        <a-col :md="9" :xs="12">
          <p>
            {{
              getLocaleDate(update_data.createdAt).date[2] +
              "-" +
              getLocaleDate(update_data.createdAt).date[1] +
              "-" +
              getLocaleDate(update_data.createdAt).date[0] +
              " " +
              getLocaleDate(update_data.createdAt).time[0] +
              ":" +
              getLocaleDate(update_data.createdAt).time[1] +
              ":" +
              getLocaleDate(update_data.createdAt).time[2]
            }}
          </p>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import AddOrder from "../components/orders/AddOrder.vue";
import axios from "axios";
import config from "../../config.js";
import OrderTableCoord from "@/components/orders/OrderTableCoord.vue";
import OrderTableAdmin from "@/components/orders/OrderTableAdmin.vue";
import OrderTableManager from "@/components/orders/OrderTableManager.vue";
import OrderTableForeman from "@/components/orders/OrderTableForeman.vue";
import OrderTableCashier from "@/components/orders/OrderTableCashier.vue";
import OrderTableMonitor from "@/components/orders/OrderTableMonitor.vue";
import CompanyLogo from "@/components/CompanyLogo.vue";
import depName from "@/utils/getDepartmentNameById";
import { h } from "vue";
import { Modal, message } from "ant-design-vue";
import store from "@/store/index";
import i18n from "@/i18n/i18n";
import getLocaleDate from "../utils/getLocaleDateFromISO";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const { t } = i18n.global;

export default {
  components: {
    AddOrder,
    OrderTableCoord,
    OrderTableAdmin,
    OrderTableManager,
    OrderTableForeman,
    OrderTableCashier,
    CompanyLogo,
    OrderTableMonitor,
  },
  data() {
    return {
      updatesModal: {
        visible: false,
        updates: [],
      },
    };
  },

  methods: {
    showUpdates(updates) {
      this.updatesModal.updates = updates;
      this.updatesModal.visible = true;
    },

    getLocaleDate(iso) {
      return getLocaleDate(iso);
    },

    async fetchOrdersCount() {
      this.$store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/order/get_count/")
        .then((res) => {
          if (res.data.count) {
            this.$store.commit("setSetTotalOrders", res.data.count);
          }
          this.$store.commit("setIsLoading", false);
        })
        .catch(() => {
          this.$store.commit("setIsLoading", false);
        });
    },
    success(content) {
      Modal.success({
        title: t("modal.success"),
        content: h("p", content),
      });
    },
    error(errorText) {
      Modal.error({
        title: t("modal.error"),
        content: errorText,
      });
    },
    async fetchManagers() {
      try {
        this.$store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios
          .get(config.API_URL + "api/user/managers")
          .then((res) => {
            if (res.data.managers.rows) {
              this.$store.commit("setManagers", res.data.managers.rows);
            }
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
      } catch (e) {
        this.error(e.message);
      }
    },
    async fetchMasters() {
      try {
        this.$store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios
          .get(config.API_URL + "api/user/master")
          .then((res) => {
            if (res.data.masters.rows) {
              const masters = [
                { value: 0, label: t("placeholder.selectMaster") },
              ];
              res.data.masters.rows.forEach((master) => {
                const temp = { value: master.id, label: master.name };
                masters.push(temp);
              });
              this.$store.commit("setMasters", masters);
            }
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
      } catch (e) {
        this.error(message);
      }
    },
    async onReady(payload) {
      let axiosBody = {};
      let axiosApi = "";
      if (store.state.user.roleId === 2) {
        axiosBody = { id: payload.orderId };
        axiosApi = "on_cashier";
      } else if (store.state.user.roleId === 3) {
        axiosBody = { id: payload.orderId };
        axiosApi = "on_coord";
      } else if (store.state.user.roleId === 4) {
        if (!payload.masterId || payload.masterId == 0) {
          message.warning(t("modal.selectMaster"));
          return;
        } else if (!payload.datePicker || payload.datePicker == "") {
          message.warning(t("modal.selectDate"));
          return;
        } else {
          axiosApi = "on_foreman";
          const coord_date =
            payload.datePicker.$y.toString() +
            "-" +
            (payload.datePicker.$M + 1).toString() +
            "-" +
            payload.datePicker.$D.toString();
          axiosBody = {
            id: payload.orderId,
            masterId: payload.masterId,
            coord_date,
          };
        }
      } else if (store.state.user.roleId === 5) {
        axiosBody = { id: payload.orderId };
        axiosApi = "ready";
      }
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/order/" + axiosApi, axiosBody)
        .then(() => {
          store.commit("setIsLoading", false);
          this.success(t("modal.statusSuccessChanged"));
          payload.refreshTable();
        })
        .catch(async (err) => {
          store.commit("setIsLoading", false);
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
    },
    async onCancel(orderId, cancel_reason, refreshTable) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/order/cancel", {
          id: orderId,
          cancel_reason,
        })
        .then(async () => {
          this.$store.commit("setIsLoading", false);
          this.success(
            store.state.user.roleId === 2
              ? t("modal.orderSuccessDeleted")
              : t("modal.orderSuccessCancelled")
          );
          refreshTable();
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
    },
    async onStop({ orderId, stop_reason, refreshTable }) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/order/stop/", {
          id: orderId,
          stop_reason,
        })
        .then(async () => {
          this.$store.commit("setIsLoading", false);
          this.success(t("modal.orderSuccessStopped"));
          refreshTable();
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
    },
    async onRun({ orderId, refreshTable }) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/order/run/", {
          id: orderId,
        })
        .then(async () => {
          this.$store.commit("setIsLoading", false);
          this.success(t("modal.orderSuccessRenewal"));
          refreshTable();
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
        .get(config.API_URL + "api/order/", {
          params: {
            ...req_params,
            limit: 100000,
          },
        })
        .then((res) => {
          arr = res.data.orders.rows;

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
          header: `Менеджер ${
            filters.managerId ? "(" + filters.managerId[0] + ")" : ""
          }`,
          key: "manager",
          width: 20,
        },
        {
          header: `Отдел ${
            filters.depId ? "(" + filters.depId.join(", ") + ")" : ""
          }`,
          key: "department",
          width: 20,
        },
        {
          header: `Акт номер ${
            filters.num_act ? "(" + filters.num_act + ")" : ""
          }`,
          key: "num_act",
          width: 20,
        },
        {
          header: `1с номер ${
            filters.num_1c ? "(" + filters.num_1c + ")" : ""
          }`,
          key: "num_1c",
          width: 20,
        },
        {
          header: `Клиент ${
            filters.reciever ? "(" + filters.reciever + ")" : ""
          }`,
          key: "client",
          width: 20,
        },
        { header: "Сумма", key: "summa", width: 20 },
        { header: "Дата создания", key: "createdAt", width: 20 },
      ];
      arr.forEach((order) => {
        // console.log(order.managerId);
        worksheet.addRow({
          manager: store.getters.getManagerById(order.managerId),
          department: depName(order.num_act.match(/[a-zA-Z]/)[0], "by_short"),
          num_act: order.num_act,
          num_1c: order.num_1c,
          client: order.reciever,
          summa: order.summa,
          createdAt: order.date,
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
    this.fetchOrdersCount();
    this.fetchManagers();
    this.fetchMasters();
  },
  computed() {
    return {
      managers() {
        return store.state.managers.name;
      },
    };
  },
  watch() {
    return {
      managers() {
        location.reload();
      },
    };
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
</style>
