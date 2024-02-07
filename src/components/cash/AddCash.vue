<template>
  <a-row>
    <a-col :md="10" :xs="24">
      <a-form
        name="cash_search"
        class="ant-advanced-search-form"
        :model="formState"
      >
        <a-row justify="space-between">
          <a-col :md="11" :xs="24">
            <a-form-item :name="num_cash">
              <button
                v-if="!formState.num_cash"
                class="recieve-num-button"
                @click="getCashNum"
              >
                {{ "*" + $t("button.purchaseNum") }}
              </button>
              <a-input
                v-else
                class="br-10"
                disabled="true"
                v-model:value="formState.num_cash"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="name">
              <a-popover content="Контрагент (поставщик)" class="w-10">
                <InfoCircleOutlined style="color: orange" />
              </a-popover>
              <a-select
                class="br-10"
                v-model:value="formState.contractorId"
                show-search
                placeholder="*Контрагент"
                style="width: 80%"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="contractorState.data"
                @search="handleSearchContractor"
              >
              </a-select>

              <span
                style="
                  cursor: pointer;
                  display: inline-block;
                  float: right;
                  line-height: 32px;
                "
                @click="contractorModal.visible = true"
              >
                <PlusOutlined />
              </span>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="name">
              <a-popover content="Компания" class="w-10">
                <InfoCircleOutlined style="color: orange" />
              </a-popover>
              <a-select
                class="br-10"
                v-model:value="formState.companyId"
                style="width: 90%; display: inline-block"
                :options="$store.state.companies"
                placeholder="*Выбор компании"
                :field-names="{ label: 'text', value: 'value' }"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="name">
              <a-popover content="Отдел с который снимается ДС" class="w-10">
                <InfoCircleOutlined style="color: orange" />
              </a-popover>
              <a-select
                class="br-10"
                v-model:value="formState.departmentId"
                style="width: 90%; display: inline-block"
                :options="$store.state.departments"
                placeholder="*Бюджет отдела"
                @change="departmentChange"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="name">
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <a-popover content="Сумма заявки и валюта" class="w-10">
                  <InfoCircleOutlined style="color: orange" />
                </a-popover>
                <a-input
                  class="br-left-10"
                  style="width: 60%"
                  v-model:value="formState.sum"
                  :placeholder="$t('*Сумма')"
                  @change="onChangeSum"
                ></a-input>

                <a-select
                  class="br-right-10"
                  v-model:value="formState.currency"
                  style="width: 30%"
                  :show-arrow="false"
                  :options="currencyOptions"
                  placeholder="*Валюта"
                >
                </a-select>
              </div>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="name">
              <a-popover
                content="Статья движение денежных средств"
                class="w-10"
              >
                <InfoCircleOutlined style="color: orange" />
              </a-popover>
              <a-select
                class="br-10"
                v-model:value="formState.cashItemId"
                show-search
                placeholder="*Статья ДДС"
                style="width: 80%"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :options="itemState.data"
                @search="handleSearchItem"
              >
              </a-select>
              <span
                style="
                  cursor: pointer;
                  display: inline-block;
                  float: right;
                  line-height: 32px;
                "
                @click="itemModal.visible = true"
              >
                <PlusOutlined />
              </span>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="name">
              <a-popover content="Выберите тип выдачи" class="w-10">
                <InfoCircleOutlined style="color: orange" />
              </a-popover>
              <a-select
                class="br-10"
                v-model:value="formState.issuan"
                style="width: 90%"
                :options="issuanOptions"
                placeholder="*Выдача"
              >
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="11" :xs="24">
            <a-form-item :name="name">
              <a-popover
                content="Выберите ответственного за бюджет отдела"
                class="w-10"
              >
                <InfoCircleOutlined style="color: orange" />
              </a-popover>
              <a-select
                class="br-10"
                v-model:value="formState.headId"
                style="width: 90%"
                :options="
                  $store.state.users.filter((user) =>
                    user.sections?.includes('c_head')
                  )
                "
                :field-names="{ label: 'name', value: 'id' }"
                placeholder="*Руководитель"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="name">
              <a-popover content="Опишите основание заявки" class="w-10">
                <InfoCircleOutlined style="color: orange" />
              </a-popover>
              <a-textarea
                class="br-10"
                v-model:value="formState.desc"
                style="width: 90%"
                placeholder="*Основание (за что)"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="name">
              <a-button
                v-if="$store.state.department_limits.length > 0"
                class="br-10 w-100 secondary-green-button"
                @click="limitModel.visible = true"
              >
                Лимит за 03-2023:
                {{
                  $store.state.department_limits[0][
                    `limit_${new Date().getMonth()}`
                  ]
                }}
                тг
              </a-button>
              <a-button
                v-else
                class="br-10 w-100"
                danger
                @click="limitModel.visible = true"
              >
                Лимит не указан
              </a-button>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <div>
              <span><i aria-hidden="true" class="fa fa-lock"></i></span>
              <input
                @change="getFiles"
                type="file"
                multiple
                id="files"
                accept="application/pdf, image/png,image/jpg, image/jpeg, image/gif"
              />
              <label class="file-upload" for="files" id="filesLabel">{{
                $t("Вложение")
              }}</label>
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
    <a-col :md="4" :xs="24"></a-col>
    <a-col :md="10" :xs="24">
      <h2 class="result-block-text">ДС (отчёт о движении денежных средств)</h2>
      <div class="form-result">
        <h4>{{ $t("table.applicationNumber") }}: {{ formState.num_cash }}</h4>
        <h4>
          {{ $t("Контрагента") }}:
          {{
            contractorState.data.filter(
              (elem) => elem.value === formState.contractorId
            )[0]?.label
          }}
        </h4>
        <h4>
          {{ $t("Компания") }}:
          {{
            $store.state.companies.filter(
              (comp) => comp.id === formState.companyId
            )[0]?.name
          }}
        </h4>
        <h4>
          {{ $t("Отдел") }}:
          {{ getDepartmentNameById(formState.departmentId, "long") }}
        </h4>
        <h4>
          {{ $t("Сумма") }}:
          <span v-if="formState.sum">
            {{
              currencyOptions.filter(
                (cur) => cur.value === formState.currency
              )[0]?.position !== "before"
                ? formState.sum
                : ""
            }}
            {{
              currencyOptions.filter(
                (cur) => cur.value === formState.currency
              )[0]?.label
            }}{{
              currencyOptions.filter(
                (cur) => cur.value === formState.currency
              )[0]?.position === "before"
                ? formState.sum
                : ""
            }}
          </span>
        </h4>
        <h4>
          {{ $t("Статья ДДС") }}:
          {{
            itemState.data.filter(
              (elem) => elem.value === formState.cashItemId
            )[0]?.label
          }}
        </h4>
        <h4>
          {{ $t("Выдача") }}:
          {{
            issuanOptions.filter(
              (issuan) => issuan.value === formState.issuan
            )[0]?.label
          }}
        </h4>
        <h4>{{ $t("Описание") }}: {{ formState.desc }}</h4>
        <h4>
          {{ $t("Руководитель") }}:
          {{ formState.headId ? getUserNameById(formState.headId) : "" }}
        </h4>
        <div class="product-block">
          <div style="display: flex; flex-wrap: wrap">
            <div
              style="width: 100%"
              v-for="(product, index) in formState.products"
              :key="index"
            >
              <a-collapse>
                <a-collapse-panel>
                  <template #header>
                    <span style="color: white">
                      <span style="font-weight: bold">{{
                        getCategoryById(product.productCategoryId)
                      }}</span>
                      :
                      {{ getArticleById(product.productArticleId) }}
                    </span>
                  </template>
                  <div style="color: white">
                    <p>
                      <span style="font-weight: bold"
                        >{{ $t("placeholder.productDimensions") }}:</span
                      >
                      {{ product.size }}
                    </p>
                    <p>
                      <span style="font-weight: bold"
                        >{{ $t("table.sizesBag") }}:</span
                      >
                      {{ product.volumePurchase }}
                      {{
                        $store.state.purchaseUnits.filter(
                          (unit) => unit.id === product.purchaseUnitId
                        )[0]?.short
                      }}
                    </p>
                    <p>
                      <span style="font-weight: bold"
                        >{{ $t("table.sizesEx") }}:</span
                      >
                      {{ product.volumeStock }}
                      {{
                        $store.state.purchaseUnits.filter(
                          (unit) => unit.id === product.stockUnitId
                        )[0]?.short
                      }}
                    </p>
                    <p v-if="product.stockNote !== ''">
                      <span style="font-weight: bold"
                        >{{ $t("placeholder.note") }}:
                      </span>
                      {{ product.stockNote }}
                    </p>
                    <p>
                      <span style="font-weight: bold"
                        >{{ $t("placeholder.transit") }}:</span
                      >
                      {{ product.volumeWay }}
                      {{
                        $store.state.purchaseUnits.filter(
                          (unit) => unit.id === product.wayUnitId
                        )[0]?.short
                      }}
                    </p>
                    <p v-if="product.wayNote !== ''">
                      <span style="font-weight: bold"
                        >{{ $t("placeholder.note") }}:
                      </span>
                      {{ product.wayNote }}
                    </p>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
        </div>
      </div>
      <div class="form-button">
        <button @click="createCashItem">
          {{ $t("button.makeApplication") }}
        </button>
      </div>
    </a-col>
  </a-row>

  <a-modal
    v-model:visible="contractorModal.visible"
    title="Добавить контрагента"
    @ok="handleAddContractor"
  >
    <a-row :gutter="[8, 8]">
      <a-col :md="11" :xs="24">
        <a-input
          class="br-10"
          v-model:value="contractorModal.name"
          :placeholder="$t('*Название')"
        ></a-input>
      </a-col>
      <!-- <a-col :md="11" :xs="24">
        <a-input
          class="br-10"
          v-model:value="contractorModal.phone"
          :placeholder="$t('Номер телефона')"
        ></a-input>
      </a-col>
      <a-col :md="11" :xs="24">
        <a-input
          class="br-10"
          v-model:value="contractorModal.email"
          :placeholder="$t('Почта')"
        ></a-input>
      </a-col>
      <a-col :md="11" :xs="24">
        <a-input
          class="br-10"
          v-model:value="contractorModal.site"
          :placeholder="$t('Сайт')"
        ></a-input>
      </a-col>
      <a-col :md="11" :xs="24">
        <a-input
          class="br-10"
          v-model:value="contractorModal.address"
          :placeholder="$t('Адрес')"
        ></a-input>
      </a-col> -->
      <a-col :md="11" :xs="24">
        <a-select
          class="br-10"
          style="width: 100%"
          v-model:value="contractorModal.type"
          :options="contractorTypes"
          placeholder="*Тип"
        >
        </a-select>
      </a-col>
    </a-row>
    <a-typography-text type="danger">* - обязательные поля</a-typography-text>
  </a-modal>

  <a-modal
    v-model:visible="itemModal.visible"
    title="Добавить статья ДДС"
    @ok="handleAddItem"
  >
    <a-row :gutter="[8, 8]">
      <a-col :md="11" :xs="24">
        <a-input
          class="br-10"
          v-model:value="itemModal.name"
          :placeholder="$t('*Название')"
        ></a-input>
      </a-col>
      <a-col :md="11" :xs="24">
        <a-input
          class="br-10"
          v-model:value="itemModal.article"
          :placeholder="$t('Артикуль')"
        ></a-input>
      </a-col>
    </a-row>
    <a-typography-text type="danger">* - обязательные поля</a-typography-text>
  </a-modal>

  <a-modal
    v-model:visible="limitModel.visible"
    title="Лимит отдела"
    @ok="handleAddItem"
  >
    <div v-if="$store.state.department_limits.length > 0">
      <div v-for="limit in $store.state.department_limits" :key="limit.id">
        <a-typography-title :level="2">
          {{ limit.year }} год</a-typography-title
        >
        <a-row :gutter="[8, 8]">
          <a-col :md="11" :xs="24" v-for="mth in 12" :key="mth">
            <a-typography-title :level="5"
              >{{ mth }} месяц:
              {{ limit[`limit_${mth}`] }} тг</a-typography-title
            >
          </a-col>
        </a-row>
      </div>
    </div>
    <div v-else>
      <a-typography-title :level="5" type="danger"
        >Не удалось найти лимиты, свяжитесь с
        администратором!</a-typography-title
      >
    </div>
  </a-modal>
</template>

<script>
import { reactive, ref } from "vue";
import axios from "axios";
import store from "@/store";
import config from "../../../config.js";
import getDepartmentNameById from "@/utils/getDepartmentNameById";
import { PlusOutlined, InfoCircleOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

import validateSumm from "@/utils/validateSumm";
import getUserNameById from "@/utils/getUserNameById";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default {
  props: {
    currencyOptions: Object,
    issuanOptions: Object,
    contractorTypes: Object,
  },
  components: {
    PlusOutlined,
    InfoCircleOutlined,
  },
  setup(props, { emit }) {
    // данные дс
    const formState = reactive({
      num_cash: undefined,
      desc: undefined,
      sum: undefined,
      currency: undefined,
      issuan: undefined,
      headId: undefined,
      departmentId: undefined,
      contractorId: undefined,
      companyId: undefined,
      cashItemId: undefined,
    });

    // получить новый номер заявки
    const getCashNum = async () => {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/cash/get_num")
        .then((res) => {
          store.commit("setCashNum", res.data.num);
          return res.data.num;
        })
        .catch((e) => console.log(e));
    };

    // обновить номер заявки
    const refreshCashNum = (orderNum) => {
      formState.num_cash =
        new Date().toISOString().split("T")[0] +
        getDepartmentNameById(store.state.user.departmentId) +
        orderNum;
    };

    // данные контрагента
    const contractorState = reactive({
      data: [],
      value: [],
      fetching: false,
    });

    // данные статья ддс
    const itemState = reactive({
      data: [],
      value: [],
      fetching: false,
    });

    const limitModel = reactive({
      visible: false,
    });

    // данные котрагента
    const contractorModal = reactive({
      visible: false,
      name: undefined,
      phone: undefined,
      email: undefined,
      site: undefined,
      address: undefined,
      type: undefined,
    });

    // данные статья
    const itemModal = reactive({
      visible: false,
      name: undefined,
      article: undefined,
    });

    let timeout;
    let currentValue = "";

    // получить котрагенты
    function fetchContractors(value) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      currentValue = value;
      async function fetch() {
        await axios
          .get(config.API_URL + "api/company/contractors?name=" + value)
          .then((res) => {
            if (currentValue === value) {
              const data = res.data.contractors.rows.map((elem) => ({
                label: elem.name,
                value: elem.id,
              }));
              contractorState.data = data;
              contractorState.fetching = false;
            }
          })
          .catch((e) => console.log(e));
      }
      timeout = setTimeout(fetch, 300);
    }

    // получить статья ддс
    function fetchCashItems(value) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      currentValue = value;
      async function fetch() {
        await axios
          .get(config.API_URL + "api/cash/get_cash_item?name=" + value)
          .then((res) => {
            if (currentValue === value) {
              const data = res.data.cash_items.rows.map((elem) => ({
                label: elem.name,
                value: elem.id,
              }));
              itemState.data = data;
              itemState.fetching = false;
            }
          })
          .catch((e) => console.log(e));
      }
      timeout = setTimeout(fetch, 300);
    }

    // обработчик поиска для контрагента
    const handleSearchContractor = (val) => {
      fetchContractors(val);
    };

    // обработчик поиска для статья ддс
    const handleSearchItem = (val) => {
      fetchCashItems(val);
    };

    // добавить контрагента
    const handleAddContractor = async () => {
      if (contractorModal.name && contractorModal.type) {
        store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios({
          method: "post",
          url: config.API_URL + "api/company/create_contractor",
          data: {
            name: contractorModal.name,
            phone: contractorModal.phone,
            email: contractorModal.email,
            site: contractorModal.site,
            address: contractorModal.address,
            type: contractorModal.type,
          },
        })
          .then(async () => {
            store.commit("setIsLoading", false);
            message.success(t("modal.successfullyAdded"));
            contractorModal.visible = false;
            contractorModal.name = undefined;
            contractorModal.phone = undefined;
            contractorModal.email = undefined;
            contractorModal.site = undefined;
            contractorModal.address = undefined;
            contractorModal.type = undefined;
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

    // добавить статья
    const handleAddItem = async () => {
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

    const files = ref([]);

    // валидация файлов
    const getFiles = (e) => {
      files.value = [];
      const filesInput = document.getElementById("filesLabel");
      const allowed_files = [
        "application/pdf",
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/gif",
        // "application/msword",
        // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // "application/vnd.ms-excel",
        // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // "application/vnd.ms-powerpoint",
        // "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
      for (const file of e.target.files) {
        if (!allowed_files.includes(file.type.toLowerCase())) {
          message.error(t("modal.errorFile"));
          files.value = [];
          filesInput.style.color = "#db1818";
          filesInput.style.borderColor = "#db1818";
          break;
        } else {
          files.value = [...files.value, file];
          filesInput.style.color = "#72BF44";
          filesInput.style.borderColor = "#72BF44";
        }
      }
    };

    // обработчик изменение сумма
    const onChangeSum = (e) => {
      formState.sum = validateSumm(e.target.value);
    };

    const createCashItem = async () => {
      let error = false;
      for (const val of Object.entries(formState)) {
        if (!val[1]) error = true;
      }

      if (error) {
        message.error("Заполните обязательные поля!");
        return false;
      }

      formState.sum = Number(formState.sum.replace(" ", ""));
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;

      const bodyFormData = new FormData();
      bodyFormData.append("num_cash", formState.num_cash);
      bodyFormData.append("desc", formState.desc);
      bodyFormData.append("sum", formState.sum);
      bodyFormData.append("currency", formState.currency);
      bodyFormData.append("issuan", formState.issuan);
      bodyFormData.append("headId", formState.headId);
      bodyFormData.append("departmentId", formState.departmentId);
      bodyFormData.append("contractorId", formState.contractorId);
      bodyFormData.append("companyId", formState.companyId);
      bodyFormData.append("cashItemId", formState.cashItemId);

      for (const file of files.value) {
        bodyFormData.append("cash_files", file);
      }

      await axios({
        method: "post",
        url: config.API_URL + "api/cash/create",
        data: bodyFormData,
      })
        .then(async () => {
          store.commit("setIsLoading", false);
          message.success(t("modal.successfullyAdded"));
          itemModal.visible = false;
          for (const val of Object.entries(formState)) {
            formState[val[0]] = undefined;
          }
          files.value = [];
          const filesInput = document.getElementById("filesLabel");
          filesInput.style.color = "black";
          filesInput.style.borderColor = "black";
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
    };

    const departmentChange = (value) => {
      emit("fetchDepartmentLimits", value);
    };

    return {
      formState,
      getCashNum,
      refreshCashNum,
      contractorState,
      handleSearchContractor,
      contractorModal,
      handleAddContractor,
      getFiles,
      onChangeSum,
      handleSearchItem,
      itemState,
      itemModal,
      handleAddItem,
      createCashItem,
      getUserNameById,
      getDepartmentNameById,
      limitModel,
      departmentChange,
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
