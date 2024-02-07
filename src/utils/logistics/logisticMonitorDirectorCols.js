import i18n from "@/i18n/i18n";
import { ref } from "vue";
const { t } = i18n.global;

const columns = ref([
  {
    title: t("Тип транспорта"),
    dataIndex: "transport_type",
  },
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
    title: t("placeholder.departCountry"),
    dataIndex: "depart_country",
    filters: [
      {
        text: "Китай",
        value: 2,
      },
      {
        text: "Узбекистан",
        value: 3,
      },
      {
        text: "Россия",
        value: 7,
      },
      {
        text: "Кыргызстан",
        value: 8,
      },
      {
        text: "Греция",
        value: 4,
      },
      {
        text: "Индия",
        value: 5,
      },
      {
        text: "Турция",
        value: 6,
      },
    ],
  },
  {
    title: t("table.departStation"),
    dataIndex: "depart_station",
  },
  {
    title: t("table.dest_station"),
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
  // {
  //   title: t("table.reAdd"),
  //   dataIndex: "dest_readdress",
  // },
  // {
  //   title: t("table.promotionDate"),
  //   dataIndex: "promotion_date",
  // },
  {
    title: t("table.stArr"),
    dataIndex: "status_arrived",
  },
  // {
  //   title: t("table.declorateNum"),
  //   dataIndex: "declorate_num",
  // },
  // {
  //   title: t("table.customsClear"),
  //   dataIndex: "customs_clearens",
  // },
  // {
  //   title: t("table.wagonFeed"),
  //   dataIndex: "wagon_feed",
  // },
  // {
  //   title: t("table.unloadEnd"),
  //   dataIndex: "unload_end",
  // },
  // {
  //   title: t("table.registDate1"),
  //   dataIndex: "regist_date",
  // },
  // {
  //   title: t("table.account_num"),
  //   dataIndex: "account_num",
  // },
  // {
  //   title: t("table.wagonExpenses"),
  //   dataIndex: "wagon_expenses",
  // },
  // {
  //   title: t("table.tekPay"),
  //   dataIndex: "tek_pay",
  // },
  // {
  //   title: t("table.controlPay"),
  //   dataIndex: "control_pay",
  // },
  // {
  //   title: t("table.zholashar"),
  //   dataIndex: "zholashar_pay",
  // },
  // {
  //   title: t("table.almatyIron"),
  //   dataIndex: "almaty_iron_pay",
  // },
  // {
  //   title: t("table.totalPay"),
  //   dataIndex: "total_pay",
  // },
  {
    title: t("table.status"),
    dataIndex: "transportStatusId",
    width: 200,
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
        text: t("status.ready"),
        value: "5",
      },
    ],
  },
]);

export default columns;
