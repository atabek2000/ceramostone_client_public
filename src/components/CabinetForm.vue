<template>
    <div class="container">
        <div class="add-user-wrapper">
            <div class="add-user-block">
                <h3 :style="{ marginBottom: '16px' }">{{ $t('title.changePhone') }}</h3>
                <a-form :model="formStatePhone" name="changePhone" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                    autocomplete="off" @finish="onFinishPhone">
                    <a-form-item name="phone" 
                        :rules="[{ required: true, min: 10, max: 10, message: $t('formError.invalidPhone') }]">
                        <a-input v-model:value="formStatePhone.phone" :placeholder="$t('placeholder.phoneNumber')" allow-clear>
                            <template #prefix><PhoneOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                        </a-input>
                    </a-form-item>
                    <a-form-item name="password"
                        :rules="[{ required: true, min: 4,  message: $t('formError.invalidPassword') }]">
                    
                        <a-input v-model:value="formStatePhone.password" type="password" :placeholder="$t('placeholder.password')" allow-clear>
                            <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                        </a-input>
                    </a-form-item>
                    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                        <a-button type="primary" html-type="submit">{{ $t('button.change') }}</a-button>
                    </a-form-item>
                </a-form>
                <h3 :style="{ marginBottom: '16px' }">{{ $t('title.changePassword') }}</h3>
                <a-form :model="formStatePass" name="changePass" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                    autocomplete="off" @finish="onFinishPass" >
                    <a-form-item name="password"
                        :rules="[{ required: true, min: 4,  message: $t('formError.invalidPassword') }]">
                    
                        <a-input v-model:value="formStatePass.password" type="password" :placeholder="$t('placeholder.enterOldPass')" allow-clear>
                            <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                        </a-input>
                    </a-form-item>
                    <a-form-item name="pass1"
                        :rules="[{ required: true, min: 4,  message: $t('formError.invalidPassword') }]">
                    
                        <a-input v-model:value="formStatePass.pass1" type="password" :placeholder="$t('placeholder.enterNewPass')" allow-clear>
                            <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                        </a-input>
                    </a-form-item>
                    <a-form-item name="pass2"
                        :rules="[{ required: true, min: 4,  message: $t('formError.invalidPassword') }]"
                    >
                        <a-input v-model:value="formStatePass.pass2" type="password" :placeholder="$t('placeholder.confirmNewPass')" allow-clear>
                            <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                        </a-input>
                    </a-form-item>
                    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                        <a-button type="primary" html-type="submit">{{ $t('button.change') }}</a-button>
                    </a-form-item>
                </a-form>
                <h3 :style="{ marginBottom: '16px' }">{{ $t('title.changeEmail') }}</h3>
                <a-form :model="formStateEmail" name="changeEmail" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                    autocomplete="off" @finish="onFinishEmail">
                    <a-form-item name="email"
                    :rules="[{ required: true, type: 'email',  message: $t('formError.invalidEmail') }]"
                    >
                        <a-input v-model:value="formStateEmail.email" :placeholder="$t('placeholder.email')" allow-clear>
                            <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                        </a-input>
                    </a-form-item>
                    <a-form-item name="password"
                    :rules="[{ required: true, min: 4,  message: $t('formError.invalidPassword') }]"
                    >
                        <a-input v-model:value="formStateEmail.password" type="password" :placeholder="$t('placeholder.password')" allow-clear>
                            <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                        </a-input>
                    </a-form-item>
                    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                        <a-button type="primary" html-type="submit">{{ $t('button.change') }}</a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import store from '@/store/index';
import config from "../../config.js"
import { Modal  } from 'ant-design-vue';
import { defineComponent, reactive, h } from 'vue';
import { LockOutlined, PhoneOutlined } from '@ant-design/icons-vue';
import i18n from '@/i18n/i18n'
const {t} = i18n.global

export default defineComponent({
    setup() {
        const formStatePhone = reactive({
            phone: "",
            password: ""
        });
        const formStatePass = reactive({
            pass1: "",
            pass2: "",
            password: ""
        });
        const formStateEmail = reactive({
            email: "",
            password: ""
        });
        const onFinishPhone = values => {
            changePhone(values);
        };
        const onFinishPass = values => {
            changePass(values);
        };
        const onFinishEmail = values => {
            changeEmail(values);
        };
        const onFinishFailed = errorInfo => {
           console.log(errorInfo);
        };
        const success = (message) => {
            Modal.success({
                title: t('modal.success'),
                content: h("p", message)
            });
        };
        const error = (errorText) => {
            Modal.error({
                title: t('modal.error'),
                content: errorText,
            });
        };
        const changePhone = async (values) => {
            store.commit("setIsLoading", true);
            axios.defaults.headers.common["Authorization"] = `Bearer ${window.localStorage.getItem('jwt')}`;
            await axios.put(config.API_URL + "api/user/change_phone", {
                phone: values.phone,
                password: values.password
            }).then(() => {
                success(t('modal.phoneSuccessChanged'));
            }).catch(async (err) => {
                if (err.response.data.errors && err.response.data.errors.length !== 0) {
                    var errors = "";
                    err.response.data.errors.map((error) => {
                        errors += error.msg + "\n";
                    });
                    error(errors);
                }
                else {
                    error(err.response.data.message);
                }
            });
            store.commit("setIsLoading", false);
        };
        const changePass = async (values) => {
            if (values.pass1 === values.pass2) {
                store.commit("setIsLoading", true);
                axios.defaults.headers.common["Authorization"] = `Bearer ${window.localStorage.getItem('jwt')}`;
                await axios.put(config.API_URL + "api/user/change_pass", {
                    password: values.password,
                    pass: values.pass1,
                }).then(() => {
                    success(t('modal.passSuccessChanged'));
                }).catch(async (err) => {
                    if (err.response.data.errors && err.response.data.errors.length !== 0) {
                        var errors = "";
                        err.response.data.errors.map((error) => {
                            errors += error.msg + "\n";
                        });
                        error(errors);
                    }
                    else {
                        error(err.response.data.message);
                    }
                });
                store.commit("setIsLoading", false);
            } else {
                error(t('modal.passNotMatch'))
            }
        };
        const changeEmail = async (values) => {
            store.commit("setIsLoading", true);
            axios.defaults.headers.common["Authorization"] = `Bearer ${window.localStorage.getItem('jwt')}`;
            await axios.put(config.API_URL + "api/user/change_email", {
                email: values.email,
                password: values.password,
            }).then((res) => {
                localStorage.setItem('jwt', res.data.token)
                store.commit("setJwt", res.data.token)
                success(t('modal.emailSuccessChanged', {email: values.email}));
            }).catch((err) => {
                if (err.response.data.errors && err.response.data.errors.length !== 0) {
                    var errors = "";
                    err.response.data.errors.map((error) => {
                        errors += error.msg + "\n";
                    });
                    error(errors);
                }
                else {
                    error(err.response.data.message);
                }
            });
            store.commit("setIsLoading", false);
        };
        return {
            formStatePhone,
            formStatePass,
            formStateEmail,
            onFinishPhone,
            onFinishPass,
            onFinishEmail,
            changePhone,
            changePass,
            changeEmail,
            onFinishFailed
        };
    },
    components: { PhoneOutlined, LockOutlined }
});
</script>
<style>
.add-user-wrapper {
    display: flex;
    justify-content: center;
}

.add-user-block {
    width: 80%;
    width: 400px;
    margin-top: 50px;
}
</style>