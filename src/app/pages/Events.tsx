import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Calendar, ArrowRight } from "lucide-react";
import LeadForm from "../components/LeadForm";
import { normalizePublicContent } from "../lib/content";

interface Event {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  format: string;
  city?: string;
  startsAt: string;
}

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const filter = searchParams.get("filter") || "all";

  useEffect(() => {
    let url = "/api/public/events";
    const params = new URLSearchParams();

    if (filter === "online") params.set("format", "ONLINE");
    if (filter === "offline") params.set("format", "OFFLINE");
    if (filter === "upcoming") params.set("timing", "upcoming");
    if (filter === "past") params.set("timing", "past");

    if (params.toString()) url += `?${params.toString()}`;

    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((data) => setEvents(normalizePublicContent(data.items || [])))
      .finally(() => setLoading(false));
  }, [filter]);

  const setFilter = (newFilter: string) => {
    if (newFilter === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ filter: newFilter });
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">Мероприятия и обучение</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl">
          HR Lider проводит обучение для согласительных комиссий, кадровиков,
          HR-специалистов и руководителей. Выберите ближайшее мероприятие или
          оставьте заявку на корпоративное обучение.
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "upcoming"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Ближайшие
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "past"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Прошедшие
          </button>
          <button
            onClick={() => setFilter("online")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "online"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Онлайн
          </button>
          <button
            onClick={() => setFilter("offline")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "offline"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Офлайн
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Загрузка...</div>
        ) : events.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-2xl font-semibold mb-3">
                Ближайшая открытая дата формируется
              </h2>
              <p className="text-gray-700">
                Оставьте заявку, предложим дату открытой группы или проведём
                корпоративное обучение для вашей компании.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 border">
                <div className="font-semibold mb-2">Открытая группа</div>
                <p className="text-sm text-gray-600">
                  Запишем в лист ожидания и сообщим о ближайшем наборе.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="font-semibold mb-2">Корпоративное обучение</div>
                <p className="text-sm text-gray-600">
                  Проведём курс для сотрудников компании, комиссии и HR-команды.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="font-semibold mb-2">Индивидуальная консультация</div>
                <p className="text-sm text-gray-600">
                  Разберём документы, вопросы комиссии и кадровые риски.
                </p>
              </div>
            </div>
            <div className="max-w-2xl mx-auto">
              <LeadForm source="events_waitlist" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <h3 className="font-semibold text-lg mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.excerpt}</p>
                  <div className="flex gap-2">
                    <Link
                      to={`/events/${event.slug}`}
                      className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      Подробнее
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      to={`/events/${event.slug}#registration`}
                      className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Регистрация
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
