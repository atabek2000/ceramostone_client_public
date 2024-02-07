
import axios from 'axios'
import config from "../../config.js"
import store from "../store"
export default async () => {
    store.commit('setIsLoading', true)
    axios.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem('jwt')}`;
    await axios.get(config.API_URL + 'api/user/managers')
    .then((res) => {
        if(res.data.managers.rows) {
            store.commit('setManagers', res.data.managers.rows)
        }
        store.commit('setIsLoading', false)
    })
    .catch((e) => {
        store.commit('setIsLoading', false)
        console.log(e);
    })
}