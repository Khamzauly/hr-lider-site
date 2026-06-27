import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Building2,
  MapPin,
  Users,
  Scale,
  GraduationCap,
  CheckCircle,
  ArrowRight,
  Calendar,
  MessageCircle,
} from "lucide-react";
import LeadForm from "../components/LeadForm";
import { normalizePublicContent } from "../lib/content";

interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  ctaLabel: string;
}

interface Event {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  format: string;
  city?: string;
  startsAt: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/public/services").then((r) => r.json()),
      fetch("/api/public/events?timing=upcoming&limit=3").then((r) =>
        r.json()
      ),
      fetch("/api/public/articles?limit=3").then((r) => r.json()),
      fetch("/api/public/team").then((r) => r.json()),
      fetch("/api/public/faqs").then((r) => r.json()),
    ])
      .then(([servicesData, eventsData, articlesData, teamData, faqsData]) => {
        setServices(normalizePublicContent(servicesData.items || []));
        setEvents(normalizePublicContent(eventsData.items || []));
        setArticles(normalizePublicContent(articlesData.items || []));
        setTeam(normalizePublicContent(teamData.items || []));
        setFaqs(normalizePublicContent(faqsData.items || []));
      })
      .finally(() => setLoading(false));
  }, []);

  const scrollToConsultation = () => {
    const element = document.getElementById("consultation");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const whatsappUrl = "https://wa.me/77014322111?text=Здравствуйте!%20Хочу%20получить%20консультацию%20HR%20Lider";

  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Обучение согласительных комиссий и кадровый порядок для
              работодателей Казахстана
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Обучаем членов согласительных комиссий, кадровиков и
              HR-специалистов. Проводим HR-аудит, проверяем кадровые документы,
              помогаем снизить риски трудовых споров и проверок.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Link
                to="/services/obuchenie-soglasitelnoi-komissii"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition inline-flex items-center justify-center gap-2"
              >
                Получить программу обучения
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/services/hr-audit"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition inline-flex items-center justify-center gap-2"
              >
                Заказать HR-аудит
                <CheckCircle size={20} />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="border-2 border-green-600 text-green-700 px-8 py-3 rounded-lg hover:bg-green-50 transition inline-flex items-center justify-center gap-2"
              >
                Написать в WhatsApp
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Для компаний, где кадровые ошибки стоят дорого
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition">
              <Building2 className="text-blue-600 mb-4" size={32} />
              <h3 className="font-semibold text-lg mb-2">
                Средний и крупный бизнес
              </h3>
              <p className="text-gray-600">
                Для компаний, которым важно держать кадровые документы,
                процедуры и обучение сотрудников в управляемом состоянии.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition">
              <MapPin className="text-blue-600 mb-4" size={32} />
              <h3 className="font-semibold text-lg mb-2">
                Компании с филиалами
              </h3>
              <p className="text-gray-600">
                Помогаем привести кадровые процессы к единому стандарту по
                подразделениям, городам и ответственным лицам.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition">
              <Users className="text-blue-600 mb-4" size={32} />
              <h3 className="font-semibold text-lg mb-2">
                Работодатели с активным наймом
              </h3>
              <p className="text-gray-600">
                Настраиваем кадровые процедуры так, чтобы прием, перевод,
                отпуск, командировки и увольнения оформлялись без хаоса.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition">
              <Scale className="text-blue-600 mb-4" size={32} />
              <h3 className="font-semibold text-lg mb-2">
                Компании с трудовыми спорами
              </h3>
              <p className="text-gray-600">
                Помогаем подготовить документы, обучить комиссию и выстроить
                корректный порядок рассмотрения обращений работников.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition">
              <GraduationCap className="text-blue-600 mb-4" size={32} />
              <h3 className="font-semibold text-lg mb-2">
                HR-отделы и кадровики
              </h3>
              <p className="text-gray-600">
                Даем практические знания по трудовому законодательству, кадровым
                документам и работе с типовыми ситуациями.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Услуги для кадрового порядка и обучения
          </h2>
          <p className="text-gray-600 mb-12">
            Можно заказать отдельное обучение, провести аудит документов или
            подключить постоянное кадровое сопровождение.
          </p>
          {loading ? (
            <div className="text-center py-12">Загрузка...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-6 rounded-lg border hover:shadow-lg transition"
                >
                  <h3 className="font-semibold text-xl mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.shortDescription}
                  </p>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    {service.ctaLabel || "Подробнее"}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ближайшие обучения и события
          </h2>
          <p className="text-gray-600 mb-12">
            Проводим обучение согласительных комиссий, кадровому
            делопроизводству и другим практическим темам для работодателей.
          </p>
          {loading ? (
            <div className="text-center py-12">Загрузка...</div>
          ) : events.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl font-semibold mb-3">
                  Ближайшая открытая дата формируется
                </h3>
                <p className="text-gray-700 mb-6">
                  Оставьте заявку, предложим дату открытой группы или проведём
                  корпоративное обучение для вашей компании.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border">
                  <div className="font-semibold mb-2">Открытая группа</div>
                  <p className="text-sm text-gray-600">
                    Запишем в лист ожидания и сообщим, когда появится ближайшая
                    дата.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <div className="font-semibold mb-2">Корпоративное обучение</div>
                  <p className="text-sm text-gray-600">
                    Проведём обучение для членов комиссии и HR-команды вашей
                    компании.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <div className="font-semibold mb-2">Индивидуальная консультация</div>
                  <p className="text-sm text-gray-600">
                    Разберём документы, процедуру работы комиссии и кадровые
                    риски.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={scrollToConsultation}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Оставить заявку
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Calendar size={16} />
                      {new Date(event.startsAt).toLocaleDateString("ru-RU")}
                    </div>
                    <div className="text-sm text-blue-600 mb-2">
                      {event.format === "ONLINE"
                        ? "Онлайн"
                        : event.city || "Офлайн"}
                    </div>
                    <h3 className="font-semibold text-lg mb-3">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{event.excerpt}</p>
                    <div className="flex gap-2">
                      <Link
                        to={`/events/${event.slug}`}
                        className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                      >
                        Подробнее
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Практика, документы и обучение в одной системе
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <CheckCircle size={24} className="flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Опора на ТК РК</h3>
                <p className="text-blue-100">
                  Обучение и документы строятся вокруг требований трудового
                  законодательства Казахстана.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle size={24} className="flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Практический формат
                </h3>
                <p className="text-blue-100">
                  Разбираем реальные кадровые ситуации, документы и ошибки, а не
                  только теорию.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle size={24} className="flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Фокус на согласительной комиссии
                </h3>
                <p className="text-blue-100">
                  Помогаем работодателю не формально создать комиссию, а
                  выстроить рабочий механизм рассмотрения споров.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle size={24} className="flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Снижение кадровых рисков
                </h3>
                <p className="text-blue-100">
                  Выявляем пробелы в документах, процедурах и ответственности до
                  проверки или конфликта.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle size={24} className="flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Online и offline
                </h3>
                <p className="text-blue-100">
                  Обучение и сопровождение можно организовать для разных городов
                  и филиалов.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Статьи и новости</h2>
          <p className="text-gray-600 mb-12">
            Разбираем изменения в трудовом законодательстве, кадровые ошибки,
            работу согласительных комиссий и практику сопровождения
            работодателей.
          </p>
          {loading ? (
            <div className="text-center py-12">Загрузка...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
                >
                  <div className="text-sm text-blue-600 mb-2">
                    {article.category}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="text-sm text-gray-500">
                    {new Date(article.publishedAt).toLocaleDateString("ru-RU")}
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              Все статьи
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Команда</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="bg-white p-6 rounded-lg text-center"
                >
                  <div className="font-semibold text-lg mb-1">
                    {member.name}
                  </div>
                  <div className="text-blue-600 mb-3">{member.position}</div>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section id="faq" className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">FAQ</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-white border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="consultation" className="bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Получите консультацию
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Опишите задачу, и мы подскажем, какой формат подойдет: обучение,
            аудит, кадровое делопроизводство, подготовка к проверке или кадровое
            сопровождение.
          </p>
          <LeadForm source="home" />
        </div>
      </section>
    </div>
  );
}
