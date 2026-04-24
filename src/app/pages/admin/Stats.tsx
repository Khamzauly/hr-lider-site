import { useState } from "react";
import CrudTable from "../../components/admin/CrudTable";
import EntityFormModal, { EntityField } from "../../components/admin/EntityFormModal";

const fields: EntityField[] = [
  { name: "label", label: "Название", required: true },
  { name: "value", label: "Значение", required: true },
  { name: "description", label: "Описание", type: "textarea" },
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

export default function AdminStats() {
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CrudTable
        title="Статистика"
        endpoint="/api/admin/stats"
        refreshKey={refreshKey}
        columns={[
          { key: "label", label: "Название" },
          { key: "value", label: "Значение" },
          { key: "order", label: "Порядок" },
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
          title={editing ? "Редактировать показатель" : "Создать показатель"}
          endpoint="/api/admin/stats"
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
