import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import DashboardWithSupabase from "./pages/DashboardWithSupabase";
import AddExpense from "./pages/AddExpense";
import Analysis from "./pages/Analysis";
import Investments from "./pages/Investments";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardWithSupabase },
      { path: "adicionar", Component: AddExpense },
      { path: "analise", Component: Analysis },
      { path: "investimentos", Component: Investments },
      { path: "relatorios", Component: Reports },
      { path: "perfil", Component: Profile },
    ],
  },
]);
