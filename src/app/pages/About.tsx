import { CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">О компании</h1>

        <div className="prose max-w-none mb-12">
          <p className="text-xl text-gray-600">
            HR Lider помогает работодателям в Казахстане выстраивать кадровые
            процессы, обучать сотрудников и снижать риски, связанные с кадровыми
            документами и трудовыми спорами. Мы работаем с компаниями, которым
            важно не просто закрыть разовую задачу, а навести системный порядок
            в HR-документах, обучении и внутренних процедурах.
          </p>
        </div>

        <section className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Наш подход</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-gray-700">
                  Сначала выявляем задачу и риски
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-gray-700">
                  Проверяем документы и текущий процесс
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-gray-700">Предлагаем понятный план действий</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-gray-700">Обучаем ответственных сотрудников</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-gray-700">
                  Помогаем внедрить порядок в ежедневную работу
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
