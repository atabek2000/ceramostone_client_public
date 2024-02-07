export default (roleId, orderStatusId, user, manager) => {
  // у менеджера
  if (roleId == 2 && orderStatusId == 2 && user == manager) return true;
  //   у директора
  else if (roleId == 7 && orderStatusId == 2) return true;
};
