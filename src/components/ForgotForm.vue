<template>
    <div class="login-wrapper">
        <div class="forgot-block">
            <h1 style="text-align: center; color: floralwhite;">{{ $t('title.forgot') }}</h1>
            <a-space direction="vertical" size="middle">
                <a-typography-text type="secondary" style=" color: floralwhite;">{{ $t('content.forgot') }}</a-typography-text>
                <a-form
                    :model="forgotFormState"
                    name="basic"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                    autocomplete="off"
                    @finish="onFinish"
                    @finishFailed="onFinishFailed"
                >
                    <a-form-item
                    label="Email"
                    name="email"
                    :rules="[{ required: true, type: 'email', message: $t('formLabel.login') }]"
                    >
                    <a-input v-model:value="forgotFormState.email" :placeholder="$t('placeholder.email')"/>
                    </a-form-item>

                    <a-form-item
                    :label="$t('formLabel.newPassword')"
                    name="password"
                    :rules="[{ required: true, message: $t('formError.password') }]"
                    >
                    <a-input-password v-model:value="forgotFormState.password" :placeholder="$t('placeholder.newPassword')"/>
                    </a-form-item>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <router-link to="/login" >{{ $t('button.login') }}</router-link>
                        <a-button type="primary" html-type="submit">{{ $t('button.send') }}</a-button>
                    </div>
                </a-form>
            </a-space>
        </div>
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
    components: {
    },
    data() {
        return {
            forgotFormState: {
                email: '',
                password: ''
            }
        
        }
  },
    methods: {
    onFinish(values) {
        this.forgot(values)
    },
    onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    },
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
    async forgot(values) {
      try {
        this.$store.commit('setIsLoading', true)
        await axios.post(config.API_URL + 'api/user/forgot',
        {
            email: values.email,
            password: values.password 
        })
        .then(() => {
            this.success(t('modal.linkSent'))
        })
        .catch(() => {
            this.error(t('modal.errorOnServer'))
        })
        
      } 
      catch (e) {
        this.error(e.message)
      }
      this.$store.commit('setIsLoading', false)
    }
  }
}
</script>

<style>
.login-wrapper {
    display: flex; 
    flex-direction: row; 
    align-items: center; 
    justify-content: center;
    height: 100vh;
}
.forgot-block{
    color: aliceblue;
    display: block;
    width: 400px;
}
</style>
