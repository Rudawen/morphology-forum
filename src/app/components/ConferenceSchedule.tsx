import {
  BookOpenCheck,
  CalendarDays,
  Coffee,
  Info,
  MessageCircle,
  Mic2,
  Utensils,
} from 'lucide-react';

type ProgramItem =
  | {
      kind: 'section';
      time: string;
      title: string;
      presidium: string;
    }
  | {
      kind: 'talk';
      time: string;
      number: number;
      speaker: string;
      title: string;
    }
  | {
      kind: 'service' | 'discussion' | 'break' | 'meal' | 'masterclass';
      time: string;
      title: string;
      description?: string;
    };

type SpeakerProfile = {
  fullName: string;
  credentials: string;
};

const speakerProfiles: Record<string, SpeakerProfile> = {
  'Кононов А.В.': {
    fullName: 'Кононов Алексей Владимирович',
    credentials:
      'д.м.н., профессор, заслуженный деятель науки РФ, заведующий кафедрой патологической анатомии Омского государственного университета, главный внештатный специалист по патологической анатомии в Сибирском федеральном округе, лауреат премии А.И. Струкова «За лучшие научные исследования по патологической анатомии», почётный член Российского общества патологоанатомов. Омск.',
  },
  'Шиманская А.Г.': {
    fullName: 'Шиманская Анна Геннадьевна',
    credentials:
      'к.м.н., доцент кафедры патологической анатомии Омского государственного университета, заведующая патологоанатомическим отделением Западно-Сибирского медицинского центра ФМБА России. Омск.',
  },
  'Евтушенко Д.А.': {
    fullName: 'Евтушенко Дмитрий Андреевич',
    credentials:
      'врач-эндоскопист высшей квалификационной категории, заведующий эндоскопическим отделением ГВКГ им. академика Н.Н. Бурденко. Москва.',
  },
  'Гриневич В.Б.': {
    fullName: 'Гриневич Владимир Борисович',
    credentials:
      'д.м.н., профессор, полковник медицинской службы, заведующий 2-й кафедрой терапии (усовершенствования врачей) Военно-медицинской академии им. С.М. Кирова, вице-президент Научного общества гастроэнтерологов России — президент Панкреатического клуба, главный гастроэнтеролог Министерства обороны РФ. Санкт-Петербург.',
  },
  'Завалишина Л.Э.': {
    fullName: 'Завалишина Лариса Эдуардовна',
    credentials:
      'д.б.н., профессор кафедры патологической анатомии Российской медицинской академии непрерывного последипломного образования. Москва.',
  },
  'Кутина Н.И.': {
    fullName: 'Кутина Ника Игоревна',
    credentials:
      'врач-патологоанатом патологоанатомического отделения ФГБУ «НМИЦ онкологии им. Н.Н. Петрова». Санкт-Петербург.',
  },
  'Артемьева А.С.': {
    fullName: 'Артемьева Анна Сергеевна',
    credentials:
      'к.м.н., член Правления РООУ, врач-патологоанатом, руководитель научной лаборатории морфологии опухолей ФГБУ «НМИЦ онкологии им. Н.Н. Петрова». Санкт-Петербург.',
  },
  'Имянитов Е.Н.': {
    fullName: 'Имянитов Евгений Наумович',
    credentials:
      'член-корреспондент РАН, д.м.н., профессор, руководитель лаборатории молекулярной онкологии и отдела биологии опухолевого роста ФГБУ «НМИЦ онкологии им. Н.Н. Петрова», заведующий кафедрой медицинской генетики Педиатрического медицинского университета, профессор кафедры онкологии СЗГМУ им. И.И. Мечникова, отличник здравоохранения РФ. Санкт-Петербург.',
  },
  'Раскин Г.А.': {
    fullName: 'Раскин Григорий Александрович',
    credentials:
      'д.м.н., профессор, заместитель главного врача по лабораторной медицине, врач-патологоанатом Медицинского института им. Березина Сергея, главный специалист по патоморфологии ГБУЗ СПб «Городской клинический онкологический диспансер», профессор кафедры онкологии Медицинского института Санкт-Петербургского государственного университета. Санкт-Петербург.',
  },
  'Друй А.Е.': {
    fullName: 'Друй Александр Евгеньевич',
    credentials:
      'д.м.н., заведующий лабораторией молекулярной онкологии, доцент кафедры патологической анатомии и клинической лабораторной диагностики ФГБУ «НМИЦ ДГОИ им. Дмитрия Рогачева» Минздрава России. Москва.',
  },
  'Вторушин С.В.': {
    fullName: 'Вторушин Сергей Владимирович',
    credentials:
      'д.м.н., профессор, заместитель директора по науке и трансляционной медицине, руководитель отделения общей и молекулярной патологии НИИ онкологии Томского национального исследовательского медицинского центра, профессор кафедры патологической анатомии ФГБОУ ВО СибГМУ Минздрава России. Томск.',
  },
  'Кисляков А.Н.': {
    fullName: 'Кисляков Алексей Николаевич',
    credentials:
      'заведующий патологоанатомическим отделением ГБУЗ «Морозовская детская городская клиническая больница ДЗМ», обладатель статуса «Московский врач», врач высшей квалификационной категории. Москва.',
  },
  'Богатырева Н.Н.': {
    fullName: 'Богатырева Нина Николаевна',
    credentials:
      'врач-патологоанатом патологоанатомического отделения ГБУЗ «Морозовская детская городская клиническая больница ДЗМ». Москва.',
  },
  'Шарлай А.С.': {
    fullName: 'Шарлай Анастасия Сергеевна',
    credentials:
      'к.м.н., врач-лабораторный генетик патологоанатомического отделения ФГБУ «НМИЦ ДГОИ им. Дмитрия Рогачева» Минздрава России. Москва.',
  },
  'Скобеев Д.А.': {
    fullName: 'Скобеев Дмитрий Александрович',
    credentials:
      'заведующий молекулярно-биологической лабораторией, врач-патологоанатом, врач клинической лабораторной диагностики ГБУЗ «Морозовская детская городская клиническая больница ДЗМ». Москва.',
  },
  'Коновалов Д.М.': {
    fullName: 'Коновалов Дмитрий Михайлович',
    credentials:
      'доцент, к.м.н., заведующий патологоанатомическим отделением ФГБУ «НМИЦ ДГОИ им. Дмитрия Рогачева» Минздрава России. Москва.',
  },
};

const conferenceProgram: ProgramItem[] = [
  {
    kind: 'service',
    time: '08:30–09:30',
    title: 'Регистрация участников. Приветственный кофе-брейк',
  },
  {
    kind: 'service',
    time: '09:30–09:45',
    title: 'Открытие конференции',
  },
  {
    kind: 'section',
    time: '09:45–11:00',
    title: 'Секция №1: Актуальные вопросы патоморфологии',
    presidium: 'Кононов А.В., Павлинов Г.Б., Гриневич В.Б.',
  },
  {
    kind: 'talk',
    time: '09:45–10:05',
    number: 1,
    speaker: 'Кононов А.В.',
    title: 'Атрофический гастрит: нозологическая идентификация и предикция опухолевого роста',
  },
  {
    kind: 'talk',
    time: '10:05–10:20',
    number: 2,
    speaker: 'Шиманская А.Г.',
    title:
      'Эпителиальные дисплазии слизистой оболочки желудка: проблема патологоанатомической диагностики (B. Morson et al., 1980 – WHO-2026)',
  },
  {
    kind: 'talk',
    time: '10:20–10:35',
    number: 3,
    speaker: 'Евтушенко Д.А.',
    title: 'Хронический гастрит. Взгляд эндоскописта.',
  },
  {
    kind: 'talk',
    time: '10:35–10:50',
    number: 4,
    speaker: 'Гриневич В.Б.',
    title: 'Путь пациента с хроническим гастритом. Взгляд гастроэнтеролога.',
  },
  {
    kind: 'discussion',
    time: '10:50–11:00',
    title: 'Дискуссия, вопросы-ответы',
  },
  {
    kind: 'break',
    time: '11:00–11:15',
    title: 'Короткий перерыв',
  },
  {
    kind: 'section',
    time: '11:15–12:30',
    title: 'Секция №2: Онкопатология',
    presidium: 'Артемьева А.С., Завалишина Л.Э.',
  },
  {
    kind: 'talk',
    time: '11:15–11:30',
    number: 5,
    speaker: 'Завалишина Л.Э.',
    title: 'Преаналитика в эпоху молекулярной патологии',
  },
  {
    kind: 'talk',
    time: '11:30–11:45',
    number: 6,
    speaker: 'Кутина Н.И.',
    title:
      'Современные требования к макроскопическому исследования и вырезке операционного материала при опухолях',
  },
  {
    kind: 'talk',
    time: '11:45–12:15',
    number: 7,
    speaker: 'Артемьева А.С.',
    title: 'Дифференциальная диагностика меланоцитарных опухолей кожи',
  },
  {
    kind: 'discussion',
    time: '12:15–12:30',
    title: 'Дискуссия, вопросы-ответы',
  },
  {
    kind: 'meal',
    time: '12:30–13:30',
    title: 'Обед',
  },
  {
    kind: 'talk',
    time: '13:30–13:45',
    number: 8,
    speaker: 'Имянитов Е.Н.',
    title:
      'Новые геномные биомаркеры для пациентов с HR+ РМЖ. В поисках альтераций сигнального пути AKT',
  },
  {
    kind: 'talk',
    time: '13:45–14:00',
    number: 9,
    speaker: 'Раскин Г.А.',
    title:
      'Новое значение известного биомаркера: PD-L1 при резектабельном раке желудка и мТНРМЖ',
  },
  {
    kind: 'section',
    time: '14:00–15:20',
    title: 'Секция №3: Онкопатология',
    presidium: 'Раскин Г.А., Вторушин С.В., Имянитов Е.Н.',
  },
  {
    kind: 'talk',
    time: '14:00–14:15',
    number: 10,
    speaker: 'Имянитов Е.Н.',
    title: 'Чем молекулярная генетика может помочь патологоанатому?',
  },
  {
    kind: 'talk',
    time: '14:15–14:30',
    number: 11,
    speaker: 'Друй А.Е.',
    title: 'Чем эпигенетика может помочь патоморфологу?',
  },
  {
    kind: 'talk',
    time: '14:30–14:45',
    number: 12,
    speaker: 'Вторушин С.В.',
    title: 'Практическое применение молекулярной генетики в гинекологических опухолях',
  },
  {
    kind: 'talk',
    time: '14:45–15:00',
    number: 13,
    speaker: 'Раскин Г.А.',
    title: 'МГИ и эпигенетика в повседневной диагностике опухолей мягких тканей и костей',
  },
  {
    kind: 'discussion',
    time: '15:00–15:20',
    title: 'Дискуссия, вопросы-ответы',
  },
  {
    kind: 'break',
    time: '15:20–15:35',
    title: 'Короткий перерыв',
  },
  {
    kind: 'section',
    time: '15:35–16:50',
    title: 'Секция №4: Детская патоморфология',
    presidium: 'Коновалов Д.М., Кисляков А.Н., Бучака А.С.',
  },
  {
    kind: 'talk',
    time: '15:35–15:50',
    number: 14,
    speaker: 'Кисляков А.Н.',
    title: 'Глиомы высокой степени злокачественности у детей.',
  },
  {
    kind: 'talk',
    time: '15:50–16:05',
    number: 15,
    speaker: 'Богатырева Н.Н.',
    title: 'Глиомы низкой степени злокачественности у детей.',
  },
  {
    kind: 'talk',
    time: '16:05–16:20',
    number: 16,
    speaker: 'Шарлай А.С.',
    title: 'Роль FISH-диагностики в детской онкологии.',
  },
  {
    kind: 'talk',
    time: '16:20–16:35',
    number: 17,
    speaker: 'Скобеев Д.А.',
    title: 'Гистомолекулярный подход в диагностике опухолей ЦНС у детей.',
  },
  {
    kind: 'talk',
    time: '16:35–16:50',
    number: 18,
    speaker: 'Коновалов Д.М.',
    title: 'Интегративный морфо-молекулярный принцип диагностики опухолей у детей.',
  },
  {
    kind: 'service',
    time: '16:50–17:00',
    title: 'Закрытие конференции',
    description: 'Подведение итогов',
  },
  {
    kind: 'masterclass',
    time: '17:00–18:30',
    title: 'Мастер-класс по формулировке патологоанатомических заключений в онкопатологии',
    description: 'Артемьева А.С., Павлинов Г.Б.',
  },
];

const detailStyles = {
  service: {
    icon: CalendarDays,
    wrapper: 'border-[#D7E1E7] bg-white',
    iconBox: 'bg-[#0A2A3A]/8 text-[#0A2A3A]',
  },
  discussion: {
    icon: MessageCircle,
    wrapper: 'border-[#D7E1E7] bg-white',
    iconBox: 'bg-[#0A2A3A]/8 text-[#0A2A3A]',
  },
  break: {
    icon: Coffee,
    wrapper: 'border-[#E0D5B7] bg-[#F5F0E4]',
    iconBox: 'bg-[#B8A16A]/18 text-[#8D783F]',
  },
  meal: {
    icon: Utensils,
    wrapper: 'border-[#E0D5B7] bg-[#F5F0E4]',
    iconBox: 'bg-[#B8A16A]/18 text-[#8D783F]',
  },
  masterclass: {
    icon: BookOpenCheck,
    wrapper: 'border-[#B8A16A] bg-[#F5F0E4]',
    iconBox: 'bg-[#B8A16A] text-[#0A2A3A]',
  },
} as const;

export function ConferenceSchedule() {
  return (
    <section id="conference-program" className="bg-white px-4 py-16 scroll-mt-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[#9A844E]">
            2 октября 2026 года
          </p>
          <h2 className="mb-3 text-3xl text-[#0A2A3A] md:text-4xl">Подробная программа конференции</h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#1A2A36]/70 md:text-base">
            Регистрация начинается в 08:30. Основная программа включает четыре научные секции и 18
            докладов, после закрытия конференции состоится мастер-класс.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-3 overflow-hidden rounded-xl border border-[#D7E1E7] bg-[#F8F9FA] text-center shadow-sm">
          <ProgramFact value="08:30–18:30" label="время программы" />
          <ProgramFact value="4" label="научные секции" />
          <ProgramFact value="18" label="докладов" />
        </div>

        <ol className="space-y-3">
          {conferenceProgram.map((item, index) => (
            <li key={`${item.time}-${item.kind}-${index}`}>
              {item.kind === 'section' ? (
                <SectionRow item={item} />
              ) : item.kind === 'talk' ? (
                <TalkRow item={item} />
              ) : (
                <DetailRow item={item} />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProgramFact({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-[#D7E1E7] px-2 py-4 last:border-r-0 md:px-5">
      <p className="text-sm font-semibold text-[#0A2A3A] md:text-lg">{value}</p>
      <p className="mt-1 text-[11px] leading-tight text-[#1A2A36]/60 md:text-sm">{label}</p>
    </div>
  );
}

function SectionRow({ item }: { item: Extract<ProgramItem, { kind: 'section' }> }) {
  return (
    <div className="rounded-xl bg-[#0A2A3A] p-5 text-white shadow-sm md:flex md:items-start md:gap-6 md:p-6">
      <p className="mb-3 shrink-0 text-sm font-semibold text-[#DCC98D] md:mb-0 md:w-28 md:pt-1">
        {item.time}
      </p>
      <div>
        <h3 className="mb-2 text-lg leading-snug text-white md:text-xl">{item.title}</h3>
        <p className="text-sm leading-relaxed text-white/75">
          <span className="font-medium text-[#DCC98D]">Президиум:</span> {item.presidium}
        </p>
      </div>
    </div>
  );
}

function TalkRow({ item }: { item: Extract<ProgramItem, { kind: 'talk' }> }) {
  const profile = speakerProfiles[item.speaker];

  return (
    <article
      className="group rounded-xl border border-[#D7E1E7] bg-white p-4 shadow-sm transition-colors hover:border-[#B8A16A] focus:border-[#B8A16A] focus:outline-none focus:ring-2 focus:ring-[#B8A16A]/25 md:flex md:gap-6 md:p-5"
      tabIndex={0}
      aria-label={`${item.title}. Спикер: ${profile?.fullName ?? item.speaker}. Наведите или нажмите, чтобы прочитать информацию о спикере.`}
    >
      <p className="mb-3 shrink-0 text-sm font-semibold text-[#9A844E] md:mb-0 md:w-28 md:pt-1">
        {item.time}
      </p>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#B8A16A]/15 px-2.5 py-1 text-xs font-semibold text-[#806D38]">
            Доклад {item.number}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A2A3A]">
            <Mic2 className="h-4 w-4 text-[#B8A16A]" aria-hidden="true" />
            {item.speaker}
          </span>
          {profile ? (
            <span className="hidden items-center gap-1 text-xs text-[#806D38] md:inline-flex">
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              О спикере
            </span>
          ) : null}
        </div>
        <p className="text-sm leading-relaxed text-[#1A2A36] md:text-base">{item.title}</p>
        {profile ? (
          <>
            <div className="hidden grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:mt-4 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus:mt-4 group-focus:grid-rows-[1fr] group-focus:opacity-100 md:grid">
              <div className="overflow-hidden">
                <SpeakerDetails profile={profile} />
              </div>
            </div>
            <details className="mt-3 rounded-lg border border-[#E0D5B7] bg-[#F5F0E4] md:hidden">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-[#806D38]">
                <Info className="h-4 w-4" aria-hidden="true" />
                О спикере
              </summary>
              <div className="border-t border-[#E0D5B7] p-3">
                <p className="mb-1 text-sm font-semibold text-[#0A2A3A]">{profile.fullName}</p>
                <p className="text-sm leading-relaxed text-[#1A2A36]/75">{profile.credentials}</p>
              </div>
            </details>
          </>
        ) : null}
      </div>
    </article>
  );
}

function SpeakerDetails({ profile }: { profile: SpeakerProfile }) {
  return (
    <div className="rounded-lg border border-[#E0D5B7] bg-[#F5F0E4] p-4">
      <p className="mb-1 text-sm font-semibold text-[#0A2A3A]">{profile.fullName}</p>
      <p className="text-sm leading-relaxed text-[#1A2A36]/75">{profile.credentials}</p>
    </div>
  );
}

function DetailRow({ item }: { item: Exclude<ProgramItem, { kind: 'section' | 'talk' }> }) {
  const style = detailStyles[item.kind];
  const Icon = style.icon;

  return (
    <article className={`rounded-xl border p-4 shadow-sm md:flex md:items-center md:gap-6 md:p-5 ${style.wrapper}`}>
      <p className="mb-3 shrink-0 text-sm font-semibold text-[#806D38] md:mb-0 md:w-28">{item.time}</p>
      <div className="flex min-w-0 items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.iconBox}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-base leading-snug text-[#0A2A3A] md:text-lg">{item.title}</h3>
          {item.description ? (
            <p className="mt-1 text-sm leading-relaxed text-[#1A2A36]/70">{item.description}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
