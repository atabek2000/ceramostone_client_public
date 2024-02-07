import i18n from "@/i18n/i18n";
import { ref } from "vue";
const { t } = i18n.global;

export default ref([
  {
    title: t("table.manager"),
    dataIndex: "managerId",
    customFilterDropdown: true,
  },
  {
    title: t("table.applyingDepartment"),
    dataIndex: "depId",
    width: 150,
    filters: [
      {
        text: t("depName.project"),
        value: "P",
      },
      {
        text: t("depName.retail"),
        value: "R",
      },
      {
        text: t("depName.wholesale"),
        value: "O",
      },
      {
        text: t("depName.international"),
        value: "M",
      },
      {
        text: t("depName.purchase"),
        value: "Z",
      },
    ],
  },
  {
    title: t("table.numAct"),
    dataIndex: "num_act",
    customFilterDropdown: true,
  },
  {
    title: t("table.num1c"),
    dataIndex: "num_1c",
    customFilterDropdown: true,
  },
  {
    title: t("table.reciever"),
    dataIndex: "reciever",
    customFilterDropdown: true,
    width: 120,
  },
  {
    title: t("table.summa"),
    dataIndex: "summa",
  },
  {
    title: t("table.createDate"),
    dataIndex: "date",
    sorter: true,
  },
  {
    title: t("table.termDate"),
    dataIndex: "term",
  },
  {
    title: t("table.spec"),
    dataIndex: "word",
  },
  {
    title: t("table.estim"),
    dataIndex: "excel",
  },
  {
    title: t("table.status"),
    dataIndex: "orderStatusId",
    fixed: "right",
    width: 200,
    filters: [
      {
        text: t("status.on_cashier"),
        value: "2",
      },
      {
        text: t("status.cancel_cashier"),
        value: "3",
      },
      {
        text: t("status.on_coord"),
        value: "4",
      },
      {
        text: t("status.cancel_coord"),
        value: "5",
      },
      {
        text: t("status.on_foreman"),
        value: "6",
      },
      {
        text: t("status.cancel_foreman"),
        value: "7",
      },
      {
        text: t("status.ready"),
        value: "8",
      },
      {
        text: t("status.stopped"),
        value: "9",
      },
    ],
  },
  {
    title: t("table.action"),
    dataIndex: "action",
    minWidth: 90,
    fixed: "right",
  },
]);
