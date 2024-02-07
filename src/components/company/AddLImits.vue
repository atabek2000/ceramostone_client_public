<template>
  <a-row>
    <a-col :md="20" :xs="24">
      <p class="titlePage">Добавить лимит</p>
      <a-form
        name="cash_search"
        class="ant-advanced-search-form"
        :model="formState"
      >
        <a-row justify="space-between" class="CashTable" :gutter="[8, 8]">
          <a-col :md="7" :xs="24" col-md-6>
            <a-form-item :name="name">
              <a-select
                class="br-10"
                v-model:value="formState.departmentId"
                placeholder="*Отдел"
                style="width: 100%"
                :options="$store.state.departments"
              >
              </a-select>
              <!-- <span
                style="
                  cursor: pointer;
                  display: inline-block;
                  float: right;
                  line-height: 32px;
                "
                @click="departmentModal.visible = true"
              >
                <PlusOutlined />
              </span> -->
            </a-form-item>
          </a-col>
          <a-col :md="7" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="formState.year"
                placeholder="Год"
              ></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="7" :xs="24"></a-col>

          <a-col :xl="4" :md="5" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="formState.limit_1"
                placeholder="Январь"
                @change="
                  (e) => {
                    formState.limit_1 = validateSumm(e.target.value);
                  }
                "
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="4" :md="5" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="formState.limit_2"
                placeholder="Февраль"
                @change="
                  (e) => {
                    formState.limit_2 = validateSumm(e.target.value);
                  }
                "
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="4" :md="5" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="formState.limit_3"
                placeholder="Март"
                @change="
                  (e) => {
                    formState.limit_3 = validateSumm(e.target.value);
                  }
                "
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="4" :md="5" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="formState.limit_4"
                placeholder="Апрель"
                @change="
                  (e) => {
                    formState.limit_4 = validateSumm(e.target.value);
                  }
                "
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="4" :md="5" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="formState.limit_5"
                placeholder="Май"
                @change="
                  (e) => {
                    formState.limit_5 = validateSumm(e.target.value);
                  }
                "
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="4" :md="5" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="formState.limit_6"
                placeholder="Июнь"
                @change="
                  (e) => {
                    formState.limit_6 = validateSumm(e.target.value);
                  }
                "
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="4" :md="5" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="formState.limit_7"
                placeholder="Июль"
                @change="
                  (e) => {
                    formState.limit_7 = validateSumm(e.target.value);
                  }
                "
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="4" :md="5" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="formState.limit_8"
                placeholder="Август"
                @change="
                  (e) => {
                    formState.limit_8 = validateSumm(e.target.value);
                  }
                "
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="4" :md="5" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="formState.limit_9"
                placeholder="Сентябрь"
                @change="
                  (e) => {
                    formState.limit_9 = validateSumm(e.target.value);
                  }
                "
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="4" :md="5" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="formState.limit_10"
                placeholder="Октябрь"
                @change="
                  (e) => {
                    formState.limit_10 = validateSumm(e.target.value);
                  }
                "
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="4" :md="5" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="formState.limit_11"
                placeholder="Ноябрь"
                @change="
                  (e) => {
                    formState.limit_11 = validateSumm(e.target.value);
                  }
                "
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="4" :md="5" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="formState.limit_12"
                placeholder="Декабрь"
                @change="
                  (e) => {
                    formState.limit_12 = validateSumm(e.target.value);
                  }
                "
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :xs="24">
            <div class="form-button">
              <button @click="createLimit">Сохранить</button>
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

  <a-modal
    v-model:visible="departmentModal.visible"
    title="Добавить отдел"
    @ok="handleAddDepartment"
  >
    <a-input
      class="br-10"
      v-model:value="departmentModal.name"
      :placeholder="$t('*Название')"
    ></a-input>
  </a-modal>
</template>

<script>
import { reactive } from "vue";
import store from "@/store";
import getDepartmentNameById from "@/utils/getDepartmentNameById";
// import { PlusOutlined } from "@ant-design/icons-vue";
import validateSumm from "@/utils/validateSumm";
import getUserNameById from "@/utils/getUserNameById";
import axios from "axios";
import { message } from "ant-design-vue";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;
import config from "../../../config.js";

export default {
  props: {
    currencyOptions: Object,
    issuanOptions: Object,
    contractorTypes: Object,
  },
  components: {
    // PlusOutlined,
  },
  setup(props, { emit }) {
    // данные дс
    const formState = reactive({
      departmentId: undefined,
      year: undefined,
      limit_1: undefined,
      limit_2: undefined,
      limit_3: undefined,
      limit_4: undefined,
      limit_5: undefined,
      limit_6: undefined,
      limit_7: undefined,
      limit_8: undefined,
      limit_9: undefined,
      limit_10: undefined,
      limit_11: undefined,
      limit_12: undefined,
    });

    const departmentModal = reactive({
      visible: false,
      name: undefined,
    });

    const createLimit = async () => {
      if (formState.year && formState.departmentId) {
        store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios({
          method: "post",
          url: config.API_URL + "api/company/create_department_limit",
          data: {
            limits_array: {
              limit_1: formState.limit_1
                ? formState.limit_1.replaceAll(" ", "")
                : formState.limit_1,
              limit_2: formState.limit_2
                ? formState.limit_2.replaceAll(" ", "")
                : formState.limit_2,
              limit_3: formState.limit_3
                ? formState.limit_3.replaceAll(" ", "")
                : formState.limit_3,
              limit_4: formState.limit_4
                ? formState.limit_4.replaceAll(" ", "")
                : formState.limit_4,
              limit_5: formState.limit_5
                ? formState.limit_5.replaceAll(" ", "")
                : formState.limit_5,
              limit_6: formState.limit_6
                ? formState.limit_6.replaceAll(" ", "")
                : formState.limit_6,
              limit_7: formState.limit_7
                ? formState.limit_7.replaceAll(" ", "")
                : formState.limit_7,
              limit_8: formState.limit_8
                ? formState.limit_8.replaceAll(" ", "")
                : formState.limit_8,
              limit_9: formState.limit_9
                ? formState.limit_9.replaceAll(" ", "")
                : formState.limit_9,
              limit_10: formState.limit_10
                ? formState.limit_10.replaceAll(" ", "")
                : formState.limit_10,
              limit_11: formState.limit_11
                ? formState.limit_11.replaceAll(" ", "")
                : formState.limit_11,
              limit_12: formState.limit_12
                ? formState.limit_12.replaceAll(" ", "")
                : formState.limit_12,
            },
            year: formState.year.replaceAll(" ", ""),
            departmentId: formState.departmentId,
          },
        })
          .then(async () => {
            store.commit("setIsLoading", false);
            message.success(t("modal.successfullyAdded"));
            for (const elem in formState) {
              formState[elem] = undefined;
            }
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

    const handleAddDepartment = async () => {
      if (departmentModal.name) {
        store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios({
          method: "post",
          url: config.API_URL + "api/company/create_department",
          data: {
            name: departmentModal.name,
          },
        })
          .then(async () => {
            store.commit("setIsLoading", false);
            message.success(t("modal.successfullyAdded"));
            departmentModal.visible = false;
            departmentModal.name = undefined;
            emit("fetchDepartments");
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
      formState,
      getUserNameById,
      getDepartmentNameById,
      validateSumm,
      createLimit,
      departmentModal,
      handleAddDepartment,
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
