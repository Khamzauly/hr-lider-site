import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "datetime-local"
  | "select"
  | "checkbox";

export interface EntityField {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface EntityFormModalProps {
  title: string;
  endpoint: string;
  fields: EntityField[];
  item?: Record<string, any> | null;
  defaults?: Record<string, any>;
  onClose: () => void;
  onSaved: () => void;
}

function toInputDate(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export default function EntityFormModal({
  title,
  endpoint,
  fields,
  item,
  defaults = {},
  onClose,
  onSaved,
}: EntityFormModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const next: Record<string, any> = { ...defaults, ...(item || {}) };
    fields.forEach((field) => {
      if (field.type === "datetime-local") {
        next[field.name] = toInputDate(next[field.name]);
      }
      if (field.type === "checkbox") {
        next[field.name] = Boolean(next[field.name]);
      }
      if (next[field.name] === undefined || next[field.name] === null) {
        next[field.name] = field.type === "checkbox" ? false : "";
      }
    });
    setFormData(next);
  }, [item, defaults, fields]);

  const update = (name: string, value: any) => {
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(item?.id ? `${endpoint}/${item.id}` : endpoint, {
        method: item?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) {
        throw new Error(data.error || "Не удалось сохранить");
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 p-4 overflow-y-auto">
      <div className="mx-auto my-8 max-w-3xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
            <X size={22} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-1 block text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  required={field.required}
                  rows={6}
                  value={formData[field.name] || ""}
                  placeholder={field.placeholder}
                  onChange={(e) => update(field.name, e.target.value)}
                  className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              ) : field.type === "select" ? (
                <select
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) => update(field.name, e.target.value)}
                  className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  {(field.options || []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={Boolean(formData[field.name])}
                    onChange={(e) => update(field.name, e.target.checked)}
                    className="h-4 w-4"
                  />
                  Включено
                </label>
              ) : (
                <input
                  type={field.type || "text"}
                  required={field.required}
                  value={formData[field.name] || ""}
                  placeholder={field.placeholder}
                  onChange={(e) => update(field.name, e.target.value)}
                  className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
