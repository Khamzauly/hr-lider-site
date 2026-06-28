import CrudTable from "../../components/admin/CrudTable";

export default function AdminLeads() {
  return (
    <CrudTable
      title="Заявки с сайта"
      endpoint="/api/admin/leads"
      columns={[
        { key: "name", label: "Имя" },
        { key: "phone", label: "Телефон" },
        { key: "company", label: "Компания" },
        { key: "source", label: "Источник" },
        {
          key: "comment",
          label: "Комментарий",
          render: (value) => value || "-",
        },
        {
          key: "createdAt",
          label: "Дата",
          render: (value) =>
            value
              ? new Date(value).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
        },
      ]}
    />
  );
}
