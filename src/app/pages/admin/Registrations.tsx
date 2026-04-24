import CrudTable from "../../components/admin/CrudTable";

export default function AdminRegistrations() {
  return (
    <CrudTable
      title="Регистрации на мероприятия"
      endpoint="/api/admin/registrations"
      columns={[
        { key: "name", label: "Имя" },
        { key: "phone", label: "Телефон" },
        { key: "email", label: "Email" },
        { key: "company", label: "Компания" },
        { key: "position", label: "Должность" },
        {
          key: "createdAt",
          label: "Дата регистрации",
          render: (value) =>
            value ? new Date(value).toLocaleDateString("ru-RU") : "-",
        },
      ]}
      onEdit={(item) => alert(`Просмотр: ${item.name}`)}
    />
  );
}
