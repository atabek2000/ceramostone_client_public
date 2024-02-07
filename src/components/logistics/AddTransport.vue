<template>
  <a-row style="margin-top: 20px">
    <a-col :md="10" :xs="24">
      <a-form
        name="advanced_search"
        class="ant-advanced-search-form"
        :model="formState"
      >
        <a-typography-text type="danger" :level="5"
          >* - Обязательные поля</a-typography-text
        >
        <a-row justify="space-between">
          <a-col :md="11" :xs="24">
            <a-form-item>
              <a-date-picker
                v-model:value="formState.send_date"
                value-format="YYYY-MM-DD"
                :placeholder="$t('placeholder.sendDate') + '*'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item>
              <a-date-picker
                v-model:value="formState.logistic_term"
                value-format="YYYY-MM-DD"
                :placeholder="$t('placeholder.deliveryTime') + '*'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item>
              <a-input
                v-model:value="formState.depart_station"
                :placeholder="$t('placeholder.departureStation') + '*'"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item>
              <a-select
                v-model:value="formState.dest_station"
                :options="$store.state.cities"
                :placeholder="$t('placeholder.destinationStation') + '*'"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item>
              <a-input
                v-model:value="formState.wagon_num_cn"
                :placeholder="$t('placeholder.chineseCarriageNumber') + '*'"
              ></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="11" :xs="24">
            <a-form-item>
              <a-input
                v-model:value="formState.dest_readdress"
                :placeholder="$t('placeholder.destinationForwarding')"
              ></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="11" :xs="24">
            <a-form-item>
              <a-input
                v-model:value="formState.logist_company"
                :placeholder="$t('placeholder.logisticsCompany')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="11" :xs="24">
            <a-form-item>
              <a-select
                v-model:value="formState.depart_country"
                :options="$store.state.countries"
                :placeholder="$t('placeholder.departCountry') + '*'"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-select
              v-model:value="formState.purchases"
              mode="multiple"
              label-in-value
              :placeholder="$t('placeholder.selectRequest')"
              style="width: 100%"
              :filter-option="false"
              :not-found-content="searchState.fetching ? undefined : null"
              :options="searchState.data"
              @search="fetchUser"
              @select="onSelectPurchase"
              @deselect="onDeselectPurchase"
            >
              <template v-if="searchState.fetching" #notFoundContent>
                <a-spin size="small" />
              </template>
            </a-select>
          </a-col>
          <a-col class="product-block">
            <h2>{{ $t("title.products") }}</h2>
            <template v-if="formState.products_info.length > 0">
              <div
                v-for="purchase in formState.purchases"
                :key="purchase.value"
              >
                <a-row
                  justify="space-between"
                  v-for="(product, index) in formState.products_info.filter(
                    (product) => product.purchaseId === purchase.value
                  )"
                  :key="product.id"
                  style="margin-bottom: 20px"
                >
                  <a-col :md="24" :xs="24">
                    <h3>
                      {{ $t("title.product") }} {{ index + 1 }}.
                      {{ $t("title.applicationNumber") }}: {{ purchase.label }}
                    </h3>
                    <br />
                  </a-col>
                  <a-col :md="11" :xs="24">
                    <a-form-item :name="product_category">
                      <a-input
                        disabled="true"
                        :placeholder="product.product_category.name"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="11" :xs="24">
                    <a-form-item :name="product_article">
                      <a-input
                        disabled="true"
                        :placeholder="product.product_article.name"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="11" :xs="24">
                    <a-form-item :name="product_article">
                      <a-input
                        v-model:value="product.article"
                        :placeholder="'Артикуль*'"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="11" :xs="24">
                    <a-form-item :name="count_pallet">
                      <a-input
                        @change="
                          () =>
                            (product.count_pallet = validateSumm(
                              product.count_pallet
                            ))
                        "
                        v-model:value="product.count_pallet"
                        :placeholder="$t('placeholder.countPallets')"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="11" :xs="24">
                    <a-form-item :name="count_box_per_pallet">
                      <a-input
                        @change="
                          () =>
                            (product.count_box_per_pallet = validateSumm(
                              product.count_box_per_pallet
                            ))
                        "
                        v-model:value="product.count_box_per_pallet"
                        :placeholder="$t('placeholder.countBoxesPerPallet')"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="11" :xs="24">
                    <a-form-item :name="count_total_box">
                      <a-input
                        @change="
                          () =>
                            (product.count_total_box = validateSumm(
                              product.count_total_box
                            ))
                        "
                        v-model:value="product.count_total_box"
                        :placeholder="$t('placeholder.countBoxes')"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="11" :xs="24">
                    <a-form-item :name="count_product_per_box">
                      <a-input
                        @change="
                          () =>
                            (product.count_product_per_box = validateSumm(
                              product.count_product_per_box
                            ))
                        "
                        v-model:value="product.count_product_per_box"
                        :placeholder="$t('placeholder.countGoodsPerBox')"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="11" :xs="24">
                    <a-form-item :name="amount_product">
                      <a-input
                        @change="
                          () =>
                            (product.amount_product = validateSumm(
                              product.amount_product
                            ))
                        "
                        v-model:value="product.amount_product"
                        :placeholder="$t('placeholder.countGoods') + '*'"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="11" :xs="24">
                    <a-form-item :name="unit_logistic">
                      <a-select
                        v-model:value="product.unit_logistic"
                        :options="$store.state.purchaseUnits"
                        :placeholder="$t('placeholder.unitMeasurement')"
                        :field-names="{
                          label:
                            !getUserLang() ||
                            ['ru', 'kz'].includes(getUserLang())
                              ? 'short'
                              : 'long_eng',
                          value: 'id',
                        }"
                      ></a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :md="11" :xs="24">
                    <a-form-item :name="color_num">
                      <a-input
                        v-model:value="product.color_num"
                        :placeholder="$t('placeholder.colorNumber')"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="11" :xs="24">
                    <a-form-item :name="size_logistic">
                      <a-input
                        v-model:value="product.size_logistic"
                        :placeholder="$t('placeholder.productDimensions')"
                      ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col
                    :md="24"
                    :xs="24"
                    style="display: flex; justify-content: end"
                  >
                    <a-button
                      v-if="product.copy"
                      type="dashed"
                      style="color: red; border-color: red"
                      @click="deleteProduct(product.copy)"
                      >{{ $t("button.delete") }}</a-button
                    >
                    <a-button
                      v-else
                      type="dashed"
                      style="color: #1890ff; border-color: #1890ff"
                      @click="duplicateProduct(product)"
                      >{{ $t("button.duplicateProduct") }}</a-button
                    >
                  </a-col>
                </a-row>
              </div>
            </template>
            <template v-else>
              <a-empty style="width: 100%" />
            </template>
          </a-col>
        </a-row>
      </a-form>
    </a-col>

    <a-col :md="4" :xs="24"></a-col>
    <a-col :md="10" :xs="24">
      <h2 class="result-block-text">{{ $t("content.yourOrder") }}</h2>
      <div class="form-result">
        <h4>
          {{ $t("placeholder.deliveryTime") }}: {{ formState.logistic_term }}
        </h4>
        <h4>
          {{ $t("placeholder.departureStation") }}:
          {{ formState.depart_station }}
        </h4>
        <h4>
          {{ $t("placeholder.destinationStation") }}:
          {{ formState.dest_station }}
        </h4>
        <h4>
          {{ $t("placeholder.chineseCarriageNumber") }}:
          {{ formState.wagon_num_cn }}
        </h4>
        <h4>{{ $t("placeholder.sendDate") }}: {{ formState.send_date }}</h4>
        <h4>
          {{ $t("placeholder.destinationForwarding") }}:
          {{ formState.dest_readdress }}
        </h4>
        <h4>
          {{ $t("placeholder.logisticsCompany") }}:
          {{ formState.logist_company }}
        </h4>
        <h4>
          {{ $t("placeholder.departCountry") }}:
          {{ getCountryByCode(formState.depart_country) }}
        </h4>
      </div>
      <div class="form-button">
        <button @click="createTransport">
          {{ $t("button.registrationSending") }}
        </button>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import axios from "axios";
import config from "../../../config.js";
import { reactive, ref, onBeforeMount } from "vue";
import store from "@/store/index";
import validateSumm from "@/utils/validateSumm";
import i18n from "@/i18n/i18n";
import getCategoryById from "@/utils/purchases/getCategoryById";
import getArticleById from "@/utils/purchases/getArticleById";
const { t } = i18n.global;
import { debounce } from "lodash-es";
import { message } from "ant-design-vue";
import getCountryByCode from "@/utils/getCountryByCode";

export default {
  components: {},
  setup() {
    const files = ref([]);
    const purchaseCategories = ref([store.state.purchaseCategories]);

    const newArticle = reactive({
      visible: false,
      categoryId: undefined,
      article: "",
    });
    const formState = reactive({
      logistic_term: undefined,
      depart_station: undefined,
      depart_country: undefined,
      dest_station: undefined,
      wagon_num_cn: undefined,
      send_date: undefined,
      dest_readdress: undefined,
      logist_company: undefined,
      products_info: [],
      purchases: [],
    });
    const searchState = reactive({
      data: [],
      fetching: false,
    });

    const fetchUser = debounce(async (value) => {
      searchState.data = [];
      searchState.fetching = true;
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios({
        method: "get",
        url: config.API_URL + "api/purchase/search_purchase",
        params: { num: value },
      })
        .then((body) => {
          const data = body.data.purchases.map((purchase) => ({
            label: purchase.order_num,
            value: purchase.id,
          }));
          searchState.data = data;
          searchState.fetching = false;
        })
        .catch((err) => {
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
    }, 300);

    const onSelectPurchase = async (value) => {
      const purchases = [];
      purchases.push(value.value);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios({
        method: "get",
        url: config.API_URL + "api/purchase/get_products",
        params: { purchases },
      }).then((res) => {
        addProduct(res.data.products.rows);
      });
    };

    const onDeselectPurchase = (purchase) => {
      formState.products_info = formState.products_info.filter((product) => {
        return product.purchaseId !== purchase.value;
      });
    };

    // добавить товар
    const addProduct = (products) => {
      const prod_fields = {
        count_pallet: undefined,
        count_box_per_pallet: undefined,
        count_total_box: undefined,
        count_product_per_box: undefined,
        amount_product: undefined,
        unit_logistic: undefined,
        color_num: undefined,
        size_logistic: undefined,
        article: undefined,
      };
      products.map((product) => {
        const new_product = { ...product, ...prod_fields };
        formState.products_info.push(new_product);
      });
    };

    const createTransport = async () => {
      let error = false; 
      let errorText = "";
      const formData = {
        logistic_term: formState.logistic_term,
        depart_station: formState.depart_station,
        depart_country: formState.depart_country,
        dest_station: formState.dest_station,
        wagon_num_cn: formState.wagon_num_cn,
        send_date: formState.send_date,
        dest_readdress: formState.dest_readdress,
        logist_company: formState.logist_company,
        products_info: [],
        purchases: [],
      };
      for (const purch of formState.purchases) {
        formData.purchases.push(purch.value);
      }
      if (
        !formState.logistic_term ||
        !formState.depart_station ||
        !formState.depart_country ||
        !formState.dest_station ||
        !formState.wagon_num_cn ||
        !formState.send_date
      ) {
        error = true;
        errorText = t("modal.fillFields");
      }

      if (formState.products_info.length === 0) {
        error = true;
        errorText = t("placeholder.selectRequest");
      }
      for (const product of formState.products_info) {
        if (!product.amount_product || !product.article) {
          error = true;
          errorText = t("modal.fillFields");
          break;
        }
        formData.products_info.push({
          count_pallet: product.count_pallet?.replaceAll(/[\s]/g, "")
            ? product.count_pallet?.replaceAll(/[\s]/g, "")
            : undefined,
          count_box_per_pallet: product.count_box_per_pallet?.replaceAll(
            /[\s]/g,
            ""
          )
            ? product.count_box_per_pallet?.replaceAll(/[\s]/g, "")
            : undefined,
          count_total_box: product.count_total_box?.replaceAll(/[\s]/g, "")
            ? product.count_total_box?.replaceAll(/[\s]/g, "")
            : undefined,
          count_product_per_box: product.count_product_per_box?.replaceAll(
            /[\s]/g,
            ""
          )
            ? product.count_product_per_box?.replaceAll(/[\s]/g, "")
            : undefined,
          amount_product: product.amount_product?.replaceAll(/[\s]/g, "")
            ? product.amount_product?.replaceAll(/[\s]/g, "")
            : undefined,
          unit_logistic: product.unit_logistic
            ? product.unit_logistic
            : undefined,
          color_num: product.color_num ? product.color_num : undefined,
          size_logistic: product.size_logistic
            ? product.size_logistic
            : undefined,
          article: product.article ? product.article : undefined,
          id: product.id,
          purchaseId: product.purchaseId,
        });
      }
      if (error) {
        message.error(errorText);
      } else {
        store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        axios({
          method: "post",
          url: config.API_URL + "api/logistic/transports",
          data: formData,
        })
          .then(async () => {
            store.commit("setIsLoading", false);
            store.commit("setTotalTransports", store.state.totalTransports + 1);
            message.success(t("modal.orderSuccessAdded"));

            formState.logistic_term = undefined;
            formState.depart_station = undefined;
            formState.depart_country = undefined;
            formState.dest_station = undefined;
            formState.wagon_num_cn = undefined;
            formState.send_date = undefined;
            formState.dest_readdress = undefined;
            formState.logist_company = undefined;
            formState.products_info = [];
            formState.purchases = [];
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
      }
    };

    const duplicateProduct = (product) => {
      const new_product = JSON.parse(JSON.stringify(product));
      new_product.copy = Math.random().toString(36).substring(2, 10);
      formState.products_info.push(new_product);
      formState.products_info.sort(
        (firstItem, secondItem) =>
          firstItem.productCategoryId - secondItem.productCategoryId
      );
    };

    const deleteProduct = (copy) => {
      formState.products_info = formState.products_info.filter(
        (product) => product.copy !== copy
      );
    };

    const getUserLang = () => {
      return localStorage.getItem("lang");
    };

    // получить номер заявки до отрисовки элементов
    onBeforeMount(async () => {});
    return {
      formState,
      files,
      validateSumm,
      addProduct,
      purchaseCategories,
      newArticle,
      getCategoryById,
      getArticleById,
      fetchUser,
      searchState,
      onSelectPurchase,
      onDeselectPurchase,
      createTransport,
      duplicateProduct,
      deleteProduct,
      getCountryByCode,
      getUserLang,
    };
  },
  computed: {},
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

.product-block {
  margin-top: 20px;
  width: 100%;
}
</style>
