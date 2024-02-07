export default (iso) => {
  try {
    const dateTime = new Date(iso);
    const day = dateTime.getDate();
    const month = dateTime.getMonth()+1;
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const seconds = dateTime.getSeconds();
    const date_arr = [
      day < 10 ? "0" + day : day,
      month < 10 ? "0" + month : month,
      year,
    ];
    const time_arr = [
      hours < 10 ? "0" + hours : hours,
      minutes < 10 ? "0" + minutes : minutes,
      seconds < 10 ? "0" + seconds : seconds,
    ];
    return { date: date_arr, time: time_arr };
  } catch (e) {
    console.log(e);
    return { date: [], time: [] };
  }
};
