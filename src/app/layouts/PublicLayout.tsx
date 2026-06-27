import { Outlet, Link } from "react-router";
import { useState } from "react";
import { Menu, X, MessageCircle, Phone } from "lucide-react";

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const phoneContacts = [
    { label: "+7 707 281 70 60", href: "tel:+77072817060" },
    { label: "+7 701 432 21 11", href: "tel:+77014322111" },
  ];
  const whatsappHref = "https://wa.me/77014322111?text=Здравствуйте!%20Хочу%20получить%20консультацию%20HR%20Lider";

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
            <Link to="/" className="flex items-center">
              <img
                src="/images/hr-lider-main-logo.png"
                alt="HR Lider"
                className="h-12 w-20 object-contain object-left"
              />
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
              <a
                href={phoneContacts[1].href}
                className="hidden lg:inline-flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition"
              >
                <Phone size={16} />
                {phoneContacts[1].label}
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="hidden lg:inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-800 transition"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
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
              <a
                href={phoneContacts[1].href}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone size={18} />
                {phoneContacts[1].label}
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-green-700 hover:text-green-800 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageCircle size={18} />
                Написать в WhatsApp
              </a>
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
              <Link to="/" className="mb-4 inline-flex">
                <img
                  src="/images/hr-lider-main-logo.png"
                  alt="HR Lider"
                  className="h-24 w-28 object-contain object-left"
                />
              </Link>
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
                {phoneContacts.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="block hover:text-white transition"
                  >
                    {phone.label}
                  </a>
                ))}
                <a
                  href="mailto:info@hr-lider.kz"
                  className="block hover:text-white transition"
                >
                  info@hr-lider.kz
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © {new Date().getFullYear()} HR Lider. Все права защищены.
          </div>
        </div>
      </footer>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Написать HR Lider в WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition hover:bg-green-700 md:hidden"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
