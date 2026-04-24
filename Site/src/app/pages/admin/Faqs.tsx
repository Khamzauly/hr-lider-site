import CrudTable from "../../components/admin/CrudTable";

export default function AdminFaqs() {
  return (
    <CrudTable
      title="FAQ"
      endpoint="/api/admin/faqs"
      columns={[
        { key: "question", label: "Вопрос" },
        {
          key: "answer",
          label: "Ответ",
          render: (value) =>
            value.length > 100 ? value.substring(0, 100) + "..." : value,
        },
      ]}
      onCreate={() => alert("Форма создания FAQ (placeholder)")}
      onEdit={(item) => alert(`Редактирование: ${item.question}`)}
    />
  );
}
