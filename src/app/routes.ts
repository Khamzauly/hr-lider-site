import { createBrowserRouter } from "react-router";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminArticles from "./pages/admin/Articles";
import AdminEvents from "./pages/admin/Events";
import AdminRegistrations from "./pages/admin/Registrations";
import AdminLeads from "./pages/admin/Leads";
import AdminServices from "./pages/admin/Services";
import AdminFaqs from "./pages/admin/Faqs";
import AdminStats from "./pages/admin/Stats";
import AdminTeam from "./pages/admin/Team";
import AdminSettings from "./pages/admin/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: "services", Component: Services },
      { path: "services/:slug", Component: ServiceDetail },
      { path: "events", Component: Events },
      { path: "events/:slug", Component: EventDetail },
      { path: "articles", Component: Articles },
      { path: "articles/:slug", Component: ArticleDetail },
      { path: "about", Component: About },
      { path: "contacts", Component: Contacts },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "articles", Component: AdminArticles },
      { path: "events", Component: AdminEvents },
      { path: "registrations", Component: AdminRegistrations },
      { path: "leads", Component: AdminLeads },
      { path: "services", Component: AdminServices },
      { path: "faqs", Component: AdminFaqs },
      { path: "stats", Component: AdminStats },
      { path: "team", Component: AdminTeam },
      { path: "settings", Component: AdminSettings },
    ],
  },
]);
