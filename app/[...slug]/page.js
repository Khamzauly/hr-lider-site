import SpaApp from '../SpaApp';

const titlesByPath = {
  services: {
    title: 'Услуги HR Lider: обучение, HR-аудит и кадровый аутсорсинг',
    description:
      'Услуги HR Lider для работодателей Казахстана: обучение согласительных комиссий, кадровое делопроизводство, HR-аудит, аутсорсинг и подготовка к проверкам.'
  },
  'services/obuchenie-soglasitelnoi-komissii': {
    title: 'Обучение согласительной комиссии в Казахстане - курс для работодателей и HR',
    description:
      'Практическое обучение членов согласительной комиссии: трудовое законодательство РК, порядок работы комиссии, документы, переговоры, кейсы и сертификат.'
  },
  'services/hr-audit': {
    title: 'HR-аудит и проверка кадровых документов в Казахстане',
    description:
      'Проверяем кадровые документы и процедуры, выявляем риски, готовим план исправлений и рекомендации для работодателя.'
  },
  'services/kadrovyj-autsorsing': {
    title: 'Кадровый аутсорсинг для компаний в Казахстане - документы, сроки, сопровождение',
    description:
      'Регулярное кадровое сопровождение: документы, сроки, шаблоны, консультации и внешний контроль кадрового порядка.'
  },
  events: {
    title: 'Мероприятия и обучение HR Lider для работодателей Казахстана',
    description:
      'Обучение согласительных комиссий, кадровиков и HR-специалистов. Открытые группы, корпоративное обучение и индивидуальные консультации.'
  },
  articles: {
    title: 'Статьи HR Lider о кадровых документах, трудовых спорах и HR-аудите',
    description:
      'Практические материалы для работодателей Казахстана: согласительная комиссия, кадровые документы, HR-аудит, трудовые споры и проверки.'
  },
  about: {
    title: 'О компании HR Lider - кадровое сопровождение и обучение работодателей',
    description:
      'HR Lider помогает работодателям Казахстана выстраивать кадровые процессы, обучать сотрудников и снижать риски по кадровым документам.'
  },
  contacts: {
    title: 'Контакты HR Lider - консультация по обучению и HR-аудиту',
    description:
      'Свяжитесь с HR Lider, чтобы получить программу обучения согласительной комиссии, заказать HR-аудит или обсудить кадровое сопровождение.'
  }
};

function pathFromParams(params) {
  const slug = params?.slug;
  return Array.isArray(slug) ? slug.join('/') : '';
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const path = pathFromParams(resolvedParams);
  const item = titlesByPath[path];

  if (item) {
    return {
      ...item,
      alternates: { canonical: `/${path}` }
    };
  }

  if (path.startsWith('events/')) {
    return {
      title: 'Обучение и мероприятия HR Lider',
      description:
        'Программа обучения HR Lider для работодателей, кадровиков, HR-специалистов и членов согласительных комиссий.',
      alternates: { canonical: `/${path}` }
    };
  }

  if (path.startsWith('articles/')) {
    return {
      title: 'Материал HR Lider о кадровом порядке и трудовых спорах',
      description:
        'Экспертный материал HR Lider для работодателей Казахстана о кадровых документах, согласительной комиссии, HR-аудите и трудовых рисках.',
      alternates: { canonical: `/${path}` }
    };
  }

  return {
    title: 'HR Lider',
    description:
      'HR Lider: обучение согласительных комиссий, HR-аудит и кадровое сопровождение работодателей в Казахстане.',
    alternates: { canonical: `/${path}` },
    robots: {
      index: false,
      follow: true
    }
  };
}

export default function SpaRoute() {
  return <SpaApp />;
}
