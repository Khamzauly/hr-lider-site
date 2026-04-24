import { FileText, Calendar, Users, Briefcase } from "lucide-react";
import { Link } from "react-router";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Добро пожаловать в админку</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/admin/articles"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <FileText className="text-blue-600 mb-2" size={32} />
          <h3 className="font-semibold text-lg">Статьи</h3>
          <p className="text-gray-600">Управление статьями</p>
        </Link>
        <Link
          to="/admin/events"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <Calendar className="text-blue-600 mb-2" size={32} />
          <h3 className="font-semibold text-lg">Мероприятия</h3>
          <p className="text-gray-600">Управление событиями</p>
        </Link>
        <Link
          to="/admin/registrations"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <Users className="text-blue-600 mb-2" size={32} />
          <h3 className="font-semibold text-lg">Регистрации</h3>
          <p className="text-gray-600">Заявки на мероприятия</p>
        </Link>
        <Link
          to="/admin/services"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <Briefcase className="text-blue-600 mb-2" size={32} />
          <h3 className="font-semibold text-lg">Услуги</h3>
          <p className="text-gray-600">Управление услугами</p>
        </Link>
      </div>
    </div>
  );
}
