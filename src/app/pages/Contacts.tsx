import LeadForm from "../components/LeadForm";
import { trackContactClick } from "../lib/analytics.js";
import { getAttributionPayload } from "../lib/attribution.js";

const phoneContacts = [
  { label: "+7 707 281 70 60", href: "tel:+77072817060" },
  { label: "+7 701 432 21 11", href: "tel:+77014322111" },
];

export default function Contacts() {
  return (
    <div className="py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">Контакты</h1>
        <p className="text-xl text-gray-600 mb-12">
          Расскажите, какая задача стоит перед компанией: обучение комиссии,
          кадровое делопроизводство, аудит, обучение кадровиков или подготовка к
          проверке. Мы подскажем подходящий формат работы.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-10 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Связаться с нами</h2>
            <div className="space-y-2 text-lg">
              {phoneContacts.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  onClick={() => trackContactClick("phone", "contacts", getAttributionPayload())}
                  className="block text-blue-600 hover:text-blue-700 transition"
                >
                  {phone.label}
                </a>
              ))}
              <a
                href="mailto:info@hr-lider.kz"
                onClick={() => trackContactClick("email", "contacts", getAttributionPayload())}
                className="block text-blue-600 hover:text-blue-700 transition"
              >
                info@hr-lider.kz
              </a>
            </div>
          </div>
        </div>

        <LeadForm source="contact" />
      </div>
    </div>
  );
}
