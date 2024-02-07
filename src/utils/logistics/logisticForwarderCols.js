import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default [
  {
    title: t("table.wagonCn"),
    dataIndex: "wagon_num_cn",
    customFilterDropdown: true,
  },
  {
    title: t("table.overload"),
    dataIndex: "overload",
  },
  {
    title: t("table.wagonKz"),
    dataIndex: "wagon_num_kz",
    customFilterDropdown: true,
  },
  {
    title: t("table.sendNum"),
    dataIndex: "send_num",
    sorter: true,
  },
  {
    title: t("table.wagonNum"),
    dataIndex: "wagon_num",
  },
  {
    title: t("table.transLoc"),
    dataIndex: "transport_locations",
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
