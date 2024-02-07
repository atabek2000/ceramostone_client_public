<template>
  <a-row>
    <a-col :md="10" :xs="24">
      <a-form
        ref="formRef"
        name="advanced_search"
        class="ant-advanced-search-form"
        :model="formState"
      >
        <a-row justify="space-between">
          <a-col :md="24" :xs="24">
            <div>
              <span class="hello-text">Производство Курты</span>
            </div>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item
              :name="orderNum"
              :rules="[{ required: true, message: $t('formError.invalidAct') }]"
            >
              <button
                v-if="!formState.orderNum"
                class="recieve-num-button"
                @click="getOrderNum"
              >
                {{ $t("button.purchaseNum") }}
              </button>
              <a-input
                v-else
                disabled="true"
                v-model:value="formState.orderNum"
                :placeholder="$t('placeholder.numAct')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item
              :name="orderDate"
              :rules="[
                { required: true, message: $t('formError.invalidDate') },
              ]"
            >
              <a-date-picker
                v-model:value="formState.orderDate"
                value-format="YYYY-MM-DD"
                :placeholder="$t('placeholder.orderCreateDate')"
              />
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item
              :name="orderNum1c"
              :rules="[{ required: true, message: $t('formError.invalid1C') }]"
            >
              <a-input
                v-model:value="formState.orderNum1c"
                :placeholder="$t('placeholder.num1C')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item
              :name="orderTerm"
              :rules="[
                { required: true, message: $t('formError.invalidTerm') },
              ]"
            >
              <a-date-picker
                v-model:value="formState.orderTerm"
                value-format="YYYY-MM-DD"
                :placeholder="$t('placeholder.term')"
              />
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item
              :name="orderSumm"
              :rules="[
                { required: true, message: $t('formError.invalidSumm') },
              ]"
            >
              <a-input
                v-model:value="formState.orderSumm"
                :placeholder="$t('placeholder.summa')"
                @change="onChangeSum"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item
              :name="reciever"
              :rules="[
                { required: true, message: $t('formError.invalidReciever') },
              ]"
            >
              <a-input
                v-model:value="formState.reciever"
                :placeholder="$t('placeholder.reciever')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :xs="24">
            <div>
              <span><i aria-hidden="true" class="fa fa-lock"></i></span>
              <input @change="getSpec" type="file" id="fileSpec" />
              <label class="file-upload" for="fileSpec" id="fileSpecLabel"
                >{{ $t("table.spec") }} (.pdf)</label
              >
            </div>
          </a-col>
          <a-col :md="7" :xs="24">
            <div class="file-upload">
              <span><i aria-hidden="true" class="fa fa-lock"></i></span>
              <input @change="getContract" type="file" id="fileContract" />
              <label
                class="file-upload"
                for="fileContract"
                id="fileContractLabel"
                >{{ $t("table.contract") }} (.pdf)</label
              >
            </div>
          </a-col>
          <a-col :md="7" :xs="24">
            <div class="file-upload">
              <span><i aria-hidden="true" class="fa fa-lock"></i></span>
              <input @change="getPay" type="file" id="filePay" />
              <label class="file-upload" for="filePay" id="filePayLabel"
                >{{ $t("table.payment") }} (.pdf)</label
              >
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-col :md="4" :xs="24"></a-col>
    <a-col :md="10" :xs="24">
      <h2 class="result-block-text">{{ $t("content.yourOrder") }}</h2>
      <div class="form-result">
        <h4>{{ $t("placeholder.numAct") }}: {{ formState.orderNum }}</h4>
        <h4>{{ $t("placeholder.num1C") }}: {{ formState.orderNum1c }}</h4>
        <h4>
          {{ $t("placeholder.orderCreateDate") }}: {{ formState.orderDate }}
        </h4>
        <h4>{{ $t("placeholder.term") }}: {{ formState.orderTerm }}</h4>
        <h4>{{ $t("placeholder.summa") }}: {{ formState.orderSumm }} ₸</h4>
        <h4>{{ $t("placeholder.reciever") }}: {{ formState.reciever }}</h4>
      </div>
      <div class="form-button">
        <button @click="createOrder">{{ $t("button.makeApplication") }}</button>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import axios from "axios";
import config from "../../../config.js";
import { reactive, ref } from "vue";
import { message } from "ant-design-vue";
import store from "@/store/index";
import depName from "@/utils/getDepartmentNameById";
import validateSumm from "@/utils/validateSumm";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default {
  setup() {
    const fileContract = ref();
    const fileSpec = ref();
    const filePay = ref();

    const formState = reactive({
      orderNum: undefined,
      orderNum1c: "",
      orderSumm: "",
      orderDate: "",
      orderTerm: "",
      reciever: "",
    });
    const refreshOrderNum = (orderNum) => {
      formState.orderNum =
        new Date().toISOString().split("T")[0] +
        depName(store.state.user.departmentId) +
        orderNum;
    };
    const getContract = (e) => {
      const fileInputContract = document.getElementById("fileContractLabel");
      if (e.target.files[0].type !== "application/pdf") {
        message.error(t("modal.errorFile"));
        fileContract.value = ref();
        fileInputContract.style.color = "#db1818";
        fileInputContract.style.borderColor = "#db1818";
      } else {
        fileContract.value = e.target.files[0];
        fileInputContract.style.color = "#72BF44";
        fileInputContract.style.borderColor = "#72BF44";
      }
    };
    const getSpec = (e) => {
      const fileInputSpec = document.getElementById("fileSpecLabel");
      if (e.target.files[0].type !== "application/pdf") {
        message.error(t("modal.errorFile"));
        fileSpec.value = ref();
        fileInputSpec.style.color = "#db1818";
        fileInputSpec.style.borderColor = "#db1818";
      } else {
        fileSpec.value = e.target.files[0];
        fileInputSpec.style.color = "#72BF44";
        fileInputSpec.style.borderColor = "#72BF44";
      }
    };

    const getPay = (e) => {
      const fileInputPay = document.getElementById("filePayLabel");
      if (e.target.files[0].type !== "application/pdf") {
        message.error(t("modal.errorFile"));
        filePay.value = ref();
        fileInputPay.style.color = "#db1818";
        fileInputPay.style.borderColor = "#db1818";
      } else {
        filePay.value = e.target.files[0];
        fileInputPay.style.color = "#72BF44";
        fileInputPay.style.borderColor = "#72BF44";
      }
    };

    const onChangeSum = (e) => {
      formState.orderSumm = validateSumm(e.target.value);
    };
    const createOrder = async () => {
      if (
        !formState.orderNum ||
        !formState.orderNum1c ||
        !formState.orderSumm ||
        !formState.orderTerm ||
        !formState.orderDate ||
        !formState.reciever
      ) {
        message.error(t("modal.fillFields"));
      } else if (!filePay.value || !fileSpec.value || !fileContract.value) {
        message.error(t("modal.uploadFiles"));
      } else {
        store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        const bodyFormData = new FormData();
        bodyFormData.append("num_1c", formState.orderNum1c);
        bodyFormData.append("num_act", formState.orderNum);
        bodyFormData.append("summa", formState.orderSumm.replaceAll(/\s/g, ""));
        bodyFormData.append("date", formState.orderDate);
        bodyFormData.append("term", formState.orderTerm);
        bodyFormData.append("reciever", formState.reciever);
        bodyFormData.append("paid_type", Number(formState.paid_type));
        bodyFormData.append("industry_spec", fileSpec.value);
        bodyFormData.append("industry_contract", fileContract.value);
        bodyFormData.append("industry_pay", filePay.value);

        axios({
          method: "post",
          url: config.API_URL + "api/industry/create",
          data: bodyFormData,
        })
          .then(async () => {
            store.commit("setIsLoading", false);
            message.success(t("modal.orderSuccessAdded"));
            store.commit("setSetTotalOrders", store.state.totalOrders + 1);
            await getOrderNum();
            formState.orderNum1c = "";
            formState.orderSumm = "";
            formState.orderDate = "";
            formState.orderTerm = "";
            formState.paid_type = "0";
            formState.reciever = "";
            const fileInputContract =
              document.getElementById("fileContractLabel");
            fileContract.value = ref();
            fileInputContract.style.color = "#181734";
            fileInputContract.style.borderColor = "#181734";
            const fileInputSpec = document.getElementById("fileSpecLabel");
            fileSpec.value = ref();
            fileInputSpec.style.color = "#181734";
            fileInputSpec.style.borderColor = "#181734";
            const fileInputPay = document.getElementById("filePayLabel");
            filePay.value = ref();
            fileInputPay.style.color = "#181734";
            fileInputPay.style.borderColor = "#181734";
          })
          .catch(async (err) => {
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
      }
    };
    const getOrderNum = async () => {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/industry/get_num")
        .then((res) => {
          store.commit("setOrderNum", res.data.num);
          return res.data.num;
        })
        .catch((e) => console.log(e));
    };
    return {
      formState,
      fileContract,
      fileSpec,
      filePay,
      getContract,
      getSpec,
      getPay,
      createOrder,
      onChangeSum,
      refreshOrderNum,
      getOrderNum,
    };
  },
  computed: {
    getOrderNumNew() {
      return store.state.orderNum;
    },
  },
  watch: {
    getOrderNumNew() {
      this.refreshOrderNum(store.state.orderNum);
    },
  },
};
</script>

<style scoped>
.ant-advanced-search-form .ant-picker,
.ant-advanced-search-form input {
  border-radius: 8px;
  width: 100%;
}

.form-result {
  background-image: url(../../assets/logo1.png);
  background-color: #544837;
  background-size: 99px 84px;
  background-repeat: no-repeat;
  background-position: 90%;
  border-radius: 20px;
  padding: 20px 30px;
  color: #ffffff;
}
.hello-text {
  color: #544837;
}
.form-result h4 {
  color: #ffffff;
}

.result-block-text {
  color: #544837;
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

.form-button button:active {
  background-color: #4ba517;
}

[type="file"] {
  height: 0;
  overflow: hidden;
  width: 0;
}
[type="file"] + label {
  background: #ffffff;
  border: none;
  border-radius: 5px;
  color: #181734;
  cursor: pointer;
  display: inline-block;
  font-family: "Rubik", sans-serif;
  font-size: inherit;
  font-weight: 500;
  margin-bottom: 1rem;
  outline: none;
  position: relative;
  transition: all 0.3s;
  vertical-align: middle;
  box-sizing: border-box;
  border: 3px dashed #181734;
  border-radius: 10px;
}
[type="file"] + label:hover {
  background-color: #ffffff;
}

label.file-upload {
  width: 100%;
  text-align: center;
  height: 50px;
  padding-top: 10px;
}

.recieve-num-button {
  width: 100%;
  border-radius: 10px;
  border: solid 1px rgb(217, 217, 217);
  height: 30px;
  cursor: pointer;
}

.recieve-num-button:hover {
  background-color: lightgray;
}
</style>
