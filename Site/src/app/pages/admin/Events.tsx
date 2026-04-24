import CrudTable from "../../components/admin/CrudTable";

export default function AdminEvents() {
  return (
    <CrudTable
      title="Мероприятия"
      endpoint="/api/admin/events"
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
      onCreate={() => alert("Форма создания мероприятия (placeholder)")}
      onEdit={(item) => alert(`Редактирование: ${item.title}`)}
    />
  );
}
