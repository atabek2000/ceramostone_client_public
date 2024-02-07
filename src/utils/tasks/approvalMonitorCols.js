import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default [
  {
    title: t("table.taskNum"),
    dataIndex: "num",
    customFilterDropdown: true,
  },
  {
    title: t("table.taskTheme"),
    dataIndex: "theme",
    customFilterDropdown: true,
  },
  {
    title: t("table.performs"),
    dataIndex: "performs",
  },
  {
    title: t("table.deadline"),
    dataIndex: "deadline",
    sorter: true,
  },
  {
    title: t("table.status"),
    dataIndex: "status",
    // defaultFilteredValue: ["checking"],
    filters: [
      {
        text: t("status.onProcess"),
        value: "process",
      },
      {
        text: t("status.postponed"),
        value: "postponed",
      },
      {
        text: t("status.onChecking"),
        value: "checking",
      },
      {
        text: t("status.revision"),
        value: "revision",
      },
      {
        text: t("status.ready"),
        value: "ready",
      },
    ],
  },
  {
    title: t("table.action"),
    dataIndex: "action",
  },
];
