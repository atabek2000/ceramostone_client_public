<template>
  <div class="login-wrapper">
    <div class="login-logo">
      <img src="../assets/logo_light.png" width="300" />
    </div>
    <div class="login-block">
      <h1
        style="text-align: center; margin-top: 2rem !important; color: #fafafa"
      >
        {{ $t("title.auth") }}
      </h1>
      <a-form
        :model="loginFormState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          :label="$t('formLabel.login')"
          name="email"
          :rules="[
            { required: true, type: 'email', message: $t('formError.login') },
          ]"
        >
          <a-input v-model:value="loginFormState.email" />
        </a-form-item>

        <a-form-item
          :label="$t('formLabel.password')"
          name="password"
          :rules="[{ required: true, message: $t('formError.password') }]"
        >
          <a-input-password v-model:value="loginFormState.password" />
        </a-form-item>

        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #ffffff;
            padding-left: 10px;
          "
        >
          <router-link to="/forgot">{{ $t("button.forgot") }}</router-link>
          <a-button type="primary" html-type="submit">{{
            $t("button.login")
          }}</a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import jwt_decode from "jwt-decode";
import config from "../../config";
import { Modal } from "ant-design-vue";
import router from "@/router";
import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default {
  name: "LoginForm",
  components: {},
  data() {
    return {
      loginFormState: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    onFinish(values) {
      this.login(values);
    },
    onFinishFailed(errorInfo) {
      console.log("Failed:", errorInfo);
    },
    error(errorText) {
      Modal.error({
        title: t("modal.error"),
        content: errorText,
      });
    },
    async login(values) {
      try {
        this.$store.commit("setIsLoading", true);
        await axios
          .post(config.API_URL + "api/user/login", {
            email: values.email,
            password: values.password,
          })
          .then(async (res) => {
            // сохранение токена на local storage
            this.$store.commit("setIsAuth", true);
            window.localStorage.setItem("jwt", res.data.jwt);
            const userData = jwt_decode(res.data.jwt);
            userData.jwt = res.data.jwt;
            this.$store.commit("setUser", userData);
            // получение города
            await axios
              .get(config.API_URL + "api/user/cities/", {
                headers: { Authorization: `Bearer ${res.data.jwt}` },
              })
              .then(async (result) => {
                const cities = [];
                result.data.cities.rows.forEach((city) => {
                  cities.push({ label: city.name, value: city.id });
                });
                this.$store.commit("setCities", cities);
              })
              .catch((e) => console.log(e));
            // получение стран
            await axios
              .get(config.API_URL + "api/logistic/countries/", {
                headers: {
                  Authorization: `Bearer ${window.localStorage.getItem("jwt")}`,
                },
              })
              .then(async (result) => {
                const countries = [];
                result.data.countries.forEach((country) => {
                  countries.push({
                    label:
                      window.localStorage.getItem("lang") &&
                      (window.localStorage.getItem("lang") == "en" ||
                        window.localStorage.getItem("lang") == "cn")
                        ? country.name
                        : country.name_ru,
                    value: country.code,
                    id: country.id,
                  });
                });
                this.$store.commit("setCountries", countries);
              })
              .catch((e) => console.log(e));

            if (this.$store.state.user.section?.includes("industry")) {
              router.push({ path: "/industry" });
            } else if (this.$store.state.user.roleId < 6) {
              router.push({ path: "/orders" });
            } else if (
              this.$store.state.user.roleId >= 6 &&
              this.$store.state.user.roleId < 13
            ) {
              router.push({ path: "/purchases" });
            } else if (this.$store.state.user.roleId >= 13) {
              router.push({ path: "/logistics" });
            }
          })
          .catch(async (err) => {
            if (
              err.response.data.errors &&
              err.response.data.errors.length !== 0
            ) {
              let errors = "";
              err.response.data.errors.map((error) => {
                errors += error.msg + " ";
              });
              this.error(errors);
            } else {
              this.error(err.response.data.message);
            }
          });
      } catch (e) {
        this.error(e.message);
      }
      this.$store.commit("setIsLoading", false);
    },
  },
};
</script>

<style>
.login-logo {
  background-image: transparent url(../assets/LOGO5.png) no-repeat;
  display: flex;
}
.login-wrapper {
  background-image: url(../assets/1back.png);
  background-size: cover;
  animation: color 20s infinite linear;
  opacity: 0.9;
  background-color: #000 !important;
  display: flex;
  flex-direction: column !important;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
@keyframes color {
  0% {
    background-image: url(../assets/1back.png);
    opacity: 1;
  }
  10% {
    background-image: url(../assets/2back.png);
  }
  50% {
    background-image: url(../assets/2back.png);
  }
  60% {
    background-image: url(../assets/1back.png);
  }
  100% {
    background-image: url(../assets/1back.png);
  }
}
.login-block .ant-form-item-label > label {
  color: #f5f5f5 !important;
}
.login-block {
  display: block;
  width: 300px;
}
</style>
