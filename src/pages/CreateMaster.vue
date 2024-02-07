<template>
  <div class="container">
    <CompanyLogo />
    <AddMaster @fetchMasters="fetchMasters" />
    <MasterTable />
  </div>
</template>

<script>
import CompanyLogo from "@/components/CompanyLogo.vue";
import axios from "axios";
import config from "../../config.js";
import AddMaster from "../components/orders/AddMaster.vue";
import MasterTable from "../components/orders/MasterTable.vue";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default {
  components: {
    AddMaster,
    MasterTable,
    CompanyLogo,
  },
  methods: {
    async fetchMasters() {
      try {
        this.$store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${this.$window.localStorage.getItem("jwt")}`;
        await axios
          .get(config.API_URL + "api/user/master")
          .then((res) => {
            if (res.data.masters.rows) {
              const masters = [{ value: 0, label: t("modal.selectMaster") }];
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
              await this.$store.commit("showAlert", { bodyText: errors });
            } else {
              await this.$store.commit("showAlert", {
                bodyText: err.response.data.message,
              });
            }
          });
      } catch (e) {
        await this.$store.commit("showAlert", { bodyText: e.message });
      }
    },
  },
};
</script>

<style></style>
