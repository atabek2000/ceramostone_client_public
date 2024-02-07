import i18n from "@/i18n/i18n";
const { t } = i18n.global;

// цвет и текст для статусов заказа
export default ({ order }) => {
  // возврашаемый объект
  const status = {
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
      txt: "black",
      bg: "#ffb2b2",
    },
    ready: {
      txt: "black",
      bg: "#52bf90",
    },
    process: {
      txt: "black",
      bg: "#fff9ba",
    },
  };

  // сатаусы для админа
  switch (order.cash_order_status.id) {
    case 1:
      status.color = color.cancel;
      status.titleReason = t("modal.reasonForDelete");
      break;
    case 2:
      status.color = color.process;
      break;
    case 3:
      status.color = color.cancel;
      break;
    case 4:
      status.color = color.process;
      break;
    case 5:
      status.color = color.cancel;
      break;
    case 6:
      status.color = color.process;
      break;
    case 7:
      status.color = color.cancel;
      break;
    case 8:
      status.color = color.process;
      break;
    case 9:
      status.color = color.ready;
      break;
  }

  // если зкаказ отменен
  if (status.color == color.cancel) {
    status.visibleResaon = true;
    status.txtReason = order.cancel_reason;
  }
  return status;
};
