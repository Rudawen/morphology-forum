import { useEffect, useMemo, useState } from 'react';

type FeedbackResponse = {
  id: number;
  rating: number;
  liked: string;
  improvements: string;
  next_topics: string;
  participation: string;
  respondent_name: string;
  contact: string;
  organization: string;
  created_at: string;
};

function escapeCsv(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

export default function FeedbackAdmin() {
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const averageRating = useMemo(() => {
    if (!responses.length) return '—';
    return (responses.reduce((sum, item) => sum + item.rating, 0) / responses.length).toFixed(1);
  }, [responses]);

  const loadData = async () => {
    try {
      const response = await fetch('/feedback-responses');
      if (response.status === 401) {
        setAuthorized(false);
        return;
      }
      if (!response.ok) throw new Error('Не удалось загрузить ответы');
      setResponses(await response.json());
      setAuthorized(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить ответы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError('Неверный пароль');
        setLoading(false);
        return;
      }
      setPassword('');
      await loadData();
    } catch {
      setError('Ошибка входа');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/admin/logout', { method: 'POST' });
    setAuthorized(false);
    setResponses([]);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить этот ответ?')) return;
    const previous = responses;
    setResponses((current) => current.filter((item) => item.id !== id));
    const response = await fetch(`/feedback-responses/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      setResponses(previous);
      setError('Не удалось удалить ответ');
    }
  };

  const downloadCsv = () => {
    const headers = [
      'ID', 'Оценка', 'Понравилось', 'Улучшить', 'Темы 2027', 'Участие',
      'Имя', 'Контакт', 'Организация', 'Дата',
    ];
    const rows = responses.map((item) => [
      item.id, item.rating, item.liked, item.improvements, item.next_topics, item.participation,
      item.respondent_name, item.contact, item.organization, item.created_at,
    ]);
    const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCsv).join(';')).join('\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `pmf-feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!authorized && !loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] p-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="mb-2 text-2xl font-bold text-[#0A2A3A]">Обратная связь</h1>
          <p className="mb-6 text-sm text-[#1A2A36]/70">Закрытый просмотр ответов</p>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Пароль администратора"
            className="mb-4 w-full rounded-xl border border-[#E2E8F0] p-4"
          />
          <button type="submit" className="w-full rounded-xl bg-[#0A2A3A] p-4 text-white hover:bg-[#15384A]">
            Войти
          </button>
          {error && <p className="mt-4 text-center text-sm text-red-700">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0A2A3A]">Обратная связь о форуме</h1>
          <p className="mt-1 text-sm text-gray-600">
            Ответов: {responses.length} · Средняя оценка: {averageRating}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadCsv}
            disabled={!responses.length}
            className="rounded-lg bg-[#B8A16A] px-4 py-2 text-sm text-[#0A2A3A] disabled:opacity-50"
          >
            Скачать CSV
          </button>
          <button type="button" onClick={handleLogout} className="rounded-lg bg-white px-4 py-2 text-sm shadow">
            Выйти
          </button>
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p>Загрузка…</p>
      ) : responses.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center text-gray-600 shadow">Ответов пока нет.</div>
      ) : (
        <div className="w-full overflow-x-auto rounded-xl shadow">
          <table className="min-w-[1500px] w-full bg-white text-sm">
            <thead>
              <tr className="border-b bg-[#0A2A3A] text-white">
                {['ID', 'Оценка', 'Понравилось', 'Улучшить', 'Темы 2027', 'Участие', 'Имя', 'Контакт', 'Организация', 'Дата', ''].map((title) => (
                  <th key={title} className="p-3 text-left">{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((item) => (
                <tr key={item.id} className="border-b align-top">
                  <td className="p-3">{item.id}</td>
                  <td className="p-3 font-bold">{item.rating}/5</td>
                  <td className="max-w-xs whitespace-pre-wrap p-3">{item.liked || '—'}</td>
                  <td className="max-w-xs whitespace-pre-wrap p-3">{item.improvements || '—'}</td>
                  <td className="max-w-xs whitespace-pre-wrap p-3">{item.next_topics || '—'}</td>
                  <td className="max-w-xs whitespace-pre-wrap p-3">{item.participation || '—'}</td>
                  <td className="p-3">{item.respondent_name || 'Анонимно'}</td>
                  <td className="p-3">{item.contact || '—'}</td>
                  <td className="p-3">{item.organization || '—'}</td>
                  <td className="whitespace-nowrap p-3">{item.created_at}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
