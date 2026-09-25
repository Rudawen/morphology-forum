import { CalendarHeart, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MasterclassRegister() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] p-4 sm:p-6">
      <main className="w-full max-w-2xl rounded-2xl bg-white p-6 text-center shadow-xl md:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#B8A16A]/15">
          <CalendarHeart className="h-8 w-8 text-[#9A844E]" aria-hidden="true" />
        </div>

        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#9A844E]">
          Петербургский Морфологический Форум
        </p>
        <h1 className="mb-5 text-3xl font-bold text-[#0A2A3A] md:text-4xl">
          Регистрация на мастер-класс закрыта
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-[#1A2A36]/75 md:text-lg">
          К сожалению, регистрация на мастер-класс завершена. Мы будем рады видеть всех желающих
          на Петербургском Морфологическом Форуме в 2027 году.
        </p>

        <div className="my-7 rounded-xl border border-[#E0D5B7] bg-[#F5F0E4] p-5 text-left sm:flex sm:items-start sm:gap-4">
          <Video className="mx-auto mb-3 h-7 w-7 shrink-0 text-[#9A844E] sm:mx-0 sm:mb-0" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-[#1A2A36]/80 md:text-base">
            После мероприятия мы опубликуем анонс записи для тех, у кого не получилось
            присутствовать лично. Следите за новостями форума.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#B8A16A] px-6 py-4 font-medium text-[#0A2A3A] transition hover:bg-[#A8925E] sm:w-auto"
        >
          Вернуться на сайт
        </Link>
      </main>
    </div>
  );
}
