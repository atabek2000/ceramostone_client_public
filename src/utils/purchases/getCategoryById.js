import store from "@/store";

export default (id) => {
    return store.state.purchaseCategories.filter(cat => cat.id === id)[0]?.name
}