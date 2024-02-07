<template>
  <!-- <flying-santa class="santa"> </flying-santa> -->
  <a-config-provider :locale="locale">
    <LoadingSpinner />
    <div>
      <div v-if="$store.state.isAuth">
        <HeaderView v-if="jwt() && jwt() !== ''" @switchLang="switchLang" />
      </div>
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<script>
// import Snowflakes from "magic-snowflakes";

import HeaderView from "./components/HeaderView.vue";
import LoadingSpinner from "./components/LoadingSpinner.vue";
import jwt_decode from "jwt-decode";
import store from "@/store/index";
import ru from "ant-design-vue/es/locale/ru_RU";
import en from "ant-design-vue/es/locale/en_US";
import kz from "ant-design-vue/es/locale/kk_KZ";
import cn from "ant-design-vue/es/locale/zh_CN";
import "dayjs/locale/ru";
import dayjs from "dayjs";
import axios from "axios";
import config from "../config";
import router from "./router";
const langs = {
  ru: ru,
  kz: kz,
  en: en,
  cn: cn,
};

const lang = localStorage.getItem("lang");
// const snowflakes = new Snowflakes({
//   wind: true,
//   count: 40,
//   maxSize: 30,
// });
// snowflakes.start();
dayjs.locale(langs[lang]);

export default {
  name: "App",
  components: {
    HeaderView,
    LoadingSpinner,
  },
  data() {
    return {
      locale: langs[lang] ? langs[lang] : ru,
      path: router.path,
    };
  },
  methods: {
    jwt() {
      return localStorage.getItem("jwt");
    },
    // проверка авторизации
    async getLocalUser() {
      if (localStorage.getItem("jwt") && localStorage.getItem("jwt") !== "") {
        await axios
          .get(config.API_URL + "api/user/auth/", {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          })
          .then(() => {
            const userData = jwt_decode(localStorage.getItem("jwt"));
            store.commit("setIsAuth", true);
            store.commit("setUser", userData);
          })
          .catch(() => {
            if (
              window.location.pathname !== "/forgot" &&
              window.location.pathname.substring(0, 6) !== "/reset"
            ) {
              store.commit("setIsAuth", false);
              router.push("/login");
            }
          });
      } else if (
        window.location.pathname !== "/forgot" &&
        window.location.pathname.substring(0, 6) !== "/reset"
      ) {
        store.commit("setIsAuth", false);
        router.push("/login");
      }
    },
    async getCities() {
      await axios
        .get(config.API_URL + "api/user/cities/", {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("jwt")}`,
          },
        })
        .then(async (result) => {
          const cities = [];
          result.data.cities.rows.forEach((city) => {
            cities.push({ label: city.name, value: city.id });
          });
          this.$store.commit("setCities", cities);
        })
        .catch((e) => console.log(e));
    },

    async getCountries() {
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
    },

    switchLang(lang) {
      localStorage.setItem("lang", lang);
      location.reload();
    },
  },
  async beforeMount() {
    await this.getLocalUser();
    if (store.state.isAuth) {
      await this.getCities();
      await this.getCountries();
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
* {
  margin: 0;
}

body {
  font-family: Verdana, Geneva, sans-serif;
  font-size: 14px;
  background: #f2f2f2;
}

.container {
  max-width: 1440px;
  margin: auto;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

.text-danger {
  color: red;
}

.pointer {
  cursor: pointer;
}

.user-table {
  margin-top: 20px;
}

.hello-text {
  font-size: 40px;
}

.w-100 {
  width: 100%;
}

.w-90 {
  width: 100%;
}

.w-10 {
  width: 10%;
}

.mr-5 {
  margin-right: 5px;
}

/* select-white */
.select-white .ant-select-selector {
  background: none !important;
  color: #ffffff;
}

.select-white svg {
  color: #ffffff;
}

/* select-white */

/* date-picker-white белый input */
.date-picker-white {
  width: 150px !important;
  padding: 2px !important;
  color: #ffffff !important;
  background: none !important;
}
.date-picker-white input {
  color: white !important;
}
.date-picker-white svg {
  color: white;
}
/* date-picker-white */

/* product collapse */
.ant-collapse {
  border-radius: 10px !important;
}

.ant-collapse-header {
  border-radius: 10px !important;
  background-color: #312f6a;
}

.ant-collapse-content {
  border-radius: 10px !important;
}

.ant-collapse-content-box {
  background-color: #312f6a;
  border-radius: 10px !important;
}
/* product collapse */

/* ant table */
.ant-table-content {
  border-radius: 15px !important;
}

.ant-table-pagination {
  border-radius: 10px;
}

.ant-table-thead {
  position: relative;
  z-index: 0;
}
.ant-table-tbody {
  margin-top: 10px !important;
}
.ant-table-cell,
.ant-table-cell-fix-left,
.ant-table-cell-fix-right {
  background-color: #181734 !important;
  z-index: 0 !important;
  color: white !important;
}
/* .cash-table */
.cash-table .ant-table-cell,
.cash-table .ant-table-cell-fix-left,
.cash-table .ant-table-cell-fix-right {
  background-color: #00360e !important;
  z-index: 0 !important;
  color: white !important;
}
.cash-table .ant-table-expanded-row .ant-table-cell,
.cash-table .ant-table-expanded-row .ant-table-cell-fix-left,
.cash-table .ant-table-expanded-row .ant-table-cell-fix-right {
  background-color: rgba(36, 35, 65, 0.9) !important;
  z-index: 0 !important;
  color: white !important;
}
.cash-table .ant-table-cell .ant-table-row-expand-icon {
  color: #00360e;
}
.cash-table .ant-table-pagination,
.cash-table .ant-table-pagination-right {
  background-color: #00360e !important;
  color: white !important;
}
.anticon-left {
  color: white !important;
}
.anticon-right {
  color: white !important;
}
.ant-pagination-item a {
  color: white !important;
}
.cash-table .ant-pagination-item-active a {
  color: #00360e !important;
}

/* .cash-table */

/* .industry */
.industry .ant-table-cell,
.industry .ant-table-cell-fix-left,
.industry .ant-table-cell-fix-right {
  background-color: #544837 !important;
  z-index: 0 !important;
  color: white !important;
}
.industry .ant-table-expanded-row .ant-table-cell,
.industry .ant-table-expanded-row .ant-table-cell-fix-left,
.industry .ant-table-expanded-row .ant-table-cell-fix-right {
  background-color: rgba(36, 35, 65, 0.9) !important;
  z-index: 0 !important;
  color: white !important;
}
.industry .ant-table-cell .ant-table-row-expand-icon {
  color: #544837;
}
.industry .ant-table-pagination,
.industry .ant-table-pagination-right {
  background-color: #544837 !important;
  color: white !important;
}
.anticon-left {
  color: white !important;
}
.anticon-right {
  color: white !important;
}
.ant-pagination-item a {
  color: white !important;
}
.industry .ant-pagination-item-active a {
  color: #544837 !important;
}

/* .cash-table */

.ant-table-expanded-row .ant-table-cell,
.ant-table-expanded-row .ant-table-cell-fix-left,
.ant-table-expanded-row .ant-table-cell-fix-right {
  background-color: rgba(36, 35, 65, 0.9) !important;
  z-index: 0 !important;
  color: white !important;
}
.ant-table-cell .ant-table-row-expand-icon {
  color: #181734;
}
.ant-table-pagination,
.ant-table-pagination-right {
  background-color: #181734 !important;
  color: white !important;
}
.anticon-left {
  color: white !important;
}
.anticon-right {
  color: white !important;
}
.ant-pagination-item a {
  color: white !important;
}
.ant-pagination-item-active a {
  color: #181734 !important;
}

/* ant table */
.h1 {
  color: #fafafa !important;
}
.clearfix:after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
  height: 0;
}

.h1 {
  margin-top: 2rem !important;
  color: #fafafa !important;
}
.ant-form-item-label > label {
  position: relative;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  height: 32px;
  font-size: 14px;
}
.form_wrapper {
  background: #fff;
  width: 400px;
  max-width: 100%;
  box-sizing: border-box;
  padding: 25px;
  margin: 8% auto 0;
  /* position: relative; */
  z-index: 1;
  border-top: 5px solid blue;
  -webkit-box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  -webkit-transform-origin: 50% 0%;
  transform-origin: 50% 0%;
  -webkit-transform: scale3d(1, 1, 1);
  transform: scale3d(1, 1, 1);
  -webkit-transition: none;
  transition: none;
  -webkit-animation: expand 0.8s 0.6s ease-out forwards;
  animation: expand 0.8s 0.6s ease-out forwards;
  opacity: 0;
}

.form_wrapper h2 {
  font-size: 1.5em;
  line-height: 1.5em;
  margin: 0;
}
.form_wrapper .title_container {
  text-align: center;
  padding-bottom: 15px;
}
.form_wrapper h3 {
  font-size: 1.1em;
  font-weight: normal;
  line-height: 1.5em;
  margin: 0;
}
.form_wrapper label {
  font-size: 12px;
}
.form_wrapper .row {
  margin: 10px -15px;
}
.form_wrapper .row > div {
  padding: 0 15px;
  box-sizing: border-box;
}
.form_wrapper .col_half {
  width: 50%;
  float: left;
}
.form_wrapper .input_field {
  position: relative;
  margin-bottom: 20px;
  -webkit-animation: bounce 0.6s ease-out;
  animation: bounce 0.6s ease-out;
}
.form_wrapper .input_field > span {
  position: absolute;
  left: 0;
  top: 0;
  color: #333;
  height: 100%;
  border-right: 1px solid #cccccc;
  text-align: center;
  width: 30px;
}
.form_wrapper .input_field > span > i {
  padding-top: 10px;
}
.form_wrapper .textarea_field > span > i {
  padding-top: 10px;
}
.form_wrapper input[type="text"],
.form_wrapper input[type="email"],
.form_wrapper input[type="password"] {
  width: 100%;
  padding: 8px 10px 9px 35px;
  height: 35px;
  border: 1px solid #cccccc;
  box-sizing: border-box;
  outline: none;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.form_wrapper input[type="text"]:hover,
.form_wrapper input[type="email"]:hover,
.form_wrapper input[type="password"]:hover {
  background: #fafafa;
}
.form_wrapper input[type="text"]:focus,
.form_wrapper input[type="email"]:focus,
.form_wrapper input[type="password"]:focus {
  -webkit-box-shadow: 0 0 2px 1px rgba(255, 169, 0, 0.5);
  -moz-box-shadow: 0 0 2px 1px rgba(255, 169, 0, 0.5);
  box-shadow: 0 0 2px 1px rgba(255, 169, 0, 0.5);
  border: 1px solid #f5ba1a;
  background: #fafafa;
}
.form_wrapper input[type="button"] {
  background: #72bf44;
  height: 35px;
  line-height: 35px;
  width: 100%;
  border: none;
  outline: none;
  cursor: pointer;
  color: #fff;
  font-size: 1.1em;
  margin-bottom: 10px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.form_wrapper input[type="button"]:hover {
  background: darkblue;
}
.form_wrapper input[type="button"]:focus {
  background: darkblue;
}
.form_wrapper input[type="checkbox"],
.form_wrapper input[type="radio"] {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.form_container .row .col_half.last {
  border-left: 1px solid #cccccc;
}

.checkbox_option label {
  margin-right: 1em;
  position: relative;
}
.checkbox_option label:before {
  content: "";
  display: inline-block;
  width: 0.5em;
  height: 0.5em;
  margin-right: 0.5em;
  vertical-align: -2px;
  border: 2px solid #cccccc;
  padding: 0.12em;
  background-color: transparent;
  background-clip: content-box;
  transition: all 0.2s ease;
}
.checkbox_option label:after {
  border-right: 2px solid #000000;
  border-top: 2px solid #000000;
  content: "";
  height: 20px;
  left: 2px;
  position: absolute;
  top: 7px;
  transform: scaleX(-1) rotate(135deg);
  transform-origin: left top;
  width: 7px;
  display: none;
}
.checkbox_option input:hover + label:before {
  border-color: #000000;
}
.checkbox_option input:checked + label:before {
  border-color: #000000;
}
.checkbox_option input:checked + label:after {
  -moz-animation: check 0.8s ease 0s running;
  -webkit-animation: check 0.8s ease 0s running;
  animation: check 0.8s ease 0s running;
  display: block;
  width: 7px;
  height: 20px;
  border-color: #000000;
}

.radio_option label {
  margin-right: 1em;
}
.radio_option label:before {
  content: "";
  display: inline-block;
  width: 0.5em;
  height: 0.5em;
  margin-right: 0.5em;
  border-radius: 100%;
  vertical-align: -3px;
  border: 2px solid #cccccc;
  padding: 0.15em;
  background-color: transparent;
  background-clip: content-box;
  transition: all 0.2s ease;
}
.radio_option input:hover + label:before {
  border-color: #000000;
}
.radio_option input:checked + label:before {
  background-color: #000000;
  border-color: #000000;
}

.select_option {
  position: relative;
  width: 100%;
}
.select_option select {
  display: inline-block;
  width: 100%;
  height: 35px;
  padding: 0px 15px;
  cursor: pointer;
  color: #7b7b7b;
  border: 1px solid #cccccc;
  border-radius: 0;
  background: #fff;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: all 0.2s ease;
}
.select_option select::-ms-expand {
  display: none;
}
.select_option select:hover,
.select_option select:focus {
  color: #000000;
  background: #fafafa;
  border-color: #000000;
  outline: none;
}

.select_arrow {
  position: absolute;
  top: calc(50% - 4px);
  right: 15px;
  width: 0;
  height: 0;
  pointer-events: none;
  border-width: 8px 5px 0 5px;
  border-style: solid;
  border-color: #7b7b7b transparent transparent transparent;
}

.select_option select:hover + .select_arrow,
.select_option select:focus + .select_arrow {
  border-top-color: #000000;
}

.credit {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 15px;
  color: #f5ba1a;
}
.credit a {
  color: #e1a70a;
}

/* table expand button */
.ant-table-row-expand-icon {
  box-shadow: 0px 0px 15px white;
  animation: mymove 3s infinite;
}

.ant-input.br-10 {
  border-radius: 10px;
}

.ant-btn.br-10 {
  border-radius: 10px;
}
.ant-input.br-left-10 {
  border-radius: 0;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.ant-select.br-10:not(.ant-select-customize-input) > .ant-select-selector {
  border-radius: 10px;
}

.ant-select.br-right-10:not(.ant-select-customize-input)
  > .ant-select-selector {
  border-radius: 0;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

@keyframes mymove {
  0% {
    box-shadow: 0px 0px 0px white;
  }
  50% {
    box-shadow: 0px 0px 15px white;
  }
  100% {
    box-shadow: 0px 0px 0px white;
  }
}
/* table expand button */

@-webkit-keyframes check {
  0% {
    height: 0;
    width: 0;
  }
  25% {
    height: 0;
    width: 7px;
  }
  50% {
    height: 20px;
    width: 7px;
  }
}
@keyframes check {
  0% {
    height: 0;
    width: 0;
  }
  25% {
    height: 0;
    width: 7px;
  }
  50% {
    height: 20px;
    width: 7px;
  }
}
@-webkit-keyframes expand {
  0% {
    -webkit-transform: scale3d(1, 0, 1);
    opacity: 0;
  }
  25% {
    -webkit-transform: scale3d(1, 1.2, 1);
  }
  50% {
    -webkit-transform: scale3d(1, 0.85, 1);
  }
  75% {
    -webkit-transform: scale3d(1, 1.05, 1);
  }
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    opacity: 1;
  }
}
@keyframes expand {
  0% {
    -webkit-transform: scale3d(1, 0, 1);
    transform: scale3d(1, 0, 1);
    opacity: 0;
  }
  25% {
    -webkit-transform: scale3d(1, 1.2, 1);
    transform: scale3d(1, 1.2, 1);
  }
  50% {
    -webkit-transform: scale3d(1, 0.85, 1);
    transform: scale3d(1, 0.85, 1);
  }
  75% {
    -webkit-transform: scale3d(1, 1.05, 1);
    transform: scale3d(1, 1.05, 1);
  }
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
    opacity: 1;
  }
}
@-webkit-keyframes bounce {
  0% {
    -webkit-transform: translate3d(0, -25px, 0);
    opacity: 0;
  }
  25% {
    -webkit-transform: translate3d(0, 10px, 0);
  }
  50% {
    -webkit-transform: translate3d(0, -6px, 0);
  }
  75% {
    -webkit-transform: translate3d(0, 2px, 0);
  }
  100% {
    -webkit-transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes bounce {
  0% {
    -webkit-transform: translate3d(0, -25px, 0);
    transform: translate3d(0, -25px, 0);
    opacity: 0;
  }
  25% {
    -webkit-transform: translate3d(0, 10px, 0);
    transform: translate3d(0, 10px, 0);
  }
  50% {
    -webkit-transform: translate3d(0, -6px, 0);
    transform: translate3d(0, -6px, 0);
  }
  75% {
    -webkit-transform: translate3d(0, 2px, 0);
    transform: translate3d(0, 2px, 0);
  }
  100% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

.menu-opt-block {
  display: none;
}

.excelButton {
  box-shadow: -1px 13px 17px -6px #000000;
  background: linear-gradient(to bottom, #9e96ec 5%, #010031 100%);
  background-color: rgb(24, 23, 52);
  border-radius: 10px;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  padding: 5px 10px;
  text-decoration: none;
  text-decoration: none;
  margin-bottom: 10px;
}
.excelButton:hover {
  /* background: linear-gradient(to bottom, #010031 5%, #010031 100%); */
  /* background-color: #091df0; */
  color: white;
  position: relative;
  padding: 9px 14px;
  top: -4px;
  right: -4px;
  margin-bottom: 2px;
}
.excelButton:active {
  top: 1px;
}

.excelButtonBlock {
  display: flex;
  justify-content: flex-end;
}

.secondary-green-button {
  color: green !important;
  border: 1px solid green !important;
}

@media screen and (max-width: 960px) {
  .container {
    width: 95%;
    margin: auto;
  }
  .header-links-block {
    display: none;
  }
  .menu-opt-block {
    display: block;
  }
}

@media (max-width: 600px) {
  .form_wrapper .col_half {
    width: 100%;
    float: none;
  }

  .bottom_row .col_half {
    width: 50%;
    float: left;
  }

  .form_container .row .col_half.last {
    border-left: none;
  }

  .remember_me {
    padding-bottom: 20px;
  }

  .hello-text {
    font-size: 20px;
  }
}
</style>
