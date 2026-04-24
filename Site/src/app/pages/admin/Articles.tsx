import CrudTable from "../../components/admin/CrudTable";

export default function AdminArticles() {
  return (
    <CrudTable
      title="Статьи"
      endpoint="/api/admin/articles"
      columns={[
        { key: "title", label: "Название" },
        { key: "category", label: "Категория" },
        {
          key: "status",
          label: "Статус",
          render: (value) => (
            <span
              className={`px-2 py-1 rounded text-xs ${
                value === "PUBLISHED"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {value === "PUBLISHED" ? "Опубликовано" : "Черновик"}
            </span>
          ),
        },
        {
          key: "publishedAt",
          label: "Дата публикации",
          render: (value) =>
            value ? new Date(value).toLocaleDateString("ru-RU") : "-",
        },
      ]}
      onCreate={() => alert("Форма создания статьи (placeholder)")}
      onEdit={(item) => alert(`Редактирование: ${item.title}`)}
    />
  );
}
