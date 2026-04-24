import CrudTable from "../../components/admin/CrudTable";

export default function AdminTeam() {
  return (
    <CrudTable
      title="Команда"
      endpoint="/api/admin/team"
      columns={[
        { key: "name", label: "Имя" },
        { key: "position", label: "Должность" },
        {
          key: "bio",
          label: "Описание",
          render: (value) =>
            value.length > 100 ? value.substring(0, 100) + "..." : value,
        },
      ]}
      onCreate={() => alert("Форма создания члена команды (placeholder)")}
      onEdit={(item) => alert(`Редактирование: ${item.name}`)}
    />
  );
}
