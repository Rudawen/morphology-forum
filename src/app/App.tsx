import { useState } from 'react';
import { CountdownTimer } from './components/CountdownTimer';
import { ProgramCard } from './components/ProgramCard';
import { Microscope, Dna, Brain, Monitor, Users, Database, GraduationCap, FlaskConical, Calendar, Mail, Phone, X } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import logoSvg from '../imports/gemini-2.svg';
import logoMirus from '../imports/logo_mirus.png';
import heroBg from '../assets/hero-bg.jpg';
import invitationImage from './assets/invitation.jpg';
import invitationThumb from './assets/invitation-thumb.jpg';
import chirskyInvitation from './assets/chirsky-invitation.jpg';
import chirskyInvitationThumb from './assets/chirsky-invitation-thumb.jpg';
import chirskyInvitationPdf from './assets/chirsky-invitation.pdf';

import { Routes, Route, Link } from 'react-router-dom';
import Register from './Register';
import Admin from './Admin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}


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
      title: 'Гастроэнтерологи',
      description: 'Междисциплинарный подход к сложным случаям, биопсия ЖКТ, коллаборация с патоморфологом'
    }
  ];

  const participants = [
    { title: 'Патологоанатомам и гистологам', description: 'новые критерии диагнозов, редкие препараты' },
    { title: 'Судмедэкспертам', description: 'современные методы определения причины смерти' },
    { title: 'Онкологам', description: 'как читать патологоанатомическое заключение для выбора терапии' },
    { title: 'Молекулярным генетикам', description: 'интеграция геномики в рутинную морфологию' },
    { title: 'Биологам и исследователям', description: 'представить свои данные, найти коллаборации' },
    { title: 'Ординаторам и студентам', description: 'бесплатная регистрация, практическая часть с клиническими случаями' }
  ];

  const faqItems = [
    { q: 'Где встречаемся?', a: 'В центре г.Санкт-Петербург' },
    { q: 'Будет ли запись мероприятия?', a: 'Да, все будет на канале в Ютуб и Рутуб' },
    { q: 'Сколько стоит участие?', a: 'Бесплатно! *при регистрации до 1 октября 2026г.' },
    { q: 'Меня отпустят с работы?', a: 'Да, свяжитесь с нами для получения именного приглашения' },
   
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Hero Section */}
      <section className="relative min-h-[620px] md:h-[700px] flex items-center justify-center text-center py-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2F44]/90 to-[#0A2F44]/70" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-4">
            <img
              src={logoSvg}
              alt="Логотип"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 brightness-0 invert flex-shrink-0"
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-wide leading-tight">
              ПЕТЕРБУРГСКИЙ<br />МОРФОЛОГИЧЕСКИЙ<br />ФОРУМ
            </h1>
          </div>
          <p className="text-lg md:text-xl text-white/90 mb-2 max-w-3xl mx-auto">
            Междисциплинарная коллаборация с патологом
          </p>
          <p className="text-xl md:text-2xl text-white mb-2">2 октября 2026 года</p>
          <p className="text-lg text-white/90 mb-8">Очно в г.Санкт-Петербурге</p>

          <div className="mb-8">
            <CountdownTimer targetDate={forumDate} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
  <Link
    to="/register"
            className="w-full sm:w-auto bg-[#D94F30] hover:bg-[#D94F30]/90 text-white px-6 sm:px-8 py-4 rounded-lg transition-colors text-center"
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
              Основная цель — обсуждение актуальных вопросов онко-патологии, разбор интересных диагностических случаев, внедрение новых молекулярно-генетических методов и цифровой патологии.
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
              <p className="text-sm text-[#1A2A36]/70">{participant.description}</p>
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
              <DateItem icon={Calendar} title="Дата форума" date="2 октября 2026 года" highlight large />
            </div>
          </div>
          <InvitationPreview />
        </div>
      </section>

      {/* Registration Packages */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <Link
  to="/register"
  className="w-full sm:w-auto bg-[#D94F30] hover:bg-[#D94F30]/90 text-white text-base sm:text-xl px-6 sm:px-16 py-5 rounded-lg transition-colors shadow-md inline-block text-center"
>
  Зарегистрироваться
</Link>
        </div>
      </section>


      {/* Organizers */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-12 text-[#0A2F44]">Организаторы и партнёры</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] p-6">
              <h3 className="text-xl mb-4 text-[#0A2F44]">Организаторы:</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={logoMirus}
                  alt="МИРУС"
                  className="h-20 w-auto max-w-full object-contain"
                  loading="lazy"
                />
                <div>
                  <p className="text-lg text-[#0A2F44]">МИРУС</p>
                  <p className="text-sm text-[#1A2A36]/70">Первый организатор форума</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] p-6">
              <h3 className="text-xl mb-4 text-[#0A2F44]">Научная поддержка:</h3>
              <ExpertInvitationPreview />
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

function ExpertInvitationPreview() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full flex-col gap-4 rounded-lg border border-[#E2E8F0] bg-white p-3 text-left shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
        aria-label="Открыть приглашение от Вадима Семёновича Чирского"
      >
        <img
          src={chirskyInvitationThumb}
          alt="Приглашение от Вадима Семёновича Чирского"
          className="h-32 w-full rounded-md object-cover object-top sm:w-24"
          loading="lazy"
        />
        <div>
          <p className="text-base text-[#0A2F44]">
            Приглашение от Вадима Семёновича Чирского
          </p>
          <p className="mt-2 text-sm text-[#1A2A36]/70">
            Нажмите, чтобы открыть приглашение
          </p>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2F44]/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/95 p-3 text-[#0A2F44] shadow"
            aria-label="Закрыть приглашение"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="flex max-h-[92vh] max-w-[95vw] flex-col items-center gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={chirskyInvitation}
              alt="Приглашение от Вадима Семёновича Чирского"
              className="max-h-[84vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
            <a
              href={chirskyInvitationPdf}
              download
              className="rounded-lg bg-white px-4 py-2 text-sm text-[#2B6C8F] shadow hover:text-[#0A2F44]"
            >
              Скачать PDF
            </a>
          </div>
        </div>
      )}
    </>
  );
}

function InvitationPreview() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex flex-col items-center rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm transition hover:shadow-md"
          aria-label="Открыть приглашение форума"
        >
          <img
            src={invitationThumb}
            alt="Приглашение на Петербургский морфологический форум"
            className="w-full max-w-xs rounded-md"
            loading="lazy"
          />
          <span className="mt-3 text-sm text-[#2B6C8F]">Нажмите, чтобы открыть приглашение</span>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2F44]/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/95 p-3 text-[#0A2F44] shadow"
            aria-label="Закрыть приглашение"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={invitationImage}
            alt="Приглашение на Петербургский морфологический форум"
            className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

function DateItem({ icon: Icon, title, date, highlight = false, large = false }: { icon: any; title: string; date: string; highlight?: boolean; large?: boolean }) {
  return (
    <div className={`p-5 sm:p-6 ${highlight ? 'bg-[#2B6C8F]/5' : ''}`}>
      <div className="flex items-start gap-3">
        <Icon className={`${large ? 'w-7 h-7' : 'w-5 h-5'} mt-1 flex-shrink-0 ${highlight ? 'text-[#D94F30]' : 'text-[#2B6C8F]'}`} />
        <div>
          <h3 className={`${large ? 'text-xl' : 'text-base'} mb-1 text-[#0A2F44]`}>{title}</h3>
          <p className={`${large ? 'text-lg font-semibold text-[#D94F30]' : 'text-sm text-[#1A2A36]/70'}`}>{date}</p>
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-3 text-[#1A2A36]">
      <div className="w-10 h-10 bg-[#2B6C8F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[#2B6C8F]" />
      </div>
      <span className="min-w-0">{text}</span>
    </div>
  );
}
