import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default [
  {
    title: t("table.wagonKz"),
    dataIndex: "wagon_num_kz",
    customFilterDropdown: true,
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
    title: t("table.status"),
    dataIndex: "transportStatusId",
    width: 200,
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
    title: t("table.action"),
    dataIndex: "action",
  },
];
