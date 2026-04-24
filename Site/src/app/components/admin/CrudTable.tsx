import { useState, useEffect } from "react";
import { Trash2, Edit, Plus } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface CrudTableProps {
  title: string;
  endpoint: string;
  columns: Column[];
  onEdit?: (item: any) => void;
  onCreate?: () => void;
}

export default function CrudTable({
  title,
  endpoint,
  columns,
  onEdit,
  onCreate,
}: CrudTableProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(endpoint, { credentials: "include" });
      if (!response.ok) throw new Error("Ошибка загрузки");
      const data = await response.json();
      setItems(data.items || []);
    } catch (err) {
      setError("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот элемент?")) return;

    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Ошибка удаления");
      fetchItems();
    } catch (err) {
      alert("Не удалось удалить");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {onCreate && (
          <button
            onClick={onCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Создать
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Загрузка...</div>
      ) : items.length === 0 ? (
        <div className="bg-gray-50 border rounded-lg p-8 text-center text-gray-600">
          Нет данных
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-sm font-semibold"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-sm font-semibold">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm">
                      {col.render
                        ? col.render(item[col.key], item)
                        : item[col.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
