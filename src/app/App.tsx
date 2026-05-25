import { CountdownTimer } from './components/CountdownTimer';
import { ProgramCard } from './components/ProgramCard';
import { Microscope, Dna, Brain, Monitor, Users, Database, GraduationCap, FlaskConical, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import logoSvg from '../imports/gemini-2.svg';

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

import Register from './Register';
function HomePage() {
  const forumDate = new Date('2026-10-02T09:00:00');

  const programs = [
    {
      icon: Microscope,
      title: 'Современная онкопатология',
      description: 'Биомаркеры, PD-L1, HER2, MSI, новые классификации ВОЗ'
    },
    {
      icon: Brain,
      title: 'Детская патология',
      description: 'Биомаркеры, классификация и клиника'
    },
    {
      icon: Dna,
      title: 'Молекулярная и генетическая диагностика',
      description: 'NGS, жидкостная биопсия, FISH, ПЦР в морфологии'
    },
    {
      icon: Monitor,
      title: 'Цифровая патология и ИИ',
      description: 'Полнослайдовое сканирование, алгоритмы помощи врачу'
    },
    {
      icon: Users,
      title: 'Редкие опухоли и сложные случаи',
      description: 'Междисциплинарный консилиум, разбор ошибок'
    },
    {
      icon: Database,
      title: 'Преаналитика',
      description: 'Качество забора, фиксации, хранения тканей'
    },
    {
      icon: GraduationCap,
      title: 'Школа молодого морфолога',
      description: 'Карьера, наставники и обучение'
    },
    {
      icon: FlaskConical,
      title: 'Мастер-класс: «Артефакт vs патология»',
      description: 'Практическое занятие с препаратами'
    }
  ];

  const participants = [
    { title: 'Патологоанатомам и гистологам', description: 'новые критерии диагнозов, редкие препараты' },
    { title: 'Судмедэкспертам', description: 'современные методы определения причины смерти' },
    { title: 'Онкологам', description: 'как читать патологоанатомический заключение для выбора терапии' },
    { title: 'Молекулярным генетикам', description: 'интеграция геномики в рутинную морфологию' },
    { title: 'Биологам и исследователям', description: 'представить свои данные, найти коллаборации' },
    { title: 'Ординаторам и студентам', description: 'бесплатная регистрация, практическая часть с клиническми случаями' }
  ];

  const faqItems = [
    { q: 'Где встречаемся?', a: 'В центре г.Санкт-Петербург' },
    { q: 'Будет ли запись мероприятия?', a: 'Нет, только практика и живое общение' },
    { q: 'Сколько стоит участие?', a: 'Бесплатно! *при регистрации до 1 октября 2026г.' },
    { q: 'Меня отпустят с работы?', a: 'Да, свяжитесь с нами для получения именного приглашения' },
   
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1760381792929-4e899bffc823?q=80&w=1080')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2F44]/90 to-[#0A2F44]/70" />

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-center gap-6 mb-4">
            <img
              src={logoSvg}
              alt="Логотип"
              className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 brightness-0 invert"
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl text-white tracking-wide">
              ПЕТЕРБУРГСКИЙ<br />МОРФОЛОГИЧЕСКИЙ<br />ФОРУМ
            </h1>
          </div>
          <p className="text-lg md:text-xl text-white/90 mb-2 max-w-3xl mx-auto">
            Для патологоанатомов, судмедэкспертов, онкологов, морфологов, гистологов, биологов и молекулярных генетиков
          </p>
          <p className="text-xl md:text-2xl text-white mb-2">2 октября 2026 года</p>
          <p className="text-lg text-white/90 mb-8">Очно в г.Санкт-Петербурге</p>

          <div className="mb-8">
            <CountdownTimer targetDate={forumDate} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
  <Link
    to="/register"
    className="bg-[#D94F30] hover:bg-[#D94F30]/90 text-white px-8 py-4 rounded-lg transition-colors"
  >
    Зарегистрироваться бесплатно
  </Link>
</div>

          <p className="text-xs text-white/80 max-w-2xl mx-auto">
            Сайт предназначен для медицинских работников и исследователей. Нажимая «Продолжить», вы подтверждаете, что являетесь специалистом в области патологической анатомии, судебной медицины, онкологии, морфологии, гистологии, биологии или молекулярной генетики.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-8 text-[#0A2F44]">О форуме</h2>
          <div className="text-base md:text-lg text-[#1A2A36] leading-relaxed space-y-4">
            <p className="text-justify">
              Петербургский Морфологический Форум — это первое междисциплинарное мероприятие в Санкт-Петербурге, объединяющее патологоанатомов, судебно-медицинских экспертов, онкологов, морфологов, гистологов, биологов и молекулярных генетиков.
            </p>
            <p className="text-justify">
              Основная цель — обсуждение сложных диагностических случаев, стандартизация морфологических заключений, внедрение новых молекулярно-генетических методов и цифровой патологии.
            </p>
            <p className="text-justify">
              Мы создаём пространство, где говорят на одном языке ради главного — точного диагноза и эффективного лечения пациента.
            </p>
          </div>
        </div>
      </section>

      {/* Scientific Program */}
      <section className="py-16 px-4 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-12 text-[#0A2F44]">Научная программа</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <ProgramCard
                key={index}
                icon={program.icon}
                title={program.title}
                description={program.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Participate */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-12 text-[#0A2F44]">Кому участвовать?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {participants.map((participant, index) => (
              <div key={index} className="bg-[#F8F9FA] p-6 rounded-lg border-l-4 border-[#2B6C8F]">
                <h3 className="text-lg mb-2 text-[#0A2F44]">{participant.title}</h3>
                <p className="text-sm text-[#1A2A36]/70">— {participant.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Dates */}
      <section className="py-16 px-4 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-12 text-[#0A2F44]">Важные даты</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
              <DateItem icon={Calendar} title="Начало регистрации" date="25 мая 2026 года" />
              <DateItem icon={Calendar} title="Окончание регистрации" date="1 октября 2026" />
              <DateItem icon={Calendar} title="Дата форума" date="2 октября 2026 года" highlight large />
            </div>
          </div>
        </div>
      </section>

      {/* Registration Packages */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <button className="bg-[#D94F30] hover:bg-[#D94F30]/90 text-white text-xl px-16 py-5 rounded-lg transition-colors shadow-md">
            Зарегистрироваться
          </button>
        </div>
      </section>

      {/* Abstract Submission */}
      <section className="py-16 px-4 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-8 text-[#0A2F44]">Подать клинический случай или кейс</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-base mb-6 text-[#1A2A36]">
              Приглашаем врачей и исследователей представить редкие морфологические наблюдения, сложные дифференциальные диагнозы или случаи из судебно-гистологической практики.
            </p>
            <div className="mb-6">
              <h3 className="text-lg mb-3 text-[#0A2F44]">Требования:</h3>
              <ul className="list-disc list-inside space-y-2 text-[#1A2A36]">
                <li>Клинические данные без личной информации пациента</li>
                <li>1–5 изображений (микро- макрофото)</li>
                <li>Клинико-морфологическое заключение</li>
              </ul>
            </div>
            <button className="bg-[#D94F30] hover:bg-[#D94F30]/90 text-white px-8 py-3 rounded-lg transition-colors">
              Подать случай
            </button>
          </div>
        </div>
      </section>

      {/* Organizers */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-12 text-[#0A2F44]">Организаторы и партнёры</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl mb-4 text-[#0A2F44]">Организаторы:</h3>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-[#0A2F44]">Научная поддержка:</h3>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-12 text-[#0A2F44]">Вопрос-ответ</h2>
          <Accordion.Root type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <Accordion.Item
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-[#E2E8F0]"
              >
                <Accordion.Trigger className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F8F9FA] transition-colors group">
                  <span className="text-base text-[#0A2F44]">{item.q}</span>
                  <ChevronDown className="w-5 h-5 text-[#2B6C8F] transition-transform group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-4 text-[#1A2A36]/80">
                  {item.a}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* Contact & Venue */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-12 text-[#0A2F44]">Контакты и место проведения</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl mb-4 text-[#0A2F44]">Место проведения:</h3>
              <div className="space-y-2 text-[#1A2A36] mb-6">
                <p>Отель «Ренартисс Исаакий Санкт-Петербург 5* »</p>
                <p>190121, Россия, Санкт-Петербург, Почтамтская, 4</p>
                <p className="text-sm text-[#1A2A36]/70">(метро «Адмиралтейская»)</p>
              </div>

              <iframe
  src="https://www.google.com/maps?q=Почтамтская+4+Санкт-Петербург&output=embed"
  width="100%"
  height="300"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  className="rounded-lg"
></iframe>

              <p className="mt-4 text-sm text-[#1A2A36]/80">
                <strong>______</strong> ______
              </p>
            </div>

            <div>
              <h3 className="text-xl mb-4 text-[#0A2F44]">Контакты:</h3>
              <div className="space-y-4">
                <ContactItem icon={Mail} text="pmf-info@yandex.ru" />
                <ContactItem icon={Phone} text="+7 (981) 861-91-91  - Павлинов Г.Б." />
                <ContactItem icon={Phone} text="+7 (952) 266-51-99  - Короткова Т.В. " />
                <ContactItem icon={MapPin} text="Telegram: @morpho_forum" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A2F44] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm">
          <div className="flex justify-center mb-4">
            <img
              src={logoSvg}
              alt="Логотип"
              className="w-16 h-16 opacity-80 brightness-0 invert"
            />
          </div>
          <p className="mb-2">18+. Для медицинских специалистов.</p>
          <p className="mb-4">
            <a href="#" className="hover:underline">Политика конфиденциальности</a>
            {' | '}
            <a href="#" className="hover:underline">Использование cookies</a>
          </p>
          <p>© 2026 Петербургский морфологический форум</p>
        </div>
      </footer>
    </div>
  );
}

function DateItem({ icon: Icon, title, date, highlight = false, large = false }: { icon: any; title: string; date: string; highlight?: boolean; large?: boolean }) {
  return (
    <div className={`p-6 ${highlight ? 'bg-[#2B6C8F]/5' : ''}`}>
      <div className="flex items-start gap-3">
        <Icon className={`${large ? 'w-7 h-7' : 'w-5 h-5'} mt-1 ${highlight ? 'text-[#D94F30]' : 'text-[#2B6C8F]'}`} />
        <div>
          <h3 className={`${large ? 'text-xl' : 'text-base'} mb-1 text-[#0A2F44]`}>{title}</h3>
          <p className={`${large ? 'text-lg font-semibold text-[#D94F30]' : 'text-sm text-[#1A2A36]/70'}`}>{date}</p>
        </div>
      </div>
    </div>
  );
}

function PackageCard({ title, price, features, highlighted = false }: {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean
}) {
  return (
    <div className={`p-8 rounded-lg ${highlighted ? 'bg-[#2B6C8F] text-white shadow-lg scale-105' : 'bg-white border border-[#E2E8F0]'}`}>
      <h3 className={`text-xl mb-2 ${highlighted ? 'text-white' : 'text-[#0A2F44]'}`}>{title}</h3>
      <div className={`text-3xl mb-6 ${highlighted ? 'text-white' : 'text-[#D94F30]'}`}>{price}</div>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className={`flex items-start gap-2 text-sm ${highlighted ? 'text-white/90' : 'text-[#1A2A36]'}`}>
            <span className="mt-1">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactItem({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-3 text-[#1A2A36]">
      <div className="w-10 h-10 bg-[#2B6C8F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[#2B6C8F]" />
      </div>
      <span>{text}</span>
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}