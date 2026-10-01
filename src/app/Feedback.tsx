import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';

const participationOptions = [
  'Предложить доклад',
  'Провести мастер-класс',
  'Стать партнёром форума',
  'Помочь в организации',
  'Получать новости форума',
];

type FeedbackForm = {
  rating: number;
  liked: string;
  improvements: string;
  next_topics: string;
  participation: string[];
  respondent_name: string;
  contact: string;
  organization: string;
  consent: boolean;
  website: string;
};

const initialForm: FeedbackForm = {
  rating: 0,
  liked: '',
  improvements: '',
  next_topics: '',
  participation: [],
  respondent_name: '',
  contact: '',
  organization: '',
  consent: false,
  website: '',
};

export default function Feedback() {
  const [form, setForm] = useState<FeedbackForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const hasContacts = useMemo(
    () => Boolean(form.respondent_name.trim() || form.contact.trim() || form.organization.trim()),
    [form.respondent_name, form.contact, form.organization],
  );

  const toggleParticipation = (option: string) => {
    setForm((current) => ({
      ...current,
      participation: current.participation.includes(option)
        ? current.participation.filter((item) => item !== option)
        : [...current.participation, option],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (form.rating < 1 || form.rating > 5) {
      setError('Пожалуйста, поставьте общую оценку форуму.');
      return;
    }

    if (hasContacts && !form.consent) {
      setError('Подтвердите согласие на обработку оставленных контактных данных.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Не удалось отправить анкету');
      }

      setSubmitted(true);
      setForm(initialForm);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Не удалось отправить анкету');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] p-4 sm:p-6">
        <main className="w-full max-w-2xl rounded-2xl bg-white p-7 text-center shadow-xl md:p-10">
          <CheckCircle2 className="mx-auto mb-5 h-16 w-16 text-[#9A844E]" aria-hidden="true" />
          <h1 className="mb-4 text-3xl font-bold text-[#0A2A3A]">Спасибо за обратную связь!</h1>
          <p className="mx-auto mb-7 max-w-xl leading-relaxed text-[#1A2A36]/75">
            Ваш ответ поможет сформировать программу следующего Петербургского Морфологического
            Форума. Если вы оставили контакты, организаторы смогут связаться с вами.
          </p>
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-8 sm:px-6 md:py-12">
      <main className="mx-auto w-full max-w-3xl">
        <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm text-[#8D7741] hover:text-[#0A2A3A]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Вернуться на сайт
        </Link>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 shadow-xl sm:p-8 md:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#B8A16A]/15">
              <MessageSquareText className="h-7 w-7 text-[#9A844E]" aria-hidden="true" />
            </div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[#9A844E]">
              Петербургский Морфологический Форум
            </p>
            <h1 className="mb-3 text-3xl font-bold text-[#0A2A3A] md:text-4xl">Поделитесь мнением</h1>
            <p className="mx-auto max-w-2xl leading-relaxed text-[#1A2A36]/72">
              Анкету можно заполнить анонимно. Имя и контакты не требуются и не сохраняются, если
              вы их не укажете самостоятельно.
            </p>
          </div>

          <fieldset className="mb-7">
            <legend className="mb-3 font-medium text-[#0A2A3A]">Как вы оцениваете форум в целом? *</legend>
            <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Оценка форума">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label key={rating} className="cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={form.rating === rating}
                    onChange={() => setForm((current) => ({ ...current, rating }))}
                    className="peer sr-only"
                    required
                  />
                  <span className="flex min-h-12 items-center justify-center rounded-xl border border-[#D9DEE3] text-lg text-[#0A2A3A] transition peer-checked:border-[#B8A16A] peer-checked:bg-[#F5F0E4] peer-checked:font-bold hover:border-[#B8A16A]">
                    {rating}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-[#1A2A36]/55">
              <span>Нужно улучшить</span>
              <span>Отлично</span>
            </div>
          </fieldset>

          <div className="space-y-6">
            <Field label="Что вам особенно понравилось?">
              <textarea
                value={form.liked}
                onChange={(event) => setForm((current) => ({ ...current, liked: event.target.value }))}
                maxLength={2000}
                rows={4}
                className="w-full rounded-xl border border-[#D9DEE3] p-4 outline-none transition focus:border-[#B8A16A] focus:ring-2 focus:ring-[#B8A16A]/20"
                placeholder="Доклады, организация, общение, мастер-класс…"
              />
            </Field>

            <Field label="Что можно улучшить?">
              <textarea
                value={form.improvements}
                onChange={(event) => setForm((current) => ({ ...current, improvements: event.target.value }))}
                maxLength={2000}
                rows={4}
                className="w-full rounded-xl border border-[#D9DEE3] p-4 outline-none transition focus:border-[#B8A16A] focus:ring-2 focus:ring-[#B8A16A]/20"
                placeholder="Будем благодарны за честные предложения"
              />
            </Field>

            <Field label="Какие темы и форматы вы хотели бы увидеть в следующем году?">
              <textarea
                value={form.next_topics}
                onChange={(event) => setForm((current) => ({ ...current, next_topics: event.target.value }))}
                maxLength={2000}
                rows={4}
                className="w-full rounded-xl border border-[#D9DEE3] p-4 outline-none transition focus:border-[#B8A16A] focus:ring-2 focus:ring-[#B8A16A]/20"
                placeholder="Темы докладов, разборы случаев, дискуссии, практические занятия…"
              />
            </Field>
          </div>

          <fieldset className="mt-8 rounded-2xl border border-[#E5DDC8] bg-[#FBF8F1] p-5 sm:p-6">
            <legend className="px-2 font-medium text-[#0A2A3A]">Хотели бы вы участвовать в форуме?</legend>
            <p className="mb-4 text-sm leading-relaxed text-[#1A2A36]/65">Можно выбрать несколько вариантов.</p>
            <div className="space-y-3">
              {participationOptions.map((option) => (
                <label key={option} className="flex cursor-pointer items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
                  <input
                    type="checkbox"
                    checked={form.participation.includes(option)}
                    onChange={() => toggleParticipation(option)}
                    className="mt-1 h-4 w-4 accent-[#9A844E]"
                  />
                  <span className="text-sm leading-relaxed text-[#1A2A36] sm:text-base">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <section className="mt-8 rounded-2xl border border-[#DDE3E8] p-5 sm:p-6">
            <h2 className="mb-2 text-xl font-semibold text-[#0A2A3A]">Контакты — только по желанию</h2>
            <p className="mb-5 text-sm leading-relaxed text-[#1A2A36]/65">
              Заполните этот блок, только если хотите, чтобы организаторы связались с вами по поводу
              участия или новостей форума.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={form.respondent_name}
                onChange={(event) => setForm((current) => ({ ...current, respondent_name: event.target.value }))}
                maxLength={160}
                className="min-w-0 rounded-xl border border-[#D9DEE3] p-4 outline-none transition focus:border-[#B8A16A]"
                placeholder="Имя"
              />
              <input
                value={form.organization}
                onChange={(event) => setForm((current) => ({ ...current, organization: event.target.value }))}
                maxLength={240}
                className="min-w-0 rounded-xl border border-[#D9DEE3] p-4 outline-none transition focus:border-[#B8A16A]"
                placeholder="Организация / должность"
              />
              <input
                value={form.contact}
                onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))}
                maxLength={240}
                className="min-w-0 rounded-xl border border-[#D9DEE3] p-4 outline-none transition focus:border-[#B8A16A] sm:col-span-2"
                placeholder="Email, телефон или Telegram"
              />
            </div>

            {hasContacts && (
              <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-[#1A2A36]/75">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => setForm((current) => ({ ...current, consent: event.target.checked }))}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#9A844E]"
                />
                <span>
                  Я добровольно оставляю контактные данные и согласен(на) на их обработку организаторами
                  форума исключительно для связи со мной.
                </span>
              </label>
            )}
          </section>

          <input
            type="text"
            name="website"
            value={form.website}
            onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {error && (
            <p className="mt-5 rounded-xl bg-red-50 p-4 text-center text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-[#B8A16A] px-6 py-4 font-medium text-[#0A2A3A] transition hover:bg-[#A8925E] disabled:cursor-wait disabled:opacity-65"
          >
            {loading ? 'Отправка…' : 'Отправить обратную связь'}
          </button>
        </form>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-medium text-[#0A2A3A]">{label}</span>
      {children}
    </label>
  );
}
