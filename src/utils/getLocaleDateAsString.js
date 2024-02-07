import getLocaleDate from "./getLocaleDateFromISO";

export default (iso) => {
  const ldt = getLocaleDate(iso);
  return (
    ldt.date[0] +
    "-" +
    ldt.date[1] +
    "-" +
    ldt.date[2] +
    " " +
    ldt.time[0] +
    ":" +
    ldt.time[1] +
    ":" +
    ldt.time[2]
  );
};
