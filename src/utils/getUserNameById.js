import { ref } from "vue";
import store from "@/store";

export default (id) => {
  const st = ref("");
  st.value = store.state.users?.filter((user) => user.id === id)[0]?.name;
  return st.value;
};
