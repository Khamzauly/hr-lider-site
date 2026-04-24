import { useState } from "react";
import CrudTable from "../../components/admin/CrudTable";
import EntityFormModal, { EntityField } from "../../components/admin/EntityFormModal";

const fields: EntityField[] = [
  { name: "name", label: "Имя", required: true },
  { name: "role", label: "Роль", required: true },
  { name: "description", label: "Описание", type: "textarea", required: true },
  { name: "experienceText", label: "Опыт" },
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

export default function AdminTeam() {
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CrudTable
        title="Команда"
        endpoint="/api/admin/team"
        refreshKey={refreshKey}
        columns={[
          { key: "name", label: "Имя" },
          { key: "role", label: "Роль" },
          {
            key: "description",
            label: "Описание",
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
          title={editing ? "Редактировать участника" : "Создать участника"}
          endpoint="/api/admin/team"
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
