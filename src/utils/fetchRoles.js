import axios from "axios";
import config from "../../config.js";
import store from "../store";

export default async () => {
  store.commit("setIsLoading", true);
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${window.localStorage.getItem("jwt")}`;
  await axios
    .get(config.API_URL + "api/user/roles")
    .then((res) => {
      if (res.data.roles) {
        store.commit("setRoles", res.data.roles);
      }
      store.commit("setIsLoading", false);
    })
    .catch(async (err) => {
      store.commit("setIsLoading", false);
      if (err.response.data.errors && err.response.data.errors.length !== 0) {
        let errors = "";
        err.response.data.errors.map((error) => [(errors += error.msg + " ")]);
        this.error(errors);
      } else {
        this.error(err.response.data.message);
      }
    });
};
