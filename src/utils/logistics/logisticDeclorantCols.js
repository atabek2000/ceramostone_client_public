import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default [
  {
    title: t("table.wagonKz"),
    dataIndex: "wagon_num_kz",
    customFilterDropdown: true,
  },
  {
    title: t("table.declNum"),
    dataIndex: "declorate_num",
  },
  {
    title: t("table.custClear"),
    dataIndex: "customs_clearens",
  },
  // {
  //   title: t("table.deposit"),
  //   dataIndex: "customs_pay",
  // },
  {
    title: t("table.depo"),
    dataIndex: "depozit",
  },
  {
    title: t("table.status"),
    width: 200,
    dataIndex: "transportStatusId",
  },
  {
    title: t("table.action"),
    dataIndex: "action",
  },
];
