import store from "@/store";

export default (id) => {
    return store.state.purchaseArticles.filter(article => article.id === id)[0]?.name
}