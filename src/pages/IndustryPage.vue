<template>
  <div class="orderPageBlock container">
    <CompanyLogo />
    <AddOrder v-if="$store.state.user.roleId == 2" />
    <OrderTableAdmin v-if="$store.state.user.roleId == 1" />
    <IndustryTableManager
      @onCancel="onCancel"
      @onReady="onReady"
      @showUpdates="showUpdates"
    />
    <!-- <OrderTableCashier
      v-if="$store.state.user.roleId == 3"
      @onCancel="onCancel"
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
    /> -->
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
import AddOrder from "../components/industry/AddOrder.vue";
import axios from "axios";
import config from "../../config.js";
// import OrderTableCoord from "@/components/orders/OrderTableCoord.vue";
// import OrderTableAdmin from "@/components/orders/OrderTableAdmin.vue";
import IndustryTableManager from "@/components/industry/IndustryTableManager.vue";
// import OrderTableForeman from "@/components/orders/OrderTableForeman.vue";
// import OrderTableCashier from "@/components/orders/OrderTableCashier.vue";
// import OrderTableMonitor from "@/components/orders/OrderTableMonitor.vue";
import CompanyLogo from "@/components/CompanyLogo.vue";
import { h } from "vue";
import { Modal } from "ant-design-vue";
import store from "@/store/index";
import i18n from "@/i18n/i18n";
import getLocaleDate from "../utils/getLocaleDateFromISO";
const { t } = i18n.global;

export default {
  components: {
    AddOrder,
    // OrderTableCoord,
    // OrderTableAdmin,
    IndustryTableManager,
    // OrderTableForeman,
    // OrderTableCashier,
    CompanyLogo,
    // OrderTableMonitor,
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
      axiosBody = { id: payload.orderId, date: payload.date };

      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/industry/ready", axiosBody)
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
        .put(config.API_URL + "api/industry/cancel", {
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

    async fetchOrderStatuses() {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/industry/statuses")
        .then(async (res) => {
          this.$store.commit("setIsLoading", false);
          this.$store.commit(
            "setOrderStatuses",
            res.data.statuses.map((st) => {
              return {
                text: window.localStorage.getItem("lang")
                  ? st["title_" + window.localStorage.getItem("lang")]
                  : st["title_ru"],
                value: st.id,
              };
            })
          );
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
  },
  async beforeMount() {
    this.fetchOrderStatuses();
    this.fetchManagers();
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
