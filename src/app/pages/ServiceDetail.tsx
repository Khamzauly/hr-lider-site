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
