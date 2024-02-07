<template>
  <div class="add-user-wrapper">
    <div class="add-user-block">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          :label="$t('formLabel.name')"
          name="masterName"
          :rules="[{ required: true, message: $t('formError.invalidName') }]"
        >
          <a-input placeholder="Алексей" v-model:value="formState.masterName" />
        </a-form-item>

        <a-form-item
          :label="$t('formLabel.phoneNumber')"
          name="masterPhone"
          :rules="[
            {
              required: true,
              min: 10,
              max: 10,
              message: $t('formError.invalidPhone'),
            },
          ]"
        >
          <a-input
            placeholder="77471008899"
            v-model:value="formState.masterPhone"
            @change="onChangePhone"
          />
        </a-form-item>

        <a-form-item
          name="city_id"
          :label="$t('placeholder.selectCity')"
          :rules="[{ required: true, message: $t('formError.invalidCity') }]"
        >
          <a-select
            v-model:value="formState.city_id"
            :options="$store.state.cities"
          />
        </a-form-item>

        <a-form-item>
          <div style="width: 100%; display: flex; justify-content: end">
            <a-button type="primary" html-type="submit">{{
              $t("button.add")
            }}</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import store from "@/store/index";
import config from "../../../config.js";
import { Modal } from "ant-design-vue";
import { defineComponent, reactive, h } from "vue";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default defineComponent({
  setup() {
    const formState = reactive({
      masterName: "",
      masterPhone: "",
      city_id: "",
    });
    const onFinish = (values) => {
      createMaster(values);
    };
    const onFinishFailed = (errorInfo) => {
      console.log(errorInfo);
    };
    const success = () => {
      Modal.success({
        title: t("modal.success"),
        content: h("p", t("modal.addMasterSuccess")),
      });
    };
    const error = (errorText) => {
      Modal.error({
        title: t("modal.error"),
        content: errorText,
      });
    };
    const createMaster = async (values) => {
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("jwt")}`;
      await axios
        .post(config.API_URL + "api/user/master", {
          name: values.masterName,
          phone: values.masterPhone,
          cityId: values.city_id,
        })
        .then(() => {
          store.commit("setSetTotalMasters", store.state.totalMasters + 1);
          success();
          formState.masterPhone = "";
          formState.masterName = "";
          formState.city_id = "";
        })
        .catch(async (err) => {
          if (
            err.response.data.errors &&
            err.response.data.errors.length !== 0
          ) {
            var errors = "";
            err.response.data.errors.map((error) => {
              errors += error.msg + "\n";
            });
            error(errors);
          } else {
            error(err.response.data.message);
          }
        });
      store.commit("setIsLoading", false);
    };
    const onChangePhone = () => {
      formState.masterPhone = formState.masterPhone.replaceAll(/\D/g, "");
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
      onChangePhone,
    };
  },
});
</script>
<style>
.add-user-wrapper {
  display: flex;
  justify-content: center;
}

.add-user-block {
  width: 80%;
  width: 400px;
  margin-top: 50px;
}
</style>
