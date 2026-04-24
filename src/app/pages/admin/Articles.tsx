import { useState } from "react";
import CrudTable from "../../components/admin/CrudTable";
import EntityFormModal, { EntityField } from "../../components/admin/EntityFormModal";

const fields: EntityField[] = [
  { name: "title", label: "Название", required: true },
  { name: "slug", label: "Slug", placeholder: "zapolnitsya-avtomaticheski" },
  { name: "excerpt", label: "Краткое описание", type: "textarea", required: true },
  { name: "content", label: "Текст статьи", type: "textarea", required: true },
  { name: "category", label: "Категория", required: true },
  {
    name: "status",
    label: "Статус",
    type: "select",
    options: [
      { label: "Черновик", value: "DRAFT" },
      { label: "Опубликовано", value: "PUBLISHED" },
      { label: "Архив", value: "ARCHIVED" },
    ],
  },
  { name: "publishedAt", label: "Дата публикации", type: "datetime-local" },
];

export default function AdminArticles() {
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CrudTable
        title="Статьи"
        endpoint="/api/admin/articles"
        refreshKey={refreshKey}
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
        onCreate={() => {
          setEditing(null);
          setOpen(true);
        }}
        onEdit={(item) => {
          setEditing(item);
          setOpen(true);
        }}
      />
      {open && (
        <EntityFormModal
          title={editing ? "Редактировать статью" : "Создать статью"}
          endpoint="/api/admin/articles"
          fields={fields}
          item={editing}
          defaults={{ status: "DRAFT", publishedAt: new Date().toISOString() }}
          onClose={() => setOpen(false)}
          onSaved={() => setRefreshKey((key) => key + 1)}
        />
      )}
    </>
  );
}
