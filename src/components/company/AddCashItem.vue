<template>
  <a-row>
    <a-col :md="20" :xs="24">
      <p class="titlePage">Добавить ДДС</p>
      <a-form
        name="cash_search"
        class="ant-advanced-search-form"
        :model="itemModal"
      >
        <a-row justify="space-between">
          <a-col :md="7" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="itemModal.name"
                placeholder="*Название ДДС"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="itemModal.article"
                placeholder="*Уникальный № ДДС"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :xs="0"></a-col>

          <a-col :md="7" :xs="24">
            <div class="form-button">
              <button @click="createCashItem">Сохранить</button>
            </div>
          </a-col>
          <a-col :xs="24">
            <a-typography-text type="danger"
              >* - обязательные поля</a-typography-text
            >
          </a-col>
        </a-row>
      </a-form>
    </a-col>
  </a-row>
</template>

<script>
import { reactive } from "vue";
import store from "@/store";
import { message } from "ant-design-vue";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;
import axios from "axios";
import config from "../../../config.js";

export default {
  props: {
    currencyOptions: Object,
    issuanOptions: Object,
    contractorTypes: Object,
  },
  setup() {
    // данные статья

    const itemModal = reactive({
      visible: false,
      name: undefined,
      article: undefined,
    });

    const createCashItem = async () => {
      if (itemModal.name) {
        store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios({
          method: "post",
          url: config.API_URL + "api/cash/create_cash_item",
          data: {
            name: itemModal.name,
            article: itemModal.article,
          },
        })
          .then(async () => {
            store.commit("setIsLoading", false);
            message.success(t("modal.successfullyAdded"));
            itemModal.visible = false;
            itemModal.name = undefined;
            itemModal.article = undefined;
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
    };

    return {
      itemModal,
      createCashItem,
    };
  },

  computed: {
    getOrderNumNew() {
      return store.state.cashNum;
    },
  },
  watch: {
    getOrderNumNew() {
      this.refreshCashNum(store.state.cashNum);
    },
  },
};
</script>

<style scoped>
.ant-advanced-search-form .ant-picker,
.ant-advanced-search-form input {
  width: 100%;
}

.form-result {
  background-color: #00360e;
  background-image: url(../../assets/Daco_4764420.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right 110%;
  border-radius: 20px;
  padding: 20px 30px;
  color: #ffffff;
}

.form-result h4 {
  color: #ffffff;
}
.titlePage {
  color: #00360e;
  font-size: 20px;
  font-weight: 550;
  padding-top: 20px;
}
.result-block-text {
  color: #00360e;
  text-align: end;
}
.form-button {
  margin-top: 10px;
}
.form-button button {
  width: 100%;
  background-color: #72bf44;
  height: 35px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
}

.recieve-num-button:hover {
  background-color: lightgray;
}
</style>
