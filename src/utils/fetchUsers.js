import axios from "axios";
import config from "../../config.js";
import store from "../store";

export default async () => {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${window.localStorage.getItem("jwt")}`;
  await axios
    .get(config.API_URL + "api/task/users")
    .then((res) => {
      store.commit("setUsers", res.data);
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
