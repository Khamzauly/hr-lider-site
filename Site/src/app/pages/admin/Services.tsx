import CrudTable from "../../components/admin/CrudTable";

export default function AdminServices() {
  return (
    <CrudTable
      title="Услуги"
      endpoint="/api/admin/services"
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
      onCreate={() => alert("Форма создания услуги (placeholder)")}
      onEdit={(item) => alert(`Редактирование: ${item.title}`)}
    />
  );
}
