import { Outlet, Link } from "react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToConsultation = () => {
    const element = document.getElementById("consultation");
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="font-bold text-xl text-blue-600">
              HR Lider
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/services" className="hover:text-blue-600 transition">
                Услуги
              </Link>
              <Link to="/events" className="hover:text-blue-600 transition">
                Мероприятия
              </Link>
              <Link to="/articles" className="hover:text-blue-600 transition">
                Статьи
              </Link>
              <Link to="/about" className="hover:text-blue-600 transition">
                О компании
              </Link>
              <Link to="/#faq" className="hover:text-blue-600 transition">
                FAQ
              </Link>
              <Link to="/contacts" className="hover:text-blue-600 transition">
                Контакты
              </Link>
              <button
                onClick={scrollToConsultation}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Получить консультацию
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <Link
                to="/services"
                className="block hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Услуги
              </Link>
              <Link
                to="/events"
                className="block hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Мероприятия
              </Link>
              <Link
                to="/articles"
                className="block hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Статьи
              </Link>
              <Link
                to="/about"
                className="block hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                О компании
              </Link>
              <Link
                to="/#faq"
                className="block hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/contacts"
                className="block hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Контакты
              </Link>
              <button
                onClick={scrollToConsultation}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full"
              >
                Получить консультацию
              </button>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="font-bold text-xl mb-4">HR Lider</div>
              <p className="text-gray-400">
                Кадровый порядок и обучение для работодателей в Казахстане
              </p>
            </div>
            <div>
              <div className="font-semibold mb-4">Услуги</div>
              <div className="space-y-2">
                <Link
                  to="/services"
                  className="block text-gray-400 hover:text-white transition"
                >
                  Все услуги
                </Link>
                <Link
                  to="/events"
                  className="block text-gray-400 hover:text-white transition"
                >
                  Мероприятия
                </Link>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-4">Компания</div>
              <div className="space-y-2">
                <Link
                  to="/about"
                  className="block text-gray-400 hover:text-white transition"
                >
                  О компании
                </Link>
                <Link
                  to="/articles"
                  className="block text-gray-400 hover:text-white transition"
                >
                  Статьи
                </Link>
                <Link
                  to="/contacts"
                  className="block text-gray-400 hover:text-white transition"
                >
                  Контакты
                </Link>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-4">Контакты</div>
              <div className="space-y-2 text-gray-400">
                <p>Казахстан</p>
                <p>info@hr-lider.kz</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © {new Date().getFullYear()} HR Lider. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
