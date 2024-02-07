import i18n from "@/i18n/i18n";
const { t } = i18n.global;

// цвет и текст для статусов заказа
export default ({ roleId, order }) => {
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
    stop: {
      txt: "black",
      bg: "#ffd7b5",
    },
    on_coord: {
      txt: "black",
      bg: "#abff65",
    },
    on_cashier: {
      txt: "black",
      bg: "#93d1ff",
    },
  };

  // сатаусы для админа
  if (roleId === 1 || roleId === 7 || roleId === 9 || roleId === 6) {
    switch (order.orderStatusId) {
      case 1:
        status.color = color.cancel;
        status.statusName = t("status.delete_manager");
        status.titleReason = t("modal.reasonForDelete");
        break;
      case 2:
        status.color = color.on_cashier;
        status.statusName = t("status.on_cashier");
        break;
      case 3:
        status.color = color.cancel;
        status.statusName = t("status.cancel_cashier");
        break;
      case 4:
        status.color = color.on_coord;
        status.statusName = t("status.on_coord");
        break;
      case 5:
        status.color = color.cancel;
        status.statusName = t("status.cancel_coord");
        break;
      case 6:
        status.color = color.process;
        status.statusName = t("status.on_foreman");
        break;
      case 7:
        status.color = color.cancel;
        status.statusName = t("status.cancel_foreman");
        break;
      case 8:
        status.color = color.ready;
        status.statusName = t("status.ready");
        break;
      case 9:
        status.color = color.stop;
        status.statusName = t("status.stopped");
        break;
    }
  }
  // сатаусы для менеджера
  else if (roleId === 2) {
    switch (order.orderStatusId) {
      case 1:
        status.color = color.cancel;
        status.titleReason = t("modal.reasonForDelete");
        status.statusName = t("status.deleted");
        break;
      case 2:
        status.color = color.on_cashier;
        status.statusName = t("status.on_cashier");
        break;
      case 3:
        status.color = color.cancel;
        status.statusName = t("status.cancel_cashier");
        break;
      case 4:
        status.color = color.on_coord;
        status.statusName = t("status.on_coord");
        break;
      case 5:
        status.color = color.cancel;
        status.statusName = t("status.cancel_coord");
        break;
      case 6:
        status.color = color.process;
        status.statusName = t("status.on_foreman");
        break;
      case 7:
        status.color = color.cancel;
        status.statusName = t("status.cancel_foreman");
        break;
      case 8:
        status.color = color.ready;
        status.statusName = t("status.ready");
        break;
      case 9:
        status.color = color.stop;
        status.statusName = t("status.stopped");
        break;
    }
  }
  // статусы для кассира
  else if (roleId === 3) {
    switch (order.orderStatusId) {
      case 1:
        status.color = color.cancel;
        status.titleReason = t("modal.reasonForDelete");
        status.statusName = t("status.cancel_manager");
        break;
      case 2:
        status.color = color.on_cashier;
        status.statusName = t("status.on_cashier");
        break;
      case 3:
        status.color = color.cancel;
        status.statusName = t("status.cancel_cashier");
        break;
      case 4:
        status.color = color.on_coord;
        status.statusName = t("status.on_coord");
        break;
      case 5:
        status.color = color.cancel;
        status.statusName = t("status.cancel_coord");
        break;
      case 6:
        status.color = color.process;
        status.statusName = t("status.on_foreman");
        break;
      case 7:
        status.color = color.cancel;
        status.statusName = t("status.cancel_foreman");
        break;
      case 8:
        status.color = color.ready;
        status.statusName = t("status.ready");
        break;
      case 9:
        status.color = color.stop;
        status.statusName = t("status.stopped");
        break;
    }
  }
  // статусы для координатора
  else if (roleId === 4) {
    switch (order.orderStatusId) {
      case 1:
        status.color = color.cancel;
        status.titleReason = t("modal.reasonForDelete");
        status.statusName = t("status.cancel_manager");
        break;
      case 2:
        status.color = color.process;
        status.statusName = t("status.on_cashier");
        break;
      case 3:
        status.color = color.cancel;
        status.statusName = t("status.cancel_cashier");
        break;
      case 4:
        status.color = color.process;
        status.statusName = t("status.onChecking");
        break;
      case 5:
        status.color = color.cancel;
        status.statusName = t("status.cancelled");
        break;
      case 6:
        status.color = color.process;
        status.statusName = t("status.on_foreman");
        break;
      case 7:
        status.color = color.cancel;
        status.statusName = t("status.cancel_foreman");
        break;
      case 8:
        status.color = color.ready;
        status.statusName = t("status.ready");
        break;
      case 9:
        status.color = color.stop;
        status.statusName = t("status.stopped");
        break;
    }
  }
  // статусы для начальника
  else if (roleId === 5) {
    switch (order.orderStatusId) {
      case 1:
        status.color = color.cancel;
        status.titleReason = t("modal.reasonForDelete");
        status.statusName = t("status.delete_manager");
        break;
      case 2:
        status.color = color.process;
        status.statusName = t("status.on_cashier");
        break;
      case 3:
        status.color = color.cancel;
        status.statusName = t("status.cancel_cashier");
        break;
      case 4:
        status.color = color.process;
        status.statusName = t("status.on_coord");
        break;
      case 5:
        status.color = color.cancel;
        status.statusName = t("status.cancel_coord");
        break;
      case 6:
        status.color = color.process;
        status.statusName = t("status.on_foreman");
        break;
      case 7:
        status.color = color.cancel;
        status.statusName = t("status.cancel_foreman");
        break;
      case 8:
        status.color = color.ready;
        status.statusName = t("status.ready");
        break;
      case 9:
        status.color = color.stop;
        status.statusName = t("status.stopped");
        break;
    }
  }
  // если зкаказ отменен
  if (status.color == color.cancel) {
    status.visibleResaon = true;
    status.txtReason = order.cancel_reason;
  }
  // если зкаказ остановлен
  else if (status.color.bg === "orange") {
    status.visibleResaon = true;
    status.txtReason = order.stop_reason;
    status.color = color.stop;
    status.titleReason = t("modal.reasonForStop");
  }
  return status;
};
