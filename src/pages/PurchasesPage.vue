<template>
  <div class="orderPageBlock container">
    <!-- <h2 style="color: red; text-align: center;">Уважаемый пользователь сайта, данный раздел сайта работает в тестовом режиме</h2> -->
    <CompanyLogo />
    <template v-if="$route.path === '/purchases/monitor'">
      <PurchaseTableMonitor />
    </template>
    <template v-else>
      <AddPurchase
        v-if="$store.state.user.roleId == 6 || $store.state.user.roleId == 2"
        @fetchPurchaseArticles="fetchPurchaseArticles"
      />
      <PurchaseTableAdmin v-if="$store.state.user.roleId == 1" />
      <PurchaseTableHead
        v-if="$store.state.user.roleId == 6 || $store.state.user.roleId == 2"
        @onCancel="onCancel"
      />
      <PurchaseTableDirector
        v-if="$store.state.user.roleId == 7"
        @onCancel="onCancel"
        @onReady="onReady"
      />
      <PurchaseTableAnalyst
        v-if="$store.state.user.roleId == 8"
        @onCancel="onCancel"
        @onReady="onReady"
      />
      <PurchaseTableDirector1
        v-if="$store.state.user.roleId == 9"
        @onCancel="onCancel"
        @onReady="onReady"
      />
      <PurchaseTableSpecialist
        v-if="$store.state.user.roleId == 10"
        @onReady="onReady"
      />
      <PurchaseTableStockman
        v-if="$store.state.user.roleId == 11"
        @onReady="onReady"
        @onProductSort="onProductSort"
      />
      <PurchaseTableAccountant
        v-if="$store.state.user.roleId == 12"
        @onReady="onReady"
      />
    </template>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../config.js";
import PurchaseTableAdmin from "@/components/purchases/PurchaseTableAdmin.vue";
import PurchaseTableHead from "@/components/purchases/PurchaseTableHead.vue";
import PurchaseTableDirector from "@/components/purchases/PurchaseTableDirector.vue";
import PurchaseTableAnalyst from "@/components/purchases/PurchaseTableAnalyst.vue";
import PurchaseTableDirector1 from "@/components/purchases/PurchaseTableDirector1.vue";
import PurchaseTableSpecialist from "@/components/purchases/PurchaseTableSpecialist.vue";
import PurchaseTableStockman from "@/components/purchases/PurchaseTableStockman.vue";
import PurchaseTableAccountant from "@/components/purchases/PurchaseTableAccountant.vue";
import AddPurchase from "@/components/purchases/AddPurchase.vue";
import CompanyLogo from "@/components/CompanyLogo.vue";
import fetchUsers from "@/utils/fetchUsers";
import { h } from "vue";
import { message, Modal } from "ant-design-vue";
import store from "@/store/index";
import i18n from "@/i18n/i18n";
import jwt_decode from "jwt-decode";
import PurchaseTableMonitor from "@/components/purchases/PurchaseTableMonitor.vue";
const { t } = i18n.global;

export default {
  components: {
    PurchaseTableAdmin,
    PurchaseTableHead,
    PurchaseTableDirector,
    PurchaseTableAnalyst,
    PurchaseTableDirector1,
    PurchaseTableSpecialist,
    PurchaseTableStockman,
    PurchaseTableAccountant,
    AddPurchase,
    CompanyLogo,
    PurchaseTableMonitor,
  },
  methods: {
    async fetchPurchaseCount() {
      const userData = jwt_decode(localStorage.getItem("jwt"));
      if (
        (userData.roleId === 11 || userData.roleId === 12) &&
        this.$route.path === "/purchases"
      ) {
        this.$store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios
          .get(config.API_URL + "api/logistic/transports/count")
          .then((res) => {
            if (res.data.count) {
              this.$store.commit("setTotalTransports", res.data.count);
            }
            this.$store.commit("setIsLoading", false);
          })
          .catch(() => {
            this.$store.commit("setIsLoading", false);
          });
      } else {
        this.$store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios
          .get(
            config.API_URL +
              (this.$route.path == "/purchases"
                ? "api/purchase/count"
                : "api/purchase/monitor_count")
          )
          .then((res) => {
            if (res.data.count) {
              this.$store.commit("setSetTotalPurchases", res.data.count);
            }
            this.$store.commit("setIsLoading", false);
          })
          .catch(() => {
            this.$store.commit("setIsLoading", false);
          });
      }
    },
    async fetchPurchaseCategories() {
      this.$store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/purchase/product/categories")
        .then((res) => {
          if (res.data.categories) {
            this.$store.commit("setPurchaseCategories", res.data.categories);
          }
          this.$store.commit("setIsLoading", false);
        })
        .catch(() => {
          this.$store.commit("setIsLoading", false);
        });
    },
    async fetchPurchaseArticles(categoryId = undefined) {
      this.$store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/purchase/product/articles", {
          params: { categoryId },
        })
        .then((res) => {
          if (res.data.articles) {
            this.$store.commit("setPurchaseArticles", res.data.articles);
          }
          this.$store.commit("setIsLoading", false);
        })
        .catch(() => {
          this.$store.commit("setIsLoading", false);
        });
    },
    async fetchPurchaseUnits() {
      this.$store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/purchase/units")
        .then((res) => {
          if (res.data.units) {
            this.$store.commit("setPurchaseUnits", res.data.units);
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
    async onReady(payload) {
      let axiosBody = {};
      let axiosApi = "";
      if (store.state.user.roleId === 7) {
        axiosBody = { id: payload.orderId };
        if (store.state.user.cityId === 2) {
          axiosApi = "on_director1";
        } else {
          axiosApi = "on_analyst";
        }
      } else if (store.state.user.roleId === 8) {
        axiosBody = { id: payload.orderId };
        axiosApi = "on_director1";
        // axiosApi = "on_specialist"; // когда то удалили директора по закупам
      } else if (store.state.user.roleId === 9) {
        axiosBody = {
          id: payload.orderId,
          specialistId: payload.specialistId,
          comment_spec: payload.comment_spec,
        };
        axiosApi = "on_specialist";
      } else if (store.state.user.roleId === 10) {
        axiosApi = "on_logist";
        axiosBody = payload.body;
      } else if (store.state.user.roleId === 11) {
        axiosBody = { id: payload.orderId };
        axiosApi = "forwarder";
      } else if (store.state.user.roleId === 12) {
        axiosBody = { id: payload.orderId };
        axiosApi = "ready";
      }
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/purchase/" + axiosApi, axiosBody)
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
        .put(config.API_URL + "api/purchase/cancel", {
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
    async onProductSort({
      purchaseId,
      defect,
      UnitId,
      remain,
      actual,
      refresh,
    }) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/purchase/product/sort", {
          id: purchaseId,
          defect: parseFloat(defect.replaceAll(/\s/g, "")),
          defectUnitId: UnitId,
          remain: parseFloat(remain.replaceAll(/\s/g, "")),
          actual: parseFloat(actual.replaceAll(/\s/g, "")),
          remainUnitId: UnitId,
          actualUnitId: UnitId,
        })
        .then(async () => {
          this.$store.commit("setIsLoading", false);
          message.success(t("modal.successfullyChanged"));
          refresh();
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
    async getAnalysts() {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/purchase/get_analysts")
        .then((res) => {
          store.commit("setAnalysts", res.data.analysts);
          return res.data.num;
        })
        .catch((e) => console.log(e));
    },
  },
  async beforeMount() {
    // this.fetchPurchaseCount()
    this.fetchPurchaseCategories();
    this.fetchPurchaseArticles();
    this.fetchPurchaseUnits();
    await fetchUsers();
    await this.getAnalysts();
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
