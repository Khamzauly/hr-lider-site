import { useState } from "react";
import CrudTable from "../../components/admin/CrudTable";
import EntityFormModal, { EntityField } from "../../components/admin/EntityFormModal";

const fields: EntityField[] = [
  { name: "title", label: "Название", required: true },
  { name: "slug", label: "Slug" },
  { name: "excerpt", label: "Краткое описание", type: "textarea", required: true },
  { name: "description", label: "Описание", type: "textarea", required: true },
  { name: "program", label: "Программа", type: "textarea", required: true },
  {
    name: "format",
    label: "Формат",
    type: "select",
    options: [
      { label: "Онлайн", value: "ONLINE" },
      { label: "Офлайн", value: "OFFLINE" },
    ],
  },
  { name: "city", label: "Город" },
  { name: "onlineUrl", label: "Online URL" },
  { name: "privateNote", label: "Приватная заметка", type: "textarea" },
  { name: "startsAt", label: "Начало", type: "datetime-local", required: true },
  { name: "endsAt", label: "Окончание", type: "datetime-local" },
  { name: "seatsLimit", label: "Лимит мест", type: "number" },
  { name: "registrationEnabled", label: "Регистрация", type: "checkbox" },
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

export default function AdminEvents() {
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CrudTable
        title="Мероприятия"
        endpoint="/api/admin/events"
        refreshKey={refreshKey}
        columns={[
          { key: "title", label: "Название" },
          {
            key: "format",
            label: "Формат",
            render: (value) => (value === "ONLINE" ? "Онлайн" : "Офлайн"),
          },
          { key: "city", label: "Город" },
          {
            key: "startsAt",
            label: "Начало",
            render: (value) => new Date(value).toLocaleDateString("ru-RU"),
          },
          {
            key: "registrationEnabled",
            label: "Регистрация",
            render: (value) => (value ? "Открыта" : "Закрыта"),
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
          title={editing ? "Редактировать мероприятие" : "Создать мероприятие"}
          endpoint="/api/admin/events"
          fields={fields}
          item={editing}
          defaults={{
            status: "DRAFT",
            format: "ONLINE",
            registrationEnabled: true,
            startsAt: new Date().toISOString(),
          }}
          onClose={() => setOpen(false)}
          onSaved={() => setRefreshKey((key) => key + 1)}
        />
      )}
    </>
  );
}
