import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default [
  {
    title: t("placeholder.transportNumber"),
    dataIndex: "wagon_num_kz",
    customFilterDropdown: true,
  },
  {
    title: t("table.applicationNumber"),
    dataIndex: "order_num",
    customFilterDropdown: true,
  },
  {
    title: t("table.location"),
    dataIndex: "location",
  },
  {
    title: t("placeholder.sendDate"),
    dataIndex: "send_date",
  },

  // {
  //   title: t("placeholder.departCountry"),
  //   dataIndex: "countryFrom",
  // },
  {
    title: t("title.products"),
    dataIndex: "product",
    customFilterDropdown: true,
  },
  {
    title: t("placeholder.productVolume"),
    dataIndex: "size",
  },
  {
    title: t("table.city"),
    dataIndex: "cityId",
    // filters: [
    //   {
    //     text: "Almaty",
    //     value: "1",
    //   },
    //   {
    //     text: "Astana",
    //     value: "2",
    //   },
    // ],
  },
  {
    title: t("table.client"),
    dataIndex: "client_name",
    customFilterDropdown: true,
  },
  // {
  //   title: t("table.dateSubmission"),
  //   dataIndex: "order_date",
  //   sorter: true,
  // },

  // {
  //   title: t("table.applicationDate"),
  //   dataIndex: "purchase_date",
  // },
  // {
  //   title: t("table.payment"),
  //   dataIndex: "paid",
  // },

  // {
  //   title: t("table.reAdd"),
  //   dataIndex: "dest_readdress",
  // },
  {
    title: t("content.arrival_type"),
    dataIndex: "arrived",
  },
  {
    title: t("Примечание от закупа"),
    dataIndex: "comment_spec",
  },
  {
    title: t("table.applyingDepartment"),
    dataIndex: "departmentId",
    // filters: [
    //   {
    //     text: t("depName.project"),
    //     value: "1",
    //   },
    //   {
    //     text: t("depName.retail"),
    //     value: "2",
    //   },
    //   {
    //     text: t("depName.wholesale"),
    //     value: "3",
    //   },
    //   {
    //     text: t("depName.international"),
    //     value: "4",
    //   },
    //   {
    //     text: t("depName.purchase"),
    //     value: "5",
    //   },
    // ],
  },
  {
    title: t("table.name"),
    dataIndex: "headId",
    customFilterDropdown: true,
  },
  {
    title: t("table.status"),
    dataIndex: "purchaseStatusId",
    width: 200,
    // filters: [
    //   {
    //     text: t("status.onDirector"),
    //     value: "2",
    //   },
    //   {
    //     text: t("status.cancelledByDirector"),
    //     value: "3",
    //   },
    //   {
    //     text: t("status.onAnalyst"),
    //     value: "4",
    //   },
    //   {
    //     text: t("status.canceledByAnalyst"),
    //     value: "5",
    //   },
    //   {
    //     text: t("status.onPurchasingDirector"),
    //     value: "6",
    //   },
    //   {
    //     text: t("status.cancelledPurchasingDirector"),
    //     value: "7",
    //   },
    //   {
    //     text: t("status.onSpecialist"),
    //     value: "8",
    //   },
    //   {
    //     text: t("status.onLogistician"),
    //     value: "9",
    //   },
    //   {
    //     text: t("status.onForwarder"),
    //     value: "10",
    //   },
    //   {
    //     text: t("status.logCoor"),
    //     value: "11",
    //   },
    //   {
    //     text: t("status.onStockman"),
    //     value: "12",
    //   },
    //   {
    //     text: t("status.onAccountant"),
    //     value: "13",
    //   },
    //   {
    //     text: t("status.ready"),
    //     value: "15",
    //   },
    // ],
  },
];
