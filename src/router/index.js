import { createWebHistory, createRouter } from "vue-router";
import LoginForm from "../pages/loginPage.vue";
import OrdersPage from "../pages/OrdersPage.vue";
import PurchasesPage from "../pages/PurchasesPage.vue";
import TaskPage from "../pages/TaskPage.vue";
import CashPage from "../pages/CashPage.vue";
import TaskRetrievePage from "../pages/TaskRetrievePage.vue";
import CreateUser from "../pages/CreateUser.vue";
import NotFound from "../pages/NotFound.vue";
import CreateMaster from "../pages/CreateMaster.vue";
import CabinetPage from "../pages/CabinetPage.vue";
import ForgotPage from "../pages/ForgotPage.vue";
import ResetPage from "../pages/ResetPage.vue";
import LogisticsPage from "../pages/LogisticsPage.vue";
import NewsPage from "../pages/NewsPage.vue";
import IndustryPage from "../pages/IndustryPage";
import store from "@/store";
import CompanyPage from "../pages/CompanyPage.vue";

const routes = [
  { path: "/login", name: "Login", component: LoginForm },
  { path: "/orders", name: "Orders", component: OrdersPage },
  { path: "/purchases", name: "Purchases", component: PurchasesPage },
  { path: "/tasks", name: "Tasks", component: TaskPage },
  { path: "/performs", name: "Performs", component: TaskPage },
  { path: "/approvals", name: "Approvals", component: TaskPage },
  { path: "/tasks/:id", name: "Task", component: TaskRetrievePage },
  { path: "/cash", name: "Cashes", component: CashPage },
  { path: "/performs/:id", name: "Perform", component: TaskRetrievePage },
  { path: "/approval/:id", name: "Approval", component: TaskRetrievePage },
  {
    path: "/purchases/monitor",
    name: "PurchasesMonitor",
    component: PurchasesPage,
  },
  { path: "/logistics", name: "Logistics", component: LogisticsPage },
  {
    path: "/logistics/monitor",
    name: "LogisticsMonitor",
    component: LogisticsPage,
  },
  {
    path: "/industry",
    name: "Industry",
    component: IndustryPage,
  },
  { path: "/create_user", name: "CreateUser", component: CreateUser },
  { path: "/company", name: "CompanyPage", component: CompanyPage },
  { path: "/create_master", name: "CreateMaster", component: CreateMaster },
  { path: "/cabinet", name: "CabinetPage", component: CabinetPage },
  { path: "/forgot", name: "ForgotPage", component: ForgotPage },
  { path: "/reset/:link", name: "ResetPage", component: ResetPage },
  { path: "/news", name: "NewsPage", component: NewsPage },
  { path: "/not_found", name: "NotFound", component: NotFound },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const nonAuthPages = ["Login", "ForgotPage", "ResetPage"];

router.beforeEach(async (to) => {
  if (
    (!localStorage.getItem("jwt") || localStorage.getItem("jwt") === "") &&
    !nonAuthPages.includes(to.name)
  ) {
    store.commit("setIsAuth", false);
    return { name: "Login" };
  }

  store.commit("setOrderFilters", {});
});

export default router;
