import store from "@/store";

export default [
  {
    title: "Компания",
    dataIndex: "company",
    key: "company",
    filters: store.state.companies,
  },
  {
    title: "Отдел",
    dataIndex: "department",
    filters: store.state.departments.map((dep) => {
      return { text: dep.label, value: dep.value };
    }),
  },
  {
    title: "Год",
    dataIndex: "year",
    customFilterDropdown: true,
  },
  {
    title: "Бюджет в год",
    dataIndex: "limit",
  },
  {
    title: "Потратили",
    dataIndex: "limit_spent",
  },
  {
    title: "Неосвоенный",
    dataIndex: "limit_un_spent",
  },
];
