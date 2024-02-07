<template>
  <div class="orderPageBlock container">
    <!-- <h2 style="color: red; text-align: center;">Уважаемый пользователь сайта, данный раздел сайта работает в тестовом режиме</h2> -->
    <CompanyLogo />
    <div
      style="display: flex"
      v-if="[1, 13, 14, 15, 16].includes($store.state.user.roleId)"
    >
      <a-button
        type="dashed"
        shape="round"
        style="
          margin-right: 10px;
          background-color: white;
          border-color: green;
          color: green;
        "
        @click="$router.push('/logistics')"
        >{{ $t("button.edit") }}</a-button
      >
      <a-button
        type="primary"
        shape="round"
        @click="$router.push('/logistics/monitor')"
        >{{ $t("button.track") }}</a-button
      >
    </div>
    <template
      v-if="
        $route.path === '/logistics/monitor' &&
        [7, 9, 17].includes($store.state.user.roleId)
      "
    >
      <LogisticDirectorsTableMonitor />
    </template>
    <template v-else-if="$route.path === '/logistics/monitor'">
      <LogisticTableMonitor />
    </template>
    <template v-else>
      <AddTransport v-if="$store.state.user.roleId == 13" />
      <LogisticTableLogist v-if="$store.state.user.roleId == 13" />
      <LogisticTableForwarder v-if="$store.state.user.roleId == 14" />
      <LogisticTableCoord v-if="$store.state.user.roleId == 15" />
      <LogisticTableDeclorant v-if="$store.state.user.roleId == 16" />
      <LogisticTableAdmin v-if="$store.state.user.roleId == 1" />
    </template>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../config.js";
import AddTransport from "@/components/logistics/AddTransport.vue";
import LogisticTableForwarder from "@/components/logistics/LogisticTableForwarder.vue";
import CompanyLogo from "@/components/CompanyLogo.vue";
// import i18n from '@/i18n/i18n'
import LogisticTableCoord from "@/components/logistics/LogisticTableCoord.vue";
import LogisticTableDeclorant from "@/components/logistics/LogisticTableDeclorant.vue";
import LogisticTableLogist from "@/components/logistics/LogisticTableLogist.vue";
import LogisticTableMonitor from "@/components/logistics/LogisticTableMonitor.vue";
import LogisticDirectorsTableMonitor from "@/components/logistics/LogisticDirectorsTableMonitor.vue";
import LogisticTableAdmin from "@/components/logistics/LogisticTableAdmin.vue";
// const {t} = i18n.global

export default {
  components: {
    AddTransport,
    LogisticTableForwarder,
    CompanyLogo,
    LogisticTableCoord,
    LogisticTableDeclorant,
    LogisticTableLogist,
    LogisticTableMonitor,
    LogisticDirectorsTableMonitor,
    LogisticTableAdmin,
  },
  methods: {
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
  },
  async beforeMount() {
    this.fetchPurchaseCategories();
    this.fetchPurchaseArticles();
    this.fetchPurchaseUnits();
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
