import i18n from "@/i18n/i18n";
const { t } = i18n.global;
export default [
  {
    title: t("table.wagonNumber"),
    dataIndex: "wagon_num_kz",
  },
  {
    title: t("table.registDate"),
    dataIndex: "regist_date",
  },

  {
    title: t("table.wagonExpenses"),
    dataIndex: "wagon_expenses",
  },
  {
    title: t("table.tekPay"),
    dataIndex: "tek_pay",
  },
  {
    title: t("table.controlPay"),
    dataIndex: "control_pay",
  },
  {
    title: t("table.zholashar"),
    dataIndex: "zholashar_pay",
  },
  {
    title: t("table.almatyIron"),
    dataIndex: "almaty_iron_pay",
  },
  {
    title: t("table.totalPay"),
    dataIndex: "total_pay",
  },
  {
    title: t("table.customsPay"),
    dataIndex: "customs_pay",
  },
  {
    title: t("table.deposit"),
    dataIndex: "depozit",
  },
  {
    title: t("Примечание"),
    dataIndex: "comment",
  },
  {
    title: t("Примечание от закупа"),
    dataIndex: "comment_spec",
  },
  {
    title: t("table.status"),
    dataIndex: "transportStatusId",
    width: 200,
    filters: [
      {
        text: t("status.onStockman"),
        value: "3",
      },
      {
        text: t("status.ready"),
        value: "4",
      },
    ],
  },
  {
    title: t("table.action"),
    dataIndex: "action",
  },
];
