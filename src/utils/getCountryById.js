import store from "@/store";

export default (id) => {
  return store.state.countries.filter((country) => country.id == id)[0]
    ? store.state.countries.filter((country) => country.id == id)[0].label
    : "";
};
