<template>
  <a-row>
    <a-col :md="20" :xs="24">
      <p class="titlePage">Добавить компанию</p>
      <a-form
        name="cash_search"
        class="ant-advanced-search-form"
        :model="companyModal"
      >
        <a-row justify="space-between">
          <a-col :md="7" :xs="24">
            <a-form-item :name="name">
              <a-input
                class="br-10"
                v-model:value="companyModal.name"
                placeholder="*Название"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :xs="24">
            <a-form-item :name="name">
              <a-select
                class="br-10"
                v-model:value="companyModal.directorId"
                style="width: 100%"
                :options="
                  $store.state.users.filter(
                    (user) =>
                      user.roleId === 7 &&
                      user.sections &&
                      user.sections.includes('c_dir')
                  )
                "
                placeholder="*Выберите директор"
                :field-names="{ label: 'name', value: 'id' }"
              >
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="7" :xs="24">
            <a-form-item :name="name">
              <a-select
                class="br-10"
                v-model:value="companyModal.chiefAccountantId"
                style="width: 100%"
                :options="
                  $store.state.users.filter((user) => user.roleId === 20)
                "
                placeholder="*Выберите бухгалтер"
                :field-names="{ label: 'name', value: 'id' }"
              >
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="7" :xs="24">
            <a-form-item :name="name">
              <a-select
                class="br-10"
                v-model:value="companyModal.cashierId"
                style="width: 100%"
                :options="
                  $store.state.users.filter((user) => user.roleId === 3)
                "
                placeholder="*Выберите кассир"
                :field-names="{ label: 'name', value: 'id' }"
              >
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="7" :xs="24">
            <a-form-item :name="name">
              <a-select
                class="br-10"
                v-model:value="companyModal.cashierBankId"
                style="width: 100%"
                :options="
                  $store.state.users.filter((user) => user.roleId === 21)
                "
                placeholder="*Выберите кассир по банку"
                :field-names="{ label: 'name', value: 'id' }"
              >
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="7" :xs="0"></a-col>

          <a-col :md="7" :xs="24">
            <div class="form-button">
              <button @click="createCompany">Сохранить</button>
            </div>
          </a-col>
          <a-col :xs="24">
            <a-typography-text type="danger"
              >* - обязательные поля</a-typography-text
            >
          </a-col>
        </a-row>
      </a-form>
    </a-col>
  </a-row>
</template>

<script>
import { reactive } from "vue";
import store from "@/store";

export default {
  props: {
    currencyOptions: Object,
    issuanOptions: Object,
    contractorTypes: Object,
  },
  setup(props, { emit }) {
    // данные статья

    const companyModal = reactive({
      visible: false,
      name: undefined,
      directorId: undefined,
      chiefAccountantId: undefined,
      cashierId: undefined,
      cashierBankId: undefined,
    });

    const createCompany = async () => {
      emit("createCompany", companyModal);

      companyModal.visible = false;
      companyModal.name = undefined;
      companyModal.directorId = undefined;
      companyModal.chiefAccountantId = undefined;
      companyModal.cashierId = undefined;
      companyModal.cashierBankId = undefined;
    };

    return {
      companyModal,
      createCompany,
    };
  },

  computed: {
    getOrderNumNew() {
      return store.state.cashNum;
    },
  },
  watch: {
    getOrderNumNew() {
      this.refreshCashNum(store.state.cashNum);
    },
  },
};
</script>

<style scoped>
.form-button {
  margin-top: 10px;
}
.form-button button {
  width: 100%;
  background-color: #72bf44;
  height: 35px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
}

.form-button button:active {
  background-color: #4ba517;
}
.titlePage {
  color: #00360e;
  font-size: 20px;
  font-weight: 550;
  padding-top: 20px;
}
</style>
