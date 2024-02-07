<template>
  <a-row>
    <a-col :md="10" :xs="24">
      <a-form
        name="advanced_search"
        class="ant-advanced-search-form"
        :model="formState"
      >
        <a-row justify="space-between">
          <a-col :md="24" :xs="24">
            <div>
              <h2>{{ $t("title.hello") }}, {{ $store.state.user.name }}</h2>
              <!-- <span class="hello-text"
                >{{ $t("title.hello") }}, {{ $store.state.user.name }}</span
              > -->
            </div>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="order_num">
              <button
                v-if="!formState.order_num"
                class="recieve-num-button"
                @click="getPurchaseNum"
              >
                {{ $t("button.purchaseNum") }}
              </button>
              <a-input
                v-else
                disabled="true"
                v-model:value="formState.order_num"
                :placeholder="$t('table.client')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="client_name">
              <a-input
                v-model:value="formState.client_name"
                :placeholder="$t('table.client')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="order_date">
              <a-date-picker
                v-model:value="formState.order_date"
                value-format="YYYY-MM-DD"
                :placeholder="$t('table.applicationDate')"
              />
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="term_date">
              <a-date-picker
                v-model:value="formState.term_date"
                value-format="YYYY-MM-DD"
                :placeholder="$t('table.applicationDeadline')"
              />
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item>
              <a-popover
                :title="
                  $store.state.user.cityId === 1 ? 'Список директоров' : ''
                "
              >
                <template #content>
                  <div v-if="$store.state.user.cityId === 1">
                    <p>
                      <b>Асылбек</b>: керамогранит, гранит, сантехника и т.д.
                    </p>
                    <p><b>Аидам</b>: мрамор, оникс</p>
                  </div>
                </template>
                <a-select
                  :placeholder="$t('button.director')"
                  :options="
                    $store.state.user.id === 58
                      ? [{ id: 0, name: 'Нет' }]
                      : $store.state.directors
                  "
                  :field-names="{ label: 'name', value: 'id' }"
                  v-model:value="formState.directorId"
                ></a-select>
              </a-popover>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="11" :xs="24">
            <a-form-item>
              <a-popover
                :title="
                  $store.state.user.cityId === 1 ? 'Список аналитиков' : ''
                "
              >
                <template #content>
                  <div v-if="$store.state.user.cityId === 1">
                    <p><b>Аділет</b>: сантехника</p>
                    <p><b>Ильяс</b>: керамогранит</p>
                    <p><b>Аидам</b>: натуральный камень</p>
                  </div>
                </template>
                <a-select
                  :placeholder="$t('button.analyst')"
                  :options="
                    $store.state.user.cityId === 2
                      ? [{ id: 0, name: 'Нет' }]
                      : $store.state.analysts
                  "
                  :field-names="{ label: 'name', value: 'id' }"
                  v-model:value="formState.analystId"
                ></a-select>
              </a-popover>
            </a-form-item>
          </a-col> -->
          <a-col :md="11" :xs="24">
            <a-form-item>
              <a-select
                :placeholder="$t('placeholder.departCountry')"
                :options="$store.state.countries"
                v-model:value="formState.countryFrom"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="formState.paid">
              <a-select
                :placeholder="$t('table.payment')"
                :options="piadOptions"
                v-model:value="formState.paid"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item :name="client_name">
              <a-textarea
                v-model:value="formState.comment"
                :placeholder="$t('Примечание ')"
              ></a-textarea>
            </a-form-item>
          </a-col>

          <a-col v-if="formState.products.length > 0" :md="24" :xs="24">
            <a-row
              justify="space-between"
              v-for="(product, index) in formState.products"
              :key="index"
            >
              <a-col :md="24" :xs="24">
                <p>{{ $t("title.product") }}, {{ index + 1 }}</p>
              </a-col>
              <a-col :md="11" :xs="24">
                <a-form-item :name="product.productCategoryId">
                  <a-select
                    :placeholder="$t('table.category')"
                    :options="$store.state.purchaseCategories"
                    :field-names="{ label: 'name', value: 'id' }"
                    v-model:value="product.productCategoryId"
                    @change="onChangeCategory"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="11" :xs="24">
                <a-form-item :name="product.productArticleId">
                  <a-select
                    :dropdownMatchSelectWidth="false"
                    :placeholder="$t('table.title')"
                    show-search
                    :filter-option="filterOption"
                    v-model:value="product.productArticleId"
                  >
                    <a-select-option
                      v-for="item in product.articles"
                      :key="item.id"
                      :value="item.id"
                      :name="item.name"
                    >
                      {{ item.name }}
                    </a-select-option>
                    <template #dropdownRender="{ menuNode }">
                      <v-nodes :vnodes="menuNode" />
                      <a-divider style="margin: 4px 0" />
                      <div
                        style="padding: 4px 8px; cursor: pointer"
                        @mousedown="(e) => e.preventDefault()"
                        @click="addArticle(index)"
                      >
                        <plus-outlined />
                        {{ $t("button.add") }}
                      </div>
                    </template>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="11" :xs="24">
                <a-form-item :name="product.size">
                  <a-input
                    v-model:value="product.size"
                    :placeholder="$t('table.sizes')"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="11" :xs="24"></a-col>
              <a-col :md="11" :xs="24">
                <a-form-item :name="formState.products[index].volumePurchase">
                  <a-input
                    v-model:value="formState.products[index].volumePurchase"
                    :placeholder="$t('table.sizesBag')"
                    @change="
                      () =>
                        (product.volumePurchase = validateSumm(
                          product.volumePurchase
                        ))
                    "
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="11" :xs="24">
                <a-form-item :name="product.purchaseUnitId">
                  <a-select
                    :placeholder="$t('placeholder.unitMeasurement')"
                    :options="$store.state.purchaseUnits"
                    :field-names="getSelectFieldNames()"
                    v-model:value="product.purchaseUnitId"
                  ></a-select>
                </a-form-item>
              </a-col>
              <a-col :md="11" :xs="24">
                <a-form-item :name="product.volumeStock">
                  <a-input
                    v-model:value="product.volumeStock"
                    :placeholder="$t('table.sizesEx')"
                    @change="
                      () =>
                        (product.volumeStock = validateSumm(
                          product.volumeStock
                        ))
                    "
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="11" :xs="24">
                <a-form-item :name="product.stockUnitId">
                  <a-select
                    :placeholder="$t('placeholder.unitMeasurement')"
                    :options="$store.state.purchaseUnits"
                    :field-names="getSelectFieldNames()"
                    v-model:value="product.stockUnitId"
                  ></a-select>
                </a-form-item>
              </a-col>
              <a-col :md="24" :xs="24">
                <a-form-item :name="product.stockNote">
                  <a-textarea
                    v-model:value="product.stockNote"
                    :placeholder="$t('placeholder.stocks')"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="11" :xs="24">
                <a-form-item :name="product.volumeWay">
                  <a-input
                    v-model:value="product.volumeWay"
                    :placeholder="$t('placeholder.transit')"
                    @change="
                      () =>
                        (product.volumeWay = validateSumm(product.volumeWay))
                    "
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="11" :xs="24">
                <a-form-item :name="product.wayUnitId">
                  <a-select
                    :placeholder="$t('placeholder.unitMeasurement')"
                    :options="$store.state.purchaseUnits"
                    :field-names="getSelectFieldNames()"
                    v-model:value="product.wayUnitId"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="24" :xs="24">
                <a-form-item :name="product.wayNote">
                  <a-textarea
                    v-model:value="product.wayNote"
                    :placeholder="$t('placeholder.stocks')"
                  />
                </a-form-item>
              </a-col>
              <a-col style="width: 100%; display: flex; justify-content: end">
                <a-button
                  style="margin-left: auto"
                  type="primary"
                  danger
                  ghost
                  @click="removeProduct(index)"
                  >{{ $t("button.delete") }}</a-button
                >
              </a-col>
            </a-row>
          </a-col>
          <a-col :xs="24" :md="11">
            <a-form-item>
              <a-button type="dashed" block @click="addProduct">
                <PlusOutlined />
                {{ $t("title.addPro") }}
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
                $t("button.addFile")
              }}</label>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-col :md="4" :xs="24"></a-col>
    <a-col :md="10" :xs="24">
      <h2 class="result-block-text">{{ $t("content.yourOrder") }}</h2>
      <div class="form-result">
        <h4>{{ $t("table.applicationNumber") }}: {{ formState.order_num }}</h4>
        <h4>{{ $t("table.client") }}: {{ formState.client_name }}</h4>
        <h4>{{ $t("table.applicationDate") }}: {{ formState.order_date }}</h4>
        <h4>
          {{ $t("table.applicationDeadline") }}: {{ formState.term_date }}
        </h4>
        <h4>
          {{ $t("table.applyingDepartment") }}: {{ formState.department }}
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
        <button @click="createPurchase">
          {{ $t("button.makeApplication") }}
        </button>
      </div>
    </a-col>
  </a-row>
  <a-modal
    v-model:visible="newArticle.visible"
    :title="$t('modal.addingarticle')"
    @ok="createArticle"
  >
    <a-select
      style="width: 200px; margin-bottom: 5px"
      :placeholder="$t('placeholder.category')"
      :options="$store.state.purchaseCategories"
      :field-names="{ label: 'name', value: 'id' }"
      v-model:value="newArticle.categoryId"
      @change="onChangeCategory"
    >
    </a-select>
    <!-- <br />
    <a-input
      style="width: 200px; margin-bottom: 5px"
      v-model:value="newArticle.article"
      :placeholder="$t('placeholder.article')"
    ></a-input> -->
    <br />
    <a-input
      style="width: 200px"
      v-model:value="newArticle.name"
      :placeholder="$t('placeholder.denomination')"
    ></a-input>
  </a-modal>
</template>

<script>
import axios from "axios";
import config from "../../../config.js";
import { reactive, ref, onBeforeMount } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import store from "@/store/index";
import validateSumm from "@/utils/validateSumm";
import i18n from "@/i18n/i18n";
import getDepartmentNameById from "@/utils/getDepartmentNameById";
import getCategoryById from "@/utils/purchases/getCategoryById";
import getArticleById from "@/utils/purchases/getArticleById";
import getSelectFieldNames from "@/utils/purchases/getSelectFieldNames";
const { t } = i18n.global;

export default {
  components: {
    PlusOutlined,
    VNodes: (_, { attrs }) => {
      return attrs.vnodes;
    },
  },
  setup(props, { emit }) {
    const files = ref([]);
    const purchaseCategories = ref([store.state.purchaseCategories]);

    const newArticle = reactive({
      visible: false,
      categoryId: undefined,
      article: "",
      name: "",
    });
    const formState = reactive({
      order_num: undefined,
      client_name: "",
      order_date: "",
      term_date: "",
      products: ref([]),
      department: getDepartmentNameById(store.state.user.departmentId, "long"),
      directorId: undefined,
      // analystId: undefined,
      countryFrom: undefined,
      paid: undefined,
      comment: undefined
    });
    // добавить товар
    const addProduct = () => {
      formState.products.push(
        reactive({
          articles: [],
          productCategoryId: undefined,
          productArticleId: undefined,
          size: undefined,
          volumePurchase: undefined,
          purchaseUnitId: undefined,
          volumeStock: "",
          stockUnitId: undefined,
          stockNote: "",
          volumeWay: "",
          wayUnitId: undefined,
          wayNote: "",
        })
      );
    };

    const piadOptions = [
      // без оплаты нельзя создать заявку
      // {
      //   label: t("content.no"),
      //   value: 0,
      // },
      {
        label: t("content.fully"),
        value: 1,
      },
      {
        label: t("content.byAdvance"),
        value: 2,
      },
      {
        label: t("button.byAgreement"),
        value: 3,
      },
    ];

    // удалить товар
    const removeProduct = (index) => {
      if (index !== -1) {
        formState.products.splice(index, 1);
      }
    };
    // обновить номер заявки
    const refreshPurchaseNum = (orderNum) => {
      formState.order_num =
        new Date().toISOString().split("T")[0] +
        getDepartmentNameById(store.state.user.departmentId) +
        orderNum;
    };
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
    // при изменении категории изменяется список артикулов
    const onChangeCategory = (value) => {
      formState.products.forEach((product) => {
        if (product.productCategoryId === value) {
          product.articles = store.state.purchaseArticles.filter(
            (p) => p.productCategoryId === value
          );
        }
      });
    };
    const filterOption = (inputValue, option) => {
      return option.name.toLowerCase().includes(inputValue.toLowerCase());
    };
    // кнопка добавить артикула
    const addArticle = () => {
      newArticle.visible = true;
    };

    // создать артикул
    const createArticle = async () => {
      newArticle.visible = false;
      if (newArticle.categoryId && newArticle.name !== "") {
        store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios({
          method: "post",
          url: config.API_URL + "api/purchase/product/articles",
          data: {
            productCategoryId: newArticle.categoryId,
            name: newArticle.name,
          },
        })
          .then(async () => {
            store.commit("setIsLoading", false);
            await emit("fetchPurchaseArticles");
            message.success(t("modal.successfullyAdded"));
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
        message.error(t("modal.fillFields"));
      }
    };
    // создать заявку
    const createPurchase = async () => {
      let error = 0;
      if (
        !formState.order_num ||
        !formState.client_name ||
        !formState.order_date ||
        formState.products.length === 0 ||
        !formState.term_date ||
        (!formState.directorId && formState.directorId !== 0) ||
        !formState.countryFrom
        // (!formState.analystId && formState.analystId !== 0)
      ) {
        error = 1;
      }
      for (const product of formState.products) {
        if (
          !product.productCategoryId ||
          !product.productArticleId ||
          !product.volumePurchase ||
          !product.purchaseUnitId
        ) {
          error = 1;
          break;
        }
      }
      if (error) {
        message.error(t("modal.fillFields"));
      } else {
        store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        const bodyFormData = new FormData();
        bodyFormData.append("order_num", formState.order_num);
        bodyFormData.append("client_name", formState.client_name);
        bodyFormData.append("order_date", formState.order_date);
        bodyFormData.append("term_date", formState.term_date);
        bodyFormData.append("directorId", formState.directorId);
        // bodyFormData.append("analystId", formState.analystId);
        bodyFormData.append("countryFrom", formState.countryFrom);
        bodyFormData.append("comment", formState.comment);
        bodyFormData.append("paid", formState.paid ? formState.paid : 0);
        for (const file of files.value) {
          bodyFormData.append("purchase_files", file);
        }

        for (const product of formState.products) {
          delete product.articles;
          product.volumeWay = product.volumeWay.replaceAll(/[\s]/g, "");
          product.volumeStock = product.volumeStock.replaceAll(/[\s]/g, "");
          product.volumePurchase = product.volumePurchase.replaceAll(
            /[\s]/g,
            ""
          );
          product.volumeWay = product.volumeWay === "" ? 0 : product.volumeWay;
          product.volumeStock =
            product.volumeStock === "" ? 0 : product.volumeStock;
          product.volumePurchase =
            product.volumePurchase === "" ? 0 : product.volumePurchase;

          product.purchaseUnitId =
            product.purchaseUnitId === "" ? 0 : product.purchaseUnitId;
          product.stockUnitId =
            product.stockUnitId === "" ? 0 : product.stockUnitId;
          product.wayUnitId = product.wayUnitId === "" ? 0 : product.wayUnitId;

          bodyFormData.append("products", JSON.stringify(product));
        }

        axios({
          method: "post",
          url: config.API_URL + "api/purchase/create",
          data: bodyFormData,
        })
          .then(async () => {
            store.commit("setIsLoading", false);
            message.success(t("modal.orderSuccessAdded"));
            store.commit(
              "setSetTotalPurchases",
              store.state.totalPurchases + 1
            );
            formState.order_num = undefined;
            formState.client_name = undefined;
            formState.order_date = undefined;
            formState.term_date = undefined;
            formState.directorId = undefined;
            formState.comment = undefined;
            // formState.analystId = undefined;
            formState.countryFrom = undefined;
            formState.products = ref([]);
            files.value = [];
            await getPurchaseNum();

            const filesInput = document.getElementById("filesLabel");
            filesInput.style.color = "#181734";
            filesInput.style.borderColor = "#181734";
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
    // получить новый номер заявки
    const getPurchaseNum = async () => {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/purchase/get_num")
        .then((res) => {
          store.commit("setPurchaseNum", res.data.num);
          return res.data.num;
        })
        .catch((e) => console.log(e));
    };

    // получить номер заявки до отрисовки элементов
    const getDirectors = async () => {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/purchase/get_directors")
        .then((res) => {
          store.commit("setDirectors", res.data.directors);
          return res.data.num;
        })
        .catch((e) => console.log(e));
    };

    onBeforeMount(async () => {
      await getDirectors();
    });
    return {
      formState,
      files,
      getFiles,
      createPurchase,
      validateSumm,
      refreshPurchaseNum,
      addProduct,
      addArticle,
      removeProduct,
      purchaseCategories,
      onChangeCategory,
      newArticle,
      createArticle,
      getCategoryById,
      getArticleById,
      filterOption,
      getPurchaseNum,
      getSelectFieldNames,
      piadOptions,
    };
  },
  computed: {
    getOrderNumNew() {
      return store.state.purchaseNum;
    },
  },
  watch: {
    getOrderNumNew() {
      this.refreshPurchaseNum(store.state.purchaseNum);
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
