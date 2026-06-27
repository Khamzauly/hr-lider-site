import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { normalizePublicContent } from "../lib/content";

interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  ctaLabel: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/services")
      .then((r) => r.json())
      .then((data) => setServices(normalizePublicContent(data.items || [])))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">Услуги HR Lider</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl">
          HR Lider помогает работодателям навести порядок в кадровых процессах,
          обучить сотрудников и подготовить документы, которые нужны для
          стабильной работы бизнеса. Вы можете выбрать отдельную услугу или
          собрать комплексное сопровождение под задачи компании.
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
                <h2 className="font-semibold text-xl mb-3">{service.title}</h2>
                <p className="text-gray-600 mb-4">{service.shortDescription}</p>
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
    </div>
  );
}
