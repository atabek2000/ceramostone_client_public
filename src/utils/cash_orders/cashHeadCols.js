import store from "@/store";
import { ref } from "vue";

export default ref([
  {
    title: "Создатель",
    dataIndex: "creatorId",
    customFilterDropdown: true,
  },
  {
    title: "Статус",
    dataIndex: "cashOrderStatusId",
    filters: store.state.cash_statuses.map((dep) => {
      return { text: dep.title_ru, value: dep.id };
    }),
  },
  {
    title: "Действие",
    dataIndex: "action",
  },
  {
    title: "Контрагент",
    dataIndex: "contractor",
    customFilterDropdown: true,
  },

  {
    title: "ДДС",
    dataIndex: "cash_item",
    customFilterDropdown: true,
  },
  {
    title: "Компания",
    dataIndex: "company",
    key: "company",
    filters: store.state.companies,
  },
  {
    title: "Отдел",
    dataIndex: "departmentId",
    filters: store.state.departments.map((dep) => {
      return { text: dep.label, value: dep.value };
    }),
  },
  {
    title: "Сумма",
    dataIndex: "sum",
  },
  {
    title: "Файлы",
    dataIndex: "cash_files",
  },
  // {
  //   title: "Описание",
  //   dataIndex: "desc",
  // },
  //   width: 200,
  {
    title: "Номер",
    dataIndex: "num_cash",
    customFilterDropdown: true,
    width: 150,
  },
  {
    title: "Дата",
    dataIndex: "createdAt",
    width: 100,
  },
]);
