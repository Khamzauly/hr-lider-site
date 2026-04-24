import CrudTable from "../../components/admin/CrudTable";

export default function AdminStats() {
  return (
    <CrudTable
      title="Статистика"
      endpoint="/api/admin/stats"
      columns={[
        { key: "label", label: "Название" },
        { key: "value", label: "Значение" },
        { key: "order", label: "Порядок" },
      ]}
      onCreate={() => alert("Форма создания статистики (placeholder)")}
      onEdit={(item) => alert(`Редактирование: ${item.label}`)}
    />
  );
}
