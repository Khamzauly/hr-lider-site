import SpaApp from './SpaApp';

export const metadata = {
  title: 'HR Lider - обучение согласительных комиссий, HR-аудит и кадровый аутсорсинг в Казахстане',
  description:
    'Обучаем членов согласительных комиссий, кадровиков и HR-специалистов. Проводим HR-аудит, проверяем кадровые документы и помогаем снизить риски трудовых споров.',
  alternates: {
    canonical: '/'
  }
};

export default function Page() {
  return <SpaApp />;
}
