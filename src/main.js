import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import {useI18n} from 'vue-i18n'
import i18n from '@/i18n/i18n'



const app = createApp(App,{
    setup(){
        const {t} = useI18n()
        return {t}
    }    
})
app.use(Antd)
app.use(store);
app.use(router);
app.use(i18n)
app.mount('#app')
