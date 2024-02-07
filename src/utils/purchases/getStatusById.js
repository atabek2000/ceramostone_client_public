import i18n from "@/i18n/i18n";
const { t } = i18n.global;

// цвет и текст для статусов заказа
export default ({ roleId, purchase }) => {
  // возврашаемый объект
  const status = {
    statusName: "",
    color: {
      txt: "",
      bg: "",
    },
    visibleResaon: false,
    txtReason: "",
    titleReason: t("modal.reasonForCancel"),
  };
  // цвет текста и фона
  const color = {
    cancel: {
      txt: "rgba(106, 4, 15, 1)",
      bg: "rgba(255, 143, 163, 1)",
    },
    ready: {
      txt: "rgba(0, 114, 0, 1)",
      bg: "rgba(136, 212, 171, 1)",
    },
    on_directors: {
      txt: "rgba(2, 62, 138, 1)",
      bg: "rgba(173, 232, 244, 1)",
    },
    on_way: {
      txt: "rgba(252, 165, 3, 1)",
      bg: "rgba(245, 247, 193, 1)",
    },
    on_kaz: {
      txt: "rgba(247, 25, 235, 1)",
      bg: "rgba(252, 197, 249, 1)",
    },
  };

  let analystLetter = "к"; // Ilyas
  if (purchase.analystId == 25) {
    analystLetter = "с"; // Adilet
  } else if (purchase.analystId == 26) {
    analystLetter = "н"; // Aidam
  }

  switch (purchase.purchaseStatusId) {
    case 1:
      status.color = color.cancel;
      status.statusName = t("status.deletedByHead");
      status.titleReason = t("status.reasonRemoval");
      break;
    case 2:
      status.color = color.on_directors;
      status.statusName = t("status.onDirector");
      break;
    case 3:
      status.color = color.cancel;
      status.statusName = t("status.cancelledByDirector");
      break;
    case 4:
      status.color = color.on_directors;
      status.statusName = t("status.onAnalyst") + ` (${analystLetter})`;
      break;
    case 5:
      status.color = color.cancel;
      status.statusName = t("status.canceledByAnalyst");
      break;
    case 6:
      status.color = color.on_directors;
      status.statusName = t("status.onPurchasingDirector");
      break;
    case 7:
      status.color = color.cancel;
      status.statusName = t("status.cancelledPurchasingDirector");
      break;
    case 8:
      status.color = color.on_directors;
      status.statusName = t("status.onSpecialist");
      break;
    case 9:
      status.color = color.on_way;
      status.statusName = t("status.onLogistician");
      break;
    case 10:
      status.color = color.on_way;
      status.statusName = t("status.onForwarder");
      break;
    case 11:
      status.color = color.on_way;
      status.statusName = t("status.onCoordinator");
      break;
    case 12:
      status.color = color.on_kaz;
      status.statusName = t("status.arrived");
      break;
    case 13:
      status.color = color.on_kaz;
      status.statusName = t("status.onAccountant");
      break;
    case 14:
      status.color = color.ready;
      status.statusName = t("status.ready");
      break;
  }

  // если зкаказ отменен
  if (status.color.bg === color.cancel.bg && roleId) {
    status.visibleResaon = true;
    status.txtReason = purchase.cancel_reason;
  }
  return status;
};
