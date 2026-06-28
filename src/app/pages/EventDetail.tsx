import { useEffect, useState, FormEvent } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";
import { trackEventRegistration } from "../lib/analytics.js";
import { normalizePublicContent } from "../lib/content";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  program: string;
  format: string;
  city?: string;
  startsAt: string;
  endsAt?: string;
  registrationEnabled: boolean;
}

export default function EventDetail() {
  const { slug } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    position: "",
    comment: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    fetch(`/api/public/events/${slug}`)
      .then((r) => r.json())
      .then((data) => setEvent(normalizePublicContent(data.item)))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setFormStatus("loading");

    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Ошибка регистрации");

      trackEventRegistration(event.slug);
      setFormStatus("success");
      setFormData({
        name: "",
        phone: "",
        email: "",
        company: "",
        position: "",
        comment: "",
      });
    } catch (error) {
      setFormStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">Мероприятие не найдено</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          Назад к мероприятиям
        </Link>

        <h1 className="text-4xl font-bold mb-6">{event.title}</h1>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={20} />
            {new Date(event.startsAt).toLocaleDateString("ru-RU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          {event.endsAt && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={20} />
              {new Date(event.startsAt).toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(event.endsAt).toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={20} />
            {event.format === "ONLINE" ? "Онлайн" : event.city || "Офлайн"}
          </div>
        </div>

        {event.description && (
          <div className="prose max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: event.description }} />
          </div>
        )}

        {event.program && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Программа</h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: event.program }}
            />
          </section>
        )}

        <section id="registration" className="bg-gray-50 rounded-lg p-8 mt-12">
          {!event.registrationEnabled ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Набор закрыт</h2>
              <p className="text-gray-600">
                Регистрация на это мероприятие завершена.
              </p>
            </div>
          ) : formStatus === "success" ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-800 font-semibold">
                Спасибо! Мы получили регистрацию и свяжемся с вами для
                подтверждения участия.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Регистрация
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Имя <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Телефон <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Компания
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Должность
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Комментарий
                  </label>
                  <textarea
                    rows={3}
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {formStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                    Не удалось зарегистрироваться. Попробуйте позже.
                  </div>
                )}
                <button
                  type="submit"
                  disabled={formStatus === "loading"}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {formStatus === "loading"
                    ? "Отправка..."
                    : "Зарегистрироваться"}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
