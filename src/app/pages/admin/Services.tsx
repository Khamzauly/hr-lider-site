import { useState } from "react";
import CrudTable from "../../components/admin/CrudTable";
import EntityFormModal, { EntityField } from "../../components/admin/EntityFormModal";

const fields: EntityField[] = [
  { name: "title", label: "Название", required: true },
  { name: "slug", label: "Slug" },
  { name: "shortDescription", label: "Краткое описание", type: "textarea", required: true },
  { name: "fullDescription", label: "Полное описание", type: "textarea", required: true },
  { name: "audience", label: "Кому подходит", type: "textarea" },
  { name: "includes", label: "Что входит", type: "textarea" },
  { name: "process", label: "Как проходит работа", type: "textarea" },
  { name: "result", label: "Результат", type: "textarea" },
  { name: "ctaLabel", label: "Текст кнопки" },
  { name: "order", label: "Порядок", type: "number" },
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
];

export default function AdminServices() {
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CrudTable
        title="Услуги"
        endpoint="/api/admin/services"
        refreshKey={refreshKey}
        columns={[
          { key: "title", label: "Название" },
          { key: "shortDescription", label: "Описание" },
          { key: "order", label: "Порядок" },
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
          title={editing ? "Редактировать услугу" : "Создать услугу"}
          endpoint="/api/admin/services"
          fields={fields}
          item={editing}
          defaults={{ status: "DRAFT", ctaLabel: "Получить консультацию", order: 0 }}
          onClose={() => setOpen(false)}
          onSaved={() => setRefreshKey((key) => key + 1)}
        />
      )}
    </>
  );
}
