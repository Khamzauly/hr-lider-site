import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
}

const categories = [
  "Согласительная комиссия",
  "Кадровое делопроизводство",
  "HR-аудит",
  "Обучение",
  "Трудовые споры",
  "Новости HR Lider",
];

export default function Articles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category");

  useEffect(() => {
    let url = "/api/public/articles";
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }

    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((data) => setArticles(data.items || []))
      .finally(() => setLoading(false));
  }, [category]);

  const setCategory = (newCategory: string | null) => {
    if (newCategory) {
      setSearchParams({ category: newCategory });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">Статьи и новости</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl">
          Пишем о кадровом делопроизводстве, согласительных комиссиях, трудовых
          спорах, обучении HR-специалистов и практических изменениях, которые
          важны работодателям.
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setCategory(null)}
            className={`px-4 py-2 rounded-lg transition ${
              !category
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg transition ${
                category === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Загрузка...</div>
        ) : articles.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-gray-700">Статей пока нет.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="text-sm text-blue-600 mb-2">
                  {article.category}
                </div>
                <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="text-sm text-gray-500">
                  {new Date(article.publishedAt).toLocaleDateString("ru-RU")}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
