export default (roleId, orderStatusId) => {
  // у директора
  if (roleId == 7 && orderStatusId == 2) return true;
  //   у начальника
  else if (roleId == 5 && orderStatusId == 4) return true;
  //   у завсклада
  else if (roleId == 11 && orderStatusId == 7) return true;
  else return false;
};
