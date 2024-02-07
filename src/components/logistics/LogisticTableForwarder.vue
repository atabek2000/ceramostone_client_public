<template>
  <div class="user-table">
    <a-table
      size="small"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataSource"
      :scroll="{ x: 720 }"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template
        #customFilterDropdown="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
      >
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="$t('placeholder.search')"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="
              (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
            "
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            <template #icon><SearchOutlined></SearchOutlined></template>
            {{ $t("placeholder.search") }}
          </a-button>
          <a-button
            size="small"
            style="width: 90px"
            @click="handleReset(clearFilters)"
          >
            {{ $t("button.reset") }}
          </a-button>
        </div>
      </template>
      <template #customFilterIcon="{ filtered, column }">
        <search-outlined
          v-if="
            column.dataIndex === 'order_num' ||
            column.dataIndex === 'client_name'
          "
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <filter-outlined
          v-else
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
      </template>
      <template #bodyCell="{ column, record, index }">
        <template
          v-if="column.dataIndex === 'wagon_num_cn' && record.wagon_num_cn"
        >
          {{ record.wagon_num_cn }}
        </template>
        <template
          v-else-if="column.dataIndex === 'overload' && record.overload"
        >
          {{ new Date(record.overload).toLocaleString().replace(",", "") }}
          <div
            v-if="record.transport_files.length === 0"
            @click="editRowPhoto(index, record.id)"
            style="display: inline-block; margin-left: 20px; cursor: pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1_2556)">
                <path
                  d="M3 8C3 8.55 3.45 9 4 9C4.55 9 5 8.55 5 8V6H7C7.55 6 8 5.55 8 5C8 4.45 7.55 4 7 4H5V2C5 1.45 4.55 1 4 1C3.45 1 3 1.45 3 2V4H1C0.45 4 0 4.45 0 5C0 5.55 0.45 6 1 6H3V8Z"
                  fill="lightgreen"
                />
                <path
                  d="M13 17C14.6569 17 16 15.6569 16 14C16 12.3431 14.6569 11 13 11C11.3431 11 10 12.3431 10 14C10 15.6569 11.3431 17 13 17Z"
                  fill="lightgreen"
                />
                <path
                  d="M21 6H17.83L16.59 4.65C16.22 4.24 15.68 4 15.12 4H8.72C8.89 4.3 9 4.63 9 5C9 6.1 8.1 7 7 7H6V8C6 9.1 5.1 10 4 10C3.63 10 3.3 9.89 3 9.72V20C3 21.1 3.9 22 5 22H21C22.1 22 23 21.1 23 20V8C23 6.9 22.1 6 21 6ZM13 19C10.24 19 8 16.76 8 14C8 11.24 10.24 9 13 9C15.76 9 18 11.24 18 14C18 16.76 15.76 19 13 19Z"
                  fill="lightgreen"
                />
              </g>
              <defs>
                <clipPath id="clip0_1_2556">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div
            v-else
            @click="ViewRowPhoto(record.id, record.transport_files)"
            style="display: inline-block; margin-left: 20px; cursor: pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1_2662)">
                <path
                  d="M22 16V4C22 2.9 21.1 2 20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16ZM11.4 12.53L13.03 14.71L15.61 11.49C15.81 11.24 16.19 11.24 16.39 11.49L19.35 15.19C19.61 15.52 19.38 16 18.96 16H9C8.59 16 8.35 15.53 8.6 15.2L10.6 12.53C10.8 12.27 11.2 12.27 11.4 12.53V12.53ZM2 7V20C2 21.1 2.9 22 4 22H17C17.55 22 18 21.55 18 21C18 20.45 17.55 20 17 20H5C4.45 20 4 19.55 4 19V7C4 6.45 3.55 6 3 6C2.45 6 2 6.45 2 7Z"
                  fill="LightSalmon"
                />
              </g>
              <defs>
                <clipPath id="clip0_1_2662">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </template>

        <template
          v-else-if="column.dataIndex === 'wagon_num_kz' && record.wagon_num_kz"
        >
          {{ record.wagon_num_kz }}
        </template>
        <template
          v-else-if="column.dataIndex === 'send_num' && record.send_num"
        >
          {{ record.send_num }}
        </template>
        <template
          v-else-if="column.dataIndex === 'wagon_num' && record.wagon_num"
        >
          {{ record.wagon_num }}
        </template>
        <template
          v-else-if="
            column.dataIndex === 'transport_locations' &&
            record.transport_locations
          "
        >
          <div style="display: flex; align-items: center">
            <div style="cursor: pointer">
              <svg
                @click="showEditLocation(record.id)"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1_3225)">
                  <path
                    d="M18.11 1.77002L19.07 0.810022C19.1625 0.717319 19.2724 0.643771 19.3934 0.59359C19.5143 0.543408 19.644 0.517578 19.775 0.517578C19.906 0.517578 20.0357 0.543408 20.1566 0.59359C20.2776 0.643771 20.3875 0.717319 20.48 0.810022L21.19 1.52002C21.58 1.91002 21.58 2.54002 21.19 2.93002L20.23 3.89002L18.11 1.77002ZM17.11 2.77002L19.23 4.89002L13.26 10.86C13.1671 10.9533 13.0417 11.0071 12.91 11.01H11.5C11.22 11.01 11 10.79 11 10.51V9.10002C11 8.97002 11.05 8.84002 11.15 8.75002L17.11 2.77002ZM15.13 2.64002L9.79 7.98002C9.61 8.17002 9.5 8.42002 9.5 8.69002V11.52C9.5 12.07 9.95 12.52 10.5 12.52H13.33C13.6 12.52 13.85 12.41 14.04 12.23L19.37 6.90002C19.77 7.88002 20 8.99002 20 10.21C20 13.39 17.55 17.13 12.66 21.44C12.28 21.77 11.71 21.77 11.33 21.44C6.45 17.13 4 13.39 4 10.21C4 5.23002 7.8 2.01002 12 2.01002C13.09 2.01002 14.16 2.23002 15.13 2.64002Z"
                    fill="lightgreen"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_3225">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div style="cursor: pointer; margin-left: 10px">
              <svg
                @click="showLocationsModal(record.transport_locations)"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1_3542)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6 20H18C18.55 20 19 20.45 19 21C19 21.55 18.55 22 18 22H6C5.45 22 5 21.55 5 21C5 20.45 5.45 20 6 20ZM12 7C10.9 7 10 7.9 10 9C10 10.1 10.9 11 12 11C12.5304 11 13.0391 10.7893 13.4142 10.4142C13.7893 10.0391 14 9.53043 14 9C14 8.46957 13.7893 7.96086 13.4142 7.58579C13.0391 7.21071 12.5304 7 12 7ZM12 2C15.27 2 19 4.46 19 9.15C19 12.13 16.87 15.27 12.61 18.54C12.25 18.82 11.75 18.82 11.39 18.54C7.13 15.26 5 12.13 5 9.15C5 4.46 8.73 2 12 2Z"
                    fill="LightSalmon"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_3542">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <p style="margin: 0; padding-left: 10px">
              {{ record.transport_locations[0]?.name }}
            </p>
          </div>
        </template>
        <template
          v-else-if="
            column.dataIndex !== 'action' &&
            column.dataIndex !== 'transportStatusId'
          "
        >
          _
        </template>
        <template
          v-if="
            column.dataIndex === 'action' &&
            (!record.overload ||
              !record.wagon_num_kz ||
              !record.send_num ||
              !record.wagon_num)
          "
        >
          <edit-outlined
            @click="editRow(index, record.id)"
            style="color: lightgreen"
          />
        </template>
        <template v-if="column.dataIndex === 'transportStatusId'">
          <TransportStatus :transport="record" />
        </template>
      </template>
    </a-table>
  </div>

  <a-modal
    v-model:visible="AddPhotomodalVisible"
    :title="$t('table.addingPhoto')"
    @ok="AddPhotoOkModal"
  >
    <a-form :model="formState">
      <a-row justify="space-between">
        <a-col :md="24" :xs="24">
          <a-form-item>
            <a-upload
              :file-list="forward_images"
              :multiple="true"
              maxCount="10"
              :before-upload="beforeUploadProvider"
              @remove="handleRemoveProvider"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                {{ $t("table.addingPhoto") }} (.png, .jpg, .jpeg, .gif) 10
              </a-button>
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
  <a-modal
    v-model:visible="modalVisible"
    :title="$t('modal.changingData')"
    @ok="modalOk"
  >
    <a-form name="forw_data" :model="formState">
      <a-row justify="space-between">
        <a-col :md="11" :xs="24" v-if="!dataSource[currentIndex]?.overload">
          <a-form-item>
            <a-date-picker
              :show-time="{ format: 'HH:mm' }"
              v-model:value="formState.overload"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="$t('table.overload')"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24" v-if="!dataSource[currentIndex]?.wagon_num_kz">
          <a-form-item>
            <a-input
              v-model:value="formState.wagon_num_kz"
              :placeholder="$t('table.wagonKz')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24" v-if="!dataSource[currentIndex]?.send_num">
          <a-form-item>
            <a-input
              v-model:value="formState.send_num"
              :placeholder="$t('table.sendNum')"
            />
          </a-form-item>
        </a-col>
        <a-col :md="11" :xs="24" v-if="!dataSource[currentIndex]?.wagon_num">
          <a-form-item>
            <a-input
              v-model:value="formState.wagon_num"
              :placeholder="$t('table.wagonNum')"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
  <a-modal
    v-model:visible="editLocationModal.visible"
    :title="$t('modal.changingData')"
    @ok="handleOkLocation"
  >
    <a-form>
      <a-form-item>
        <a-input
          style="width: 100%"
          v-model:value="editLocationModal.location"
          :placeholder="$t('placeholder.addLocations')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    v-model:visible="ViewPhotomodalVisible.visible"
    :title="$t('modal.changingData')"
    :cancelText="' '"
    @ok="() => (ViewPhotomodalVisible.visible = false)"
  >
    <a-image-preview-group>
      <a-image
        v-for="photo in ViewPhotomodalVisible.photos"
        :key="photo.id"
        :width="200"
        :src="config.API_HOST + 'forward_images/' + photo.name"
      />
    </a-image-preview-group>
  </a-modal>
  <a-modal
    v-model:visible="locatinsModal.visible"
    :title="$t('modal.changingData')"
    :cancelText="' '"
    @ok="() => (locatinsModal.visible = false)"
  >
    <template v-if="locatinsModal.locations.length === 0">
      <a-empty style="width: 100%" />
    </template>
    <template v-else>
      <div v-for="location in locatinsModal.locations" :key="location.id">
        <div
          style="
            display: flex;
            justify-content: space-between;
            width: 100%;
            background-color: lightgray;
            padding: 10px;
            margin-bottom: 10px;
          "
        >
          <p>{{ location.name }}</p>
          <p>
            {{ new Date(location.createdAt).toLocaleString().replace(",", "") }}
          </p>
        </div>
      </div>
    </template>
  </a-modal>
</template>
<script>
import { usePagination } from "vue-request";
import {
  computed,
  defineComponent,
  ref,
  reactive,
  toRefs,
  onBeforeMount,
} from "vue";
import {
  QuestionCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import config from "../../../config";
import store from "@/store/index";
import { message, Upload } from "ant-design-vue";
import columns from "@/utils/logistics/logisticForwarderCols";
import getPayById from "@/utils/getPayById";
import i18n from "@/i18n/i18n";
import getCityById from "@/utils/getCityById";
import getDepartmentNameById from "@/utils/getDepartmentNameById";
import defineReadyButton from "../../utils/purchases/defineReadyButton";
import defineCancelButton from "../../utils/purchases/defineCancelButton";
import getCategoryById from "@/utils/purchases/getCategoryById";
import getArticleById from "@/utils/purchases/getArticleById";
import TransportStatus from "./TransportStatus.vue";

const { t } = i18n.global;

const queryData = (params) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  return axios.get(config.API_URL + "api/logistic/transports", {
    params,
    headers,
  });
};
export default defineComponent({
  components: {
    SearchOutlined,
    FilterOutlined,
    EditOutlined,
    TransportStatus,
  },

  setup() {
    const forward_images = ref([]);
    const allowed_files = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
    const modalVisible = ref(false);
    const AddPhotomodalVisible = ref(false);
    const ViewPhotomodalVisible = reactive({
      id: undefined,
      visible: undefined,
      photos: [],
    });

    const beforeUploadProvider = (file) => {
      const isAllowed = allowed_files.includes(file.type);
      if (isAllowed) {
        forward_images.value = [...forward_images.value, file];
        console.log(forward_images.value);
        return false;
      } else {
        message.error(`${t("modal.errorFile")} ${file.name}!`);
        return Upload.LIST_IGNORE;
      }
    };

    const handleRemoveProvider = (file) => {
      const index = forward_images.value.indexOf(file);
      const newFileList = forward_images.value.slice();
      newFileList.splice(index, 1);
      forward_images.value = newFileList;
    };

    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });

    const currentId = ref(0);
    const currentIndex = ref(-1);
    const formState = reactive({
      id: undefined,
      promotion_date: undefined,
      regist_date: undefined,
      expenses_paid: undefined,
      status_arrived: undefined,
      emp_recycling: undefined,
      name: undefined,
      seals: undefined,
      wagon_expenses: undefined,
      tek_pay: undefined,
      control_pay: undefined,
      zholashar_pay: undefined,
      almaty_iron_pay: undefined,
      total_pay: undefined,
    });

    const {
      data: dataSource,
      run,
      loading,
      current,
      pageSize,
      refresh,
    } = usePagination(queryData, {
      formatResult: (res) => res.data.transports,
      pagination: {
        currentKey: "page",
        pageSizeKey: "limit",
        totalKey: "data",
      },
    });
    const pagination = computed(() => ({
      total: store.state.totalTransports,
      current: current.value,
      pageSize: pageSize.value,
    }));
    const handleTableChange = (pag, filters, sorter) => {
      run({
        limit: pag.pageSize,
        page: pag?.current,
        sortBy: sorter.field,
        sortType: sorter.order === "ascend" ? "ASC" : "DESC",
        ...filters,
      });
    };
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      state.searchText = selectedKeys[0];
      state.searchedColumn = dataIndex;
    };
    const handleReset = (clearFilters) => {
      clearFilters({
        confirm: true,
      });
      state.searchText = "";
    };

    const editRow = (index, id) => {
      modalVisible.value = true;
      currentId.value = id;
      currentIndex.value = index;
      formState.id = id;
    };
    const editRowPhoto = (index, id) => {
      AddPhotomodalVisible.value = true;
      formState.id = id;
    };
    const ViewRowPhoto = (id, photos) => {
      ViewPhotomodalVisible.visible = true;
      (ViewPhotomodalVisible.id = id), (ViewPhotomodalVisible.photos = photos);
    };
    const modalOk = async () => {
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .put(config.API_URL + "api/logistic/on_coord", formState)
        .then(() => {
          store.commit("setIsLoading", false);
          message.success(t("modal.successfullyChanged"));
          refresh();
          formState.id = undefined;
          modalVisible.value = false;
        })
        .catch((err) => {
          store.commit("setIsLoading", false);
          if (
            err.response.data.errors &&
            err.response.data.errors.length !== 0
          ) {
            let errors = "";
            err.response.data.errors.map((error) => [
              (errors += error.msg + " "),
            ]);
            message.error(errors);
          } else {
            message.error(err.response.data.message);
          }
          formState.id = undefined;
          modalVisible.value = false;
        });
    };
    const AddPhotoOkModal = async () => {
      {
        const bodyFormData = new FormData();
        bodyFormData.append("id", formState.id);
        for (const file of forward_images.value) {
          bodyFormData.append("forward_images", file);
        }
        store.commit("setIsLoading", true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        await axios
          .put(config.API_URL + "api/logistic/on_coord", bodyFormData)
          .then(() => {
            store.commit("setIsLoading", false);
            message.success(t("modal.successfullyChanged"));
            refresh();
            formState.id = undefined;
            AddPhotomodalVisible.value = false;
          })
          .catch((err) => {
            store.commit("setIsLoading", false);
            if (
              err.response.data.errors &&
              err.response.data.errors.length !== 0
            ) {
              let errors = "";
              err.response.data.errors.map((error) => [
                (errors += error.msg + " "),
              ]);
              message.error(errors);
            } else {
              message.error(err.response.data.message);
            }
            formState.id = undefined;
            AddPhotomodalVisible.value = false;
          });
        AddPhotomodalVisible.value = false;
      }
    };

    const editLocationModal = reactive({
      visible: false,
      id: undefined,
      location: undefined,
    });

    const locatinsModal = reactive({
      visible: false,
      locations: [],
    });

    const showEditLocation = (id) => {
      editLocationModal.id = id;
      editLocationModal.visible = true;
    };

    const showLocationsModal = (locations) => {
      locatinsModal.locations = locations;
      locatinsModal.visible = true;
    };

    const handleOkLocation = async () => {
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .post(config.API_URL + "api/logistic/change_location", {
          id: editLocationModal.id,
          name: editLocationModal.location,
        })
        .then(() => {
          store.commit("setIsLoading", false);
          message.success(t("modal.successfullyChanged"));
          refresh();
          editLocationModal.id = undefined;
          editLocationModal.location = undefined;
          editLocationModal.visible = false;
        })
        .catch((err) => {
          store.commit("setIsLoading", false);
          if (
            err.response.data.errors &&
            err.response.data.errors.length !== 0
          ) {
            let errors = "";
            err.response.data.errors.map((error) => [
              (errors += error.msg + " "),
            ]);
            message.error(errors);
          } else {
            message.error(err.response.data.message);
          }
          editLocationModal.id = undefined;
          editLocationModal.location = undefined;
          editLocationModal.visible = false;
        });
    };

    onBeforeMount(async () => {
      store.commit("setIsLoading", true);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${window.localStorage.getItem("jwt")}`;
      await axios
        .get(config.API_URL + "api/logistic/transports/count")
        .then((res) => {
          if (res.data.count) {
            store.commit("setTotalTransports", res.data.count);
          }
          store.commit("setIsLoading", false);
        })
        .catch((err) => {
          {
            console.log(err);
            store.commit("setIsLoading", false);
          }
        });
    });

    return {
      dataSource,
      pagination,
      loading,
      columns,
      handleTableChange,
      refresh,
      config,
      QuestionCircleOutlined,
      getPayById,
      getCityById,
      getDepartmentNameById,
      defineCancelButton,
      defineReadyButton,
      getCategoryById,
      getArticleById,
      handleSearch,
      handleReset,
      handleRemoveProvider,
      beforeUploadProvider,
      ...toRefs(state),
      SearchOutlined,
      FilterOutlined,
      modalVisible,
      AddPhotomodalVisible,
      ViewPhotomodalVisible,
      editRow,
      editRowPhoto,
      ViewRowPhoto,
      currentId,
      modalOk,
      AddPhotoOkModal,
      editLocationModal,
      locatinsModal,
      handleOkLocation,
      showEditLocation,
      showLocationsModal,
      formState,
      currentIndex,
    };
  },
  computed: {
    orderCount() {
      return store.state.totalTransports;
    },
  },
  watch: {
    orderCount() {
      this.refresh();
    },
  },
});
</script>
