<template>
    <div class="add-user-wrapper">
        <div class="add-user-block">
            <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
                <a-form-item :label="$t('formLabel.email')" name="email"
                    :rules="[{ required: true, type: 'email', message: $t('formError.invalidEmail') }]">
                    <a-input v-model:value="formState.email" />
                </a-form-item>

                <a-form-item :label="$t('formLabel.name')" name="username" :rules="[{ required: true, message: $t('formError.invalidName') }]">
                    <a-input v-model:value="formState.username" />
                </a-form-item>

                <a-form-item :label="$t('formLabel.phoneNumber')" name="phone" :rules="[{ required: true, min: 10, max: 10, message: $t('formError.invalidPhone') }]">
                    <a-input v-model:value="formState.phone" @change="onChangePhone"/>
                </a-form-item>

                <a-form-item :label="$t('formLabel.password')" name="password"
                    :rules="[{ required: true, min: 4, message: $t('formError.invalidPassword') }]">
                    <a-input-password v-model:value="formState.password" />
                </a-form-item>

                <a-form-item name="role" :label="$t('formLabel.selectRole')" :rules="[{ required: true, message: $t('formError.invalidRole') }]">
                    <a-select v-model:value="formState.role" :options="$store.state.roles" :field-names="{ label: 'name', value: 'id'}" />
                </a-form-item>

                <a-form-item name="department" :label="$t('formLabel.selectDepartment')" :rules="[{ required: true, message: $t('formError.invalidDepartment') }]">
                    <a-select v-model:value="formState.department" :options="$store.state.departments" />
                </a-form-item>

                <a-form-item name="city_id" :label="$t('formLabel.selectCity')" :rules="[{ required: true, message: $t('formError.invalidCity') }]">
                    <a-select v-model:value="formState.city_id" :options="$store.state.cities" />
                </a-form-item>

                <a-form-item >
                    <div style="width: 100%; display: flex; justify-content: end">
                        <a-button type="primary" html-type="submit">{{ $t('button.add') }}</a-button>
                    </div>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import store from '@/store/index';
import config from "../../config.js"
import { Modal  } from 'ant-design-vue';
import { defineComponent, reactive, h, onBeforeMount} from 'vue';
import i18n from '@/i18n/i18n'
const {t} = i18n.global

export default defineComponent({
    setup() {
        const roles = [{
            label: t('role.manager'),
            value: '2',
        }, {
            label: t('role.cashier'),
            value: '3',
        }, {
            label: t('role.coordinator'),
            value: '4',
        }, {
            label: t('role.foreman'),
            value: '5',
        }
        ];
        const formState = reactive({
            username: '',
            password: '',
            email: '',
            phone: '',
            department: '',
            role: '',
            city_id: '', 
        });
        const onFinish = values => {
            createUser(values)
        };
        const onFinishFailed = errorInfo => {
           console.log(errorInfo);
        };
        const success = () => {
            Modal.success({
                title: t('modal.success'),
                content: h('p', t('modal.userSuccessAdded'))
            });
        };
        const error = (errorText) => {
            Modal.error({
                title: t('modal.error'),
                content: errorText,
            });
        };
        const onChangePhone = () => {
            formState.phone = formState.phone.replaceAll(/\D/g, '')
        }
        const createUser = async (values) => {
            store.commit('setIsLoading', true)
            axios.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem('jwt')}`;
            await axios.post(config.API_URL + 'api/user/create',
                {
                    name: values.username,
                    email: values.email,
                    password: values.password,
                    role_id: values.role,
                    phone: values.phone,
                    department_id: values.department,
                    city_id: values.city_id
                }).then(() => {
                    store.commit('setSetTotalUsers', store.state.totalUsers+1)
                    success()
                    formState.username = ''
                    formState.password = ''
                    formState.email = ''
                    formState.phone = ''
                    formState.department = ''
                    formState.role = ''
                    formState.city_id = ''

                }).catch(async (err) => {
                    if (err.response.data.errors && err.response.data.errors.length !== 0) {
                        var errors = ''
                        err.response.data.errors.map((error) => {
                            errors += error.msg + '\n'
                        })
                        error(errors)
                    } else {
                        error(err.response.data.message)
                    }
                }
            )
            store.commit('setIsLoading', false)
        }
        onBeforeMount( async () => {
            axios.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem('jwt')}`;
            await axios.get(config.API_URL + 'api/user/departments',)
            .then((res) => {
                const departments = []
                res.data.departments.rows.forEach(dep => {
                    departments.push({value: dep.id, label: dep.name})
                });
                store.commit('setDepartments', departments)
            })
            .catch(e => console.log(e))

            await axios.get(config.API_URL + 'api/user/roles',)
            .then((res) => {
                store.commit('setRoles', res.data.roles)
            })
            .catch(e => console.log(e))
        })
        return {
            formState,
            onFinish,
            onFinishFailed,
            roles,
            onChangePhone,
        };
    },
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