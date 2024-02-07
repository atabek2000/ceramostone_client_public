import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default (status) => {
  let statusName = t("status.onProcess");
  switch (status) {
    case "postponed":
      statusName = t("status.postponed");
      break;
    case "checking":
      statusName = t("status.onChecking");
      break;
    case "revision":
      statusName = t("status.revision");
      break;
    case "ready":
      statusName = t("status.ready");
      break;
  }

  return statusName;
};
