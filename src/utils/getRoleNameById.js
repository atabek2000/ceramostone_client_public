import { ref } from "vue";
import store from "@/store";

export default (id) => {
  const st = ref("");
  st.value = store.state.roles?.filter((role) => role.id === id)[0].name;
  return st;
};
