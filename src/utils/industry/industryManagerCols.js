import i18n from "@/i18n/i18n";
import store from "@/store";
const { t } = i18n.global;

export default [
  {
    title: t("table.manager"),
    dataIndex: "managerId",
    key: "managerId",
    customFilterDropdown: true,
  },
  {
    title: t("table.numAct"),
    dataIndex: "num_act",
    key: "num_act",
    customFilterDropdown: true,
  },
  {
    title: t("table.num1c"),
    dataIndex: "num_1c",
    key: "num_1c",
    customFilterDropdown: true,
  },
  {
    title: t("table.reciever"),
    dataIndex: "reciever",
    key: "reciever",
    customFilterDropdown: true,
    width: 120,
  },
  {
    title: t("table.summa"),
    dataIndex: "summa",
    key: "summa",
  },
  {
    title: t("table.createDate"),
    dataIndex: "date",
    key: "date",
    sorter: true,
  },
  {
    title: t("table.termDate"),
    dataIndex: "term",
    key: "term",
  },
  {
    title: t("table.termChief"),
    dataIndex: "foreman_date",
    key: "foreman_date",
  },

  {
    title: t("table.spec"),
    dataIndex: "industry_spec",
    key: "industry_spec",
  },
  {
    title: t("table.contract"),
    dataIndex: "industry_contract",
    key: "industry_contract",
  },
  {
    title: t("table.payment"),
    dataIndex: "industry_pay",
    key: "industry_pay",
  },
  {
    title: t("table.status"),
    dataIndex: "orderStatusId",
    key: "orderStatusId",
    width: 200,
    align: "center",
    fixed: "right",
    filters: store.state.orderStatuses,
  },
  {
    title: t("table.action"),
    dataIndex: "action",
    key: "action",
    minWidth: 90,
    fixed: "right",
    align: "center",
  },
];
