import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, CheckCircle } from "lucide-react";
import LeadForm from "../components/LeadForm";

interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  audience: string;
  includes: string;
  process: string;
  result: string;
  ctaLabel: string;
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/services/${slug}`)
      .then((r) => r.json())
      .then((data) => setService(data.item))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">Услуга не найдена</div>
        </div>
      </div>
    );
  }

  const isCommissionTraining = service.slug === "obuchenie-soglasitelnoi-komissii";

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          Назад к услугам
        </Link>

        <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{service.shortDescription}</p>

        {service.fullDescription && (
          <div className="prose max-w-none mb-8">
            <div
              dangerouslySetInnerHTML={{ __html: service.fullDescription }}
            />
          </div>
        )}

        {service.audience && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="text-blue-600" size={24} />
              Кому подходит
            </h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: service.audience }}
            />
          </section>
        )}

        {service.includes && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="text-blue-600" size={24} />
              Что входит
            </h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: service.includes }}
            />
          </section>
        )}

        {service.process && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="text-blue-600" size={24} />
              Как проходит работа
            </h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: service.process }}
            />
          </section>
        )}

        {service.result && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="text-blue-600" size={24} />
              Результат
            </h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: service.result }}
            />
          </section>
        )}

        {isCommissionTraining && (
          <section className="mb-8 space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Что получает компания
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Программа по трудовому законодательству РК и работе комиссии",
                  "Практические кейсы по индивидуальным трудовым спорам",
                  "Разбор документов: положение, протокол, решение, уведомления",
                  "Сертификат или подтверждение прохождения обучения",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Форматы обучения</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="font-semibold mb-2">Онлайн</div>
                  <p className="text-gray-600 text-sm">
                    Для компаний из разных городов и филиалов.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="font-semibold mb-2">Очно</div>
                  <p className="text-gray-600 text-sm">
                    Для команд, которым нужен живой разбор вопросов.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="font-semibold mb-2">Корпоративно</div>
                  <p className="text-gray-600 text-sm">
                    Адаптируем программу под документы и риски компании.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Частые вопросы</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="font-semibold mb-1">Кто должен обучаться?</div>
                  <p className="text-gray-600">
                    Члены согласительной комиссии со стороны работодателя и работников,
                    а также HR, кадровики и юристы, которые сопровождают процедуру.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="font-semibold mb-1">Как часто проходить обучение?</div>
                  <p className="text-gray-600">
                    Для членов комиссии важно регулярно обновлять знания по трудовому
                    законодательству, процедурам и переговорам.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="font-semibold mb-1">Можно ли провести курс для одной компании?</div>
                  <p className="text-gray-600">
                    Да, корпоративный формат подходит, если нужно обучить комиссию,
                    HR-команду и руководителей на внутренних примерах.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="bg-gray-50 rounded-lg p-8 mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {service.ctaLabel || "Заказать услугу"}
          </h2>
          <LeadForm source={`service_${service.slug}`} />
        </section>
      </div>
    </div>
  );
}
