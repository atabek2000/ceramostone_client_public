import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default [
  {
    title: t("table.wagonCn"),
    dataIndex: "wagon_num_cn",
    customFilterDropdown: true,
  },
  {
    title: t("table.wagonKz"),
    dataIndex: "wagon_num_kz",
    customFilterDropdown: true,
  },
  {
    title: t("table.departStation"),
    dataIndex: "depart_station",
  },
  {
    title: t("table.destStation"),
    dataIndex: "dest_station",
    filters: [
      {
        text: "Almaty",
        value: 1,
      },
      {
        text: "Astana",
        value: 2,
      },
    ],
  },
  {
    title: t("table.promotionDate"),
    dataIndex: "promotion_date",
  },
  {
    title: t("table.registDate1"),
    dataIndex: "regist_date",
  },
  {
    title: t("table.stArr"),
    dataIndex: "status_arrived",
  },
  {
    title: t("table.declNum"),
    dataIndex: "declorate_date",
  },
  {
    title: t("table.custClear"),
    dataIndex: "customs_clearens",
  },
  {
    title: t("table.wagonFeed"),
    dataIndex: "wagon_feed",
  },
  {
    title: t("table.unloadEnd"),
    dataIndex: "unload_end",
  },
  {
    title: t("table.logTerm"),
    dataIndex: "logistic_term",
  },
  {
    title: t("table.sendDate"),
    dataIndex: "send_date",
  },
  {
    title: t("table.reAdd"),
    dataIndex: "dest_readdress",
  },
  {
    title: t("table.overload"),
    dataIndex: "overload",
  },
  {
    title: t("table.sendNum"),
    dataIndex: "send_num",
  },
  {
    title: t("table.wagonNum"),
    dataIndex: "wagon_num",
  },
  {
    title: t("table.empRecycling"),
    dataIndex: "emp_recycling",
  },
  {
    title: t("table.seals"),
    dataIndex: "seals",
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
    title: t("table.zholpay"),
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
    title: t("table.depo"),
    dataIndex: "depozit",
  },
  {
    title: t("table.reFund"),
    dataIndex: "depozit_refund",
  },
  {
    title: t("table.payExp"),
    dataIndex: "expenses_paid",
  },
  {
    title: t("table.status"),
    width: 200,
    dataIndex: "transportStatusId",
    filters: [
      {
        text: t("status.onWayAbroad"),
        value: "1",
      },
      {
        text: t("status.onWayKazakhstan"),
        value: "2",
      },
      {
        text: t("status.onDestinationCity"),
        value: "3",
      },
      {
        text: t("status.onStock"),
        value: "4",
      },
      {
        text: t("modal.ready"),
        value: "5",
      },
    ],
  },
];
