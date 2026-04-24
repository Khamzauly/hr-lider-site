import { useState } from "react";
import CrudTable from "../../components/admin/CrudTable";
import EntityFormModal, { EntityField } from "../../components/admin/EntityFormModal";

const fields: EntityField[] = [
  { name: "question", label: "Вопрос", required: true },
  { name: "answer", label: "Ответ", type: "textarea", required: true },
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

export default function AdminFaqs() {
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CrudTable
        title="FAQ"
        endpoint="/api/admin/faqs"
        refreshKey={refreshKey}
        columns={[
          { key: "question", label: "Вопрос" },
          {
            key: "answer",
            label: "Ответ",
            render: (value) =>
              value.length > 100 ? value.substring(0, 100) + "..." : value,
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
          title={editing ? "Редактировать FAQ" : "Создать FAQ"}
          endpoint="/api/admin/faqs"
          fields={fields}
          item={editing}
          defaults={{ status: "DRAFT", order: 0 }}
          onClose={() => setOpen(false)}
          onSaved={() => setRefreshKey((key) => key + 1)}
        />
      )}
    </>
  );
}
