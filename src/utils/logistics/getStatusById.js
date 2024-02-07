import i18n from "@/i18n/i18n";
const { t } = i18n.global;

// цвет и текст для статусов заказа
export default ({ transport }) => {
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
    ready: {
      txt: "rgb(0, 191, 57)",
      bg: "rgb(171, 255, 196)",
    },
    on_stock: {
      txt: "rgb(247, 25, 235)",
      bg: "rgb(252, 197, 249)",
    },
    onway_abroad: {
      txt: "rgb(255, 128, 0)",
      bg: "rgb(252, 217, 182)",
    },
    onway_kaz: {
      txt: "rgb(196, 207, 0)",
      bg: "rgb(248, 250, 212)",
    },
    on_city: {
      txt: "rgb(2, 110, 171)",
      bg: "rgb(182, 227, 252)",
    },
  };

  switch (transport.transportStatusId) {
    case 1:
      status.color = color.onway_abroad;
      // status.statusName = t("status.onWayAbroad");
      status.statusName = t("table.onWay");
      break;
    case 2:
      status.color = color.onway_kaz;
      // status.statusName = t("status.onWayKazakhstan");
      status.statusName = t("table.onWay");
      break;
    case 3:
      status.color = color.on_city;
      status.statusName = t("status.onDestinationCity");
      break;
    case 4:
      status.color = color.on_stock;
      status.statusName = t("status.onStock");
      break;
    case 5:
      status.color = color.ready;
      status.statusName = t("status.ready");
      break;
  }

  return status;
};
