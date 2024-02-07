// функция вернет полная названия ед. измеренеий на анг. для анг. и китайского языка, а для других вернет короткая названия на русском

export default () => {
  return {
    label:
      !localStorage.getItem("lang") ||
      ["ru", "kz"].includes(localStorage.getItem("lang"))
        ? "short"
        : "long_eng",
    value: "id",
  };
};
