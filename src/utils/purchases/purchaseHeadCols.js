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
    title: t("content.arrival_type"),
    dataIndex: "arrived",
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
        text: t("status.onDirector"),
        value: "2",
      },
      {
        text: t("status.cancelledByDirector"),
        value: "3",
      },
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
      {
        text: t("status.cancelledPurchasingDirector"),
        value: "7",
      },
      {
        text: t("status.onSpecialist"),
        value: "8",
      },
      {
        text: t("status.onLogistician"),
        value: "9",
      },
      {
        text: t("status.onForwarder"),
        value: "10",
      },
      {
        text: t("status.onCoordinator"),
        value: "11",
      },
      {
        text: t("status.arrived"),
        value: "12",
      },
      {
        text: t("status.onAccountant"),
        value: "13",
      },
      {
        text: t("status.ready"),
        value: "14",
      },
    ],
  },
  {
    title: t("table.action"),
    dataIndex: "action",
  },
];
