import { createStore } from "vuex";

export default createStore({
  state: () => ({
    isAuth: false,
    user: {
      id: 0,
      email: "",
      name: "",
      phone: "",
      roleId: 0,
      departmentId: 0,
      cityId: 0,
    },
    orderNum: "",
    page: "",
    managers: [],
    isLoading: false,
    isConfirmShow: false,
    alertHead: "",
    alertBody: "",
    alertType: "",
    confirmHead: "",
    confirmBody: "",
    confirmType: "",
    masters: [],
    users: [],
    totalUsers: 0,
    totalOrders: 0,
    totalPurchases: 0,
    totalTransports: 0,
    totalMasters: 0,
    noticeCount: 0,
    notices: [],
    departments: [],
    cities: [],
    countries: [],
    purchaseCategories: [],
    purchaseArticles: [],
    purchaseUnits: [],
    purchaseNum: "",
    roles: "",
    directors: [],
    analysts: [],
    orderStatuses: [],
    orderFilters: {},
    cashNum: "",
    companies: [],
    cash_items: [],
    cash_statuses: [],
    department_limits: [],
  }),
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setOrderNum(state, orderNum) {
      state.orderNum = orderNum;
    },
    setIsAuth(state, isAuth) {
      state.isAuth = isAuth;
    },
    setManagers(state, managers) {
      state.managers = managers;
    },
    setMasters(state, masters) {
      state.masters = masters;
    },
    setUsers(state, users) {
      state.users = users;
    },
    setPage(state, page) {
      state.page = page;
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setSetTotalUsers(state, payload) {
      state.totalUsers = payload;
    },
    setSetTotalOrders(state, payload) {
      state.totalOrders = payload;
    },
    setSetTotalPurchases(state, payload) {
      state.totalPurchases = payload;
    },
    setSetTotalMasters(state, payload) {
      state.totalMasters = payload;
    },
    setNoticeCount(state, payload) {
      state.noticeCount = payload;
    },
    setNotices(state, payload) {
      state.notices = payload;
    },
    setDepartments(state, payload) {
      state.departments = payload;
    },
    setCities(state, payload) {
      state.cities = payload;
    },
    setCountries(state, payload) {
      state.countries = payload;
    },
    setPurchaseCategories(state, payload) {
      state.purchaseCategories = payload;
    },
    setPurchaseArticles(state, payload) {
      state.purchaseArticles = payload;
    },
    setPurchaseUnits(state, payload) {
      state.purchaseUnits = payload;
    },
    setRoles(state, payload) {
      state.roles = payload;
    },
    setTotalTransports(state, payload) {
      state.totalTransports = payload;
    },
    setPurchaseNum(state, purchaseNum) {
      state.purchaseNum = purchaseNum;
    },
    setDirectors(state, payload) {
      state.directors = payload;
    },
    setAnalysts(state, payload) {
      state.analysts = payload;
    },
    setOrderStatuses(state, payload) {
      state.orderStatuses = payload;
    },
    setOrderFilters(state, payload) {
      state.orderFilters = payload;
    },
    setCashNum(state, cashNum) {
      state.cashNum = cashNum;
    },
    setCompanies(state, companies) {
      state.companies = companies;
    },
    setCashItems(state, items) {
      state.cash_items = items;
    },
    setCashStatuses(state, items) {
      state.cash_statuses = items;
    },
    setDepartmentLimits(state, items) {
      state.department_limits = items;
    },
  },
  getters: {
    getManagerById: (state) => (id) => {
      return state.managers.find((manager) => manager.id === id)
        ? state.managers.find((manager) => manager.id === id).name
        : "";
    },
    getMasterById: (state) => (id) => {
      return state.masters.find((master) => master.value == id)
        ? state.masters.find((master) => master.value == id).label
        : "";
    },
  },
});
