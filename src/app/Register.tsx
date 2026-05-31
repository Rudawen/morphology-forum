import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    city: "",
    specialty: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const values = Object.values(form);

    if (values.some((v) => !v.trim())) {
      setMessage("Заполните все поля");
      return;
    }

    if (!validateEmail(form.email)) {
      setMessage("Введите корректный Email");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("registrations")
      .insert([form]);

    setLoading(false);

    if (error) {
      setMessage("Ошибка сохранения");
      console.error(error);
      return;
    }

    setMessage("Регистрация успешно отправлена");

    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      organization: "",
      position: "",
      city: "",
      specialty: "",
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Регистрация участника
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="Имя"
            className="w-full border p-4 rounded-xl"
          />

          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Фамилия"
            className="w-full border p-4 rounded-xl"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-4 rounded-xl"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Телефон"
            className="w-full border p-4 rounded-xl"
          />

          <input
            name="organization"
            value={form.organization}
            onChange={handleChange}
            placeholder="Организация"
            className="w-full border p-4 rounded-xl"
          />

          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Должность"
            className="w-full border p-4 rounded-xl"
          />

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Город"
            className="w-full border p-4 rounded-xl"
          />

          <input
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            placeholder="Специальность"
            className="w-full border p-4 rounded-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-4 rounded-xl"
          >
            {loading
              ? "Отправка..."
              : "Зарегистрироваться"}
          </button>

          {message && (
            <div className="text-center mt-4">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}