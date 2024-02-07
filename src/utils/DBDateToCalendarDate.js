export default (db_date) => {
  if (db_date) {
    const date_time = new Date(db_date)
      .toLocaleString()
      .replaceAll(",", "")
      .split(" ");
    console.log(date_time);
    const date = date_time[0];
    const date_arr = date.split(".");
    return (
      date_arr[2] + "-" + date_arr[1] + "-" + date_arr[0] + " " + date_time[1]
    );
  } else {
    return "";
  }
};
