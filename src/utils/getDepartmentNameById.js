import i18n from "@/i18n/i18n";
const { t } = i18n.global;

export default (id, type = "short") => {
  let depName = "P";
  if (type === "short") {
    switch (id) {
      case 1:
        depName = "P";
        break;
      case 2:
        depName = "R";
        break;
      case 3:
        depName = "O";
        break;
      case 4:
        depName = "M";
        break;
      case 5:
        depName = "Z";
        break;
      case 6:
        depName = "K";
        break;
      case 7:
        depName = "A";
        break;
      case 8:
        depName = "D";
        break;
      case 9:
        depName = "F";
        break;
      case 10:
        depName = "B";
        break;
      case 11:
        depName = "L";
        break;
      default:
        depName = "P";
    }
  } else if (type === "by_short") {
    switch (id) {
      case "P":
        depName = t("depName.project");
        break;
      case "R":
        depName = t("depName.retail");
        break;
      case "O":
        depName = t("depName.wholesale");
        break;
      case "M":
        depName = t("depName.international");
        break;
      case "Z":
        depName = t("depName.purchase");
        break;
      case "K":
        depName = t("Отдел камня");
        break;
      case "A":
        depName = t("Административный");
        break;
      case "D":
        depName = t("Отдел по развитию");
        break;
      case "F":
        depName = t("Финансовый отдел");
        break;
      case "B":
        depName = t("Бухгалтерия");
        break;
      case "L":
        depName = t("Логистика");
        break;
      default:
        depName = t("depName.project");
    }
  } else {
    switch (id) {
      case 1:
        depName = t("depName.project");
        break;
      case 2:
        depName = t("depName.retail");
        break;
      case 3:
        depName = t("depName.wholesale");
        break;
      case 4:
        depName = t("depName.international");
        break;
      case 5:
        depName = t("depName.purchase");
        break;
      case 6:
        depName = t("Отдел камня");
        break;
      case 7:
        depName = t("Административный");
        break;
      case 8:
        depName = t("Отдел по развитию");
        break;
      case 9:
        depName = t("Финансовый отдел");
        break;
      case 10:
        depName = t("Бухгалтерия");
        break;
      case 11:
        depName = t("Логистика");
        break;
      default:
        depName = t("depName.project");
    }
  }
  return depName;
};
