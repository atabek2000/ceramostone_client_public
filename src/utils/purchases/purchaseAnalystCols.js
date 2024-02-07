import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default [
  {
    title: t("table.applicationNumber"),
    dataIndex: "order_num",
    customFilterDropdown: true,
  },
  {
    title: t("table.applyingDepartment"),
    dataIndex: "departmentId",
    filters: [
      {
        text: t("depName.project"),
        value: "1",
      },
      {
        text: t("depName.retail"),
        value: "2",
      },
      {
        text: t("depName.wholesale"),
        value: "3",
      },
      {
        text: t("depName.international"),
        value: "4",
      },
      {
        text: t("depName.purchase"),
        value: "5",
      },
    ],
  },
  {
    title: t("table.name"),
    dataIndex: "headId",
    customFilterDropdown: true,
  },
  {
    title: t("placeholder.departCountry"),
    dataIndex: "countryFrom",
  },
  {
    title: t("table.client"),
    dataIndex: "client_name",
    customFilterDropdown: true,
  },
  {
    title: t("table.applicationDate"),
    dataIndex: "order_date",
    sorter: true,
  },
  {
    title: t("table.applicationDeadline"),
    dataIndex: "term_date",
  },
  {
    title: t("table.paidFor"),
    dataIndex: "paid",
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
    dataIndex: "purchaseStatusId",
    width: 200,
    filters: [
      {
        text: t("status.onAnalyst"),
        value: "4",
      },
      {
        text: t("status.canceledByAnalyst"),
        value: "5",
      },
      {
        text: t("status.onPurchasingDirector"),
        value: "6",
      },
    ],
  },
  {
    title: t("table.action"),
    dataIndex: "action",
  },
];
