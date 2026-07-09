import { useState, FormEvent } from "react";
import { trackLeadSubmit } from "../lib/analytics.js";
import { getAttributionPayload } from "../lib/attribution.js";

interface LeadFormProps {
  source: string;
}

export default function LeadForm({ source }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
    comment: "",
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const attribution = getAttributionPayload();
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source, attribution }),
      });

      if (!response.ok) throw new Error("Ошибка отправки");

      trackLeadSubmit(source, attribution);
      setStatus("success");
      setFormData({ name: "", phone: "", company: "", comment: "", website: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage("Не удалось отправить заявку. Попробуйте позже.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800 font-semibold">
          Спасибо! Мы получили заявку, отправим программу и предложим подходящий формат или дату.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border space-y-4">
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div>
        <label className="block text-sm font-medium mb-1">
          Имя <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Телефон <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Компания</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Комментарий</label>
        <textarea
          rows={4}
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {errorMessage}
        </div>
      )}
      <p className="text-xs text-gray-500">
        Нажимая кнопку, вы соглашаетесь на обработку контактных данных для ответа на заявку.
      </p>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {status === "loading" ? "Отправка..." : "Отправить заявку"}
      </button>
    </form>
  );
}
