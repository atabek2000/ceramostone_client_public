<template>
  <a-row>
    <a-col :md="10" :xs="24">
      <a-form
        ref="formRef"
        name="advanced_search"
        class="ant-advanced-search-form"
        :model="formState"
        @finish="onFinish"
      >
        <a-row justify="space-between">
          <a-col :md="24" :xs="24">
            <div>
              <span class="hello-text"
                >{{ $t("title.hello") }}, {{ $store.state.user.name }}</span
              >
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
          <a-col :md="24" :xs="24">
            <a-form-item
              :label="$t('formLabel.payType')"
              :name="paid_type"
              :rules="[
                { required: true, message: $t('formError.invalidPayType') },
              ]"
            >
              <a-space :size="10">
                <p></p>
                <a-radio-group
                  v-model:value="formState.paid_type"
                  name="radioGroup"
                >
                  <a-radio value="0">{{ $t("button.notSelected") }}</a-radio>
                  <a-radio value="1">{{ $t("button.byAgreement") }}</a-radio>
                  <a-radio value="2">{{ $t("button.byAdvance") }}</a-radio>
                </a-radio-group>
              </a-space>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <div>
              <span><i aria-hidden="true" class="fa fa-lock"></i></span>
              <input @change="getWord" type="file" id="fileWord" />
              <label class="file-upload" for="fileWord" id="fileWordLabel"
                >{{ $t("button.spec") }} (.pdf)</label
              >
            </div>
          </a-col>
          <a-col :md="11" :xs="24">
            <div class="file-upload">
              <span><i aria-hidden="true" class="fa fa-lock"></i></span>
              <input @change="getExcel" type="file" id="fileExcel" />
              <label class="file-upload" for="fileExcel" id="fileExcelLabel"
                >{{ $t("button.estim") }} (.pdf)</label
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
    const fileWord = ref();
    const fileExcel = ref();

    const formState = reactive({
      orderNum: undefined,
      orderNum1c: "",
      orderSumm: "",
      orderDate: "",
      orderTerm: "",
      reciever: "",
      paid_type: "0",
    });
    const onFinish = (values) => {
      console.log("Success:", values);
    };
    const refreshOrderNum = (orderNum) => {
      formState.orderNum =
        new Date().toISOString().split("T")[0] +
        depName(store.state.user.departmentId) +
        orderNum;
    };
    const getExcel = (e) => {
      const fileInputWord = document.getElementById("fileExcelLabel");
      if (e.target.files[0].type !== "application/pdf") {
        message.error(t("modal.errorFile"));
        fileWord.value = ref();
        fileInputWord.style.color = "#db1818";
        fileInputWord.style.borderColor = "#db1818";
      } else {
        fileExcel.value = e.target.files[0];
        fileInputWord.style.color = "#72BF44";
        fileInputWord.style.borderColor = "#72BF44";
      }
    };
    const getWord = (e) => {
      const fileInputWord = document.getElementById("fileWordLabel");
      if (e.target.files[0].type !== "application/pdf") {
        message.error(t("modal.errorFile"));
        fileWord.value = ref();
        fileInputWord.style.color = "#db1818";
        fileInputWord.style.borderColor = "#db1818";
      } else {
        fileWord.value = e.target.files[0];
        fileInputWord.style.color = "#72BF44";
        fileInputWord.style.borderColor = "#72BF44";
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
      } else if (!fileWord.value || !fileExcel.value) {
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
        bodyFormData.append("word", fileWord.value);
        bodyFormData.append("excel", fileExcel.value);

        axios({
          method: "post",
          url: config.API_URL + "api/order/create",
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
            const fileInputWord = document.getElementById("fileWordLabel");
            fileWord.value = ref();
            fileInputWord.style.color = "#181734";
            fileInputWord.style.borderColor = "#181734";
            const fileInputExcel = document.getElementById("fileExcelLabel");
            fileExcel.value = ref();
            fileInputExcel.style.color = "#181734";
            fileInputExcel.style.borderColor = "#181734";
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
        .get(config.API_URL + "api/order/get_num")
        .then((res) => {
          store.commit("setOrderNum", res.data.num);
          return res.data.num;
        })
        .catch((e) => console.log(e));
    };
    return {
      formState,
      onFinish,
      fileWord,
      fileExcel,
      getExcel,
      getWord,
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
  background-color: #181734;
  border-radius: 20px;
  padding: 20px 30px;
  color: #ffffff;
}

.form-result h4 {
  color: #ffffff;
}

.result-block-text {
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
