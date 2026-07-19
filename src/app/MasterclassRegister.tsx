import { useState } from "react";
import { Link } from "react-router-dom";

export default function MasterclassRegister() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    workplace: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");

    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim()) {
      setMessage("Заполните ФИО, Email и телефон");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setMessage("Введите корректный Email");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/masterclass-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Ошибка сохранения");
      }

      setMessage("Регистрация на мастер-класс успешно отправлена");
      setForm({
        full_name: "",
        email: "",
        phone: "",
        workplace: "",
      });
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-5 md:p-8">
        <Link
          to="/"
          className="mb-6 inline-flex text-sm text-[#B8A16A] hover:text-[#0A2A3A]"
        >
          ← Назад на сайт
        </Link>

        <h1 className="text-2xl md:text-4xl font-bold mb-3 text-center text-[#0A2A3A]">
          Регистрация на мастер-класс
        </h1>
        <p className="mb-8 text-center text-sm text-[#1A2A36]/70">
          Отдельная форма для участия в мастер-классе
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="ФИО"
            className="w-full min-w-0 border p-4 rounded-xl"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full min-w-0 border p-4 rounded-xl"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Телефон"
            className="w-full min-w-0 border p-4 rounded-xl"
          />

          <input
            name="workplace"
            value={form.workplace}
            onChange={handleChange}
            placeholder="Место работы / должность (опционально)"
            className="w-full min-w-0 border p-4 rounded-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B8A16A] text-[#0A2A3A] p-4 rounded-xl transition hover:bg-[#A8925E] disabled:opacity-70"
          >
            {loading ? "Отправка..." : "Зарегистрироваться на мастер-класс"}
          </button>

          {message && <div className="text-center mt-4">{message}</div>}
        </form>
      </div>
    </div>
  );
}
