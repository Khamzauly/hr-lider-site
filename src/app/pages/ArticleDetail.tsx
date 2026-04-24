import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import LeadForm from "../components/LeadForm";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/articles/${slug}`)
      .then((r) => r.json())
      .then((data) => setArticle(data.item))
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

  if (!article) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">Статья не найдена</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          Назад к статьям
        </Link>

        <div className="text-sm text-blue-600 mb-2">{article.category}</div>
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="text-gray-500 mb-8">
          {new Date(article.publishedAt).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        <div className="text-xl text-gray-600 mb-8">{article.excerpt}</div>

        <div
          className="prose max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Нужна консультация по теме?
          </h2>
          <LeadForm source={`article_${article.slug}`} />
        </section>
      </div>
    </div>
  );
}
