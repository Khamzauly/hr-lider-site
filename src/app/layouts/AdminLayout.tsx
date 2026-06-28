import { Outlet, Link, useNavigate } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  Briefcase,
  HelpCircle,
  BarChart3,
  MessageSquare,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Главная" },
    { path: "/admin/articles", icon: FileText, label: "Статьи" },
    { path: "/admin/events", icon: Calendar, label: "Мероприятия" },
    { path: "/admin/registrations", icon: Users, label: "Регистрации" },
    { path: "/admin/leads", icon: MessageSquare, label: "Заявки" },
    { path: "/admin/services", icon: Briefcase, label: "Услуги" },
    { path: "/admin/faqs", icon: HelpCircle, label: "FAQ" },
    { path: "/admin/stats", icon: BarChart3, label: "Статистика" },
    { path: "/admin/team", icon: UserCircle, label: "Команда" },
    { path: "/admin/settings", icon: Settings, label: "Настройки" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-800">
            <Link to="/admin" className="text-xl font-bold">
              HR Lider Admin
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition w-full text-left"
            >
              <LogOut size={20} />
              Выйти
            </button>
          </nav>
        </aside>

        <div className="lg:ml-64 flex-1">
          <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="px-4 py-4 flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-semibold">Панель управления</h2>
            </div>
          </header>

          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
