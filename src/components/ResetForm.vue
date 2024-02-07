<template>
    <div class="container">
        <div v-if="successReset" class="success-reset">
            {{ $t('content.successPassChange', {'second': this.second}) }}   <br>    
            {{ $t('content.toSite') }}  
        </div>
        <div v-else-if="errorReset" class="error-reset">{{ errorMessage }} <br/> <router-link to="/login">{{ $t('content.toSite') }}</router-link></div>
        
    </div>
</template>

<script>
import axios from 'axios'
import config from "../../config";
import { Modal  } from 'ant-design-vue';
import i18n from '@/i18n/i18n'
const {t} = i18n.global

export default {
    name: 'LoginForm',
    data() {
        return {
            successReset: false,
            errorReset: false,
            errorMessage: t('modal.errorOnServer'),
            second: 5
        }
  },
  methods: {
    error(errorText){
        Modal.error({
            title: t('modal.error'),
            content: errorText,
        });
    },
    success(text){
        Modal.success({
            title: t('modal.success'),
            content: text,
        })
    },
    
  },
  async mounted() {
    try {
        this.$store.commit('setIsLoading', true)
        await axios.get(config.API_URL + 'api/user/reset/'+this.$route.params.link)
        .then(() => {
            this.successReset = true
            setTimeout(() => {this.$router.go('/login')}, this.second)
        })
        .catch(() => {
            this.errorReset = true
            this.errorMessage = t('content.linkNotActive')
        })
    
    } 
    catch (e) {
        this.error(e.message)
    }
    this.$store.commit('setIsLoading', false)
  }
  
}
</script>

<style>
.success-reset{
    color: green;
    font-size: 22px
}

.error-reset{
    color: red;
    font-size: 22px
}
</style>
