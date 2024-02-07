export default (id) => {
  const pages = {
    1: [
      "Orders",
      "Purchases",
      "PurchasesMonitor",
      "Logistics",
      "LogisticsMonitor",
      "CreateUser",
      "CreateMaster",
      "CabinetPage",
      "NotFound",
    ],
    2: [
      "Orders",
      "PurchasesMonitor",
      "LogisticsMonitor",
      "CabinetPage",
      "NotFound",
    ],
    3: ["Orders", "CabinetPage", "NotFound"],
    4: ["Orders", "CreateMaster", "CabinetPage", "NotFound"],
    5: ["Orders", "CabinetPage", "NotFound"],
    6: [
      "Purchases",
      "PurchasesMonitor",
      "LogisticsMonitor",
      "CabinetPage",
      "NotFound",
    ],
    7: ["PurchasesMonitor", "LogisticsMonitor", "CabinetPage", "NotFound"],
    8: ["Purchases", "PurchasesMonitor", "CabinetPage", "NotFound"],
    9: ["PurchasesMonitor", "LogisticsMonitor", "CabinetPage", "NotFound"],
    10: [
      "Purchases",
      "PurchasesMonitor",
      "LogisticsMonitor",
      "CabinetPage",
      "NotFound",
    ],
    11: [
      "Purchases",
      "PurchasesMonitor",
      "Logistics",
      "LogisticsMonitor",
      "CabinetPage",
      "NotFound",
    ],
    12: [
      "Purchases",
      "PurchasesMonitor",
      "Logistics",
      "LogisticsMonitor",
      "CabinetPage",
      "NotFound",
    ],
    13: ["Logistics", "LogisticsMonitor", "CabinetPage", "NotFound"],
    14: ["Logistics", "LogisticsMonitor", "CabinetPage", "NotFound"],
    15: ["Logistics", "LogisticsMonitor", "CabinetPage", "NotFound"],
    16: ["Logistics", "LogisticsMonitor", "CabinetPage", "NotFound"],
    17: ["Logistics", "LogisticsMonitor", "CabinetPage", "NotFound"],
  };

  if (pages[id]) return pages[id];
  else return [];
};
