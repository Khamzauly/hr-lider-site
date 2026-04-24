import LeadForm from "../components/LeadForm";

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

        <LeadForm source="contact" />
      </div>
    </div>
  );
}
