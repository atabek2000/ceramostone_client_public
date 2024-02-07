import store from "@/store";

export default (id) => {
    return store.state.cities.filter(city => city.value === id)[0] ? store.state.cities.filter(city => city.value === id)[0].label : ''
}