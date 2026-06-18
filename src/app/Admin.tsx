import { useEffect, useState } from "react";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  city: string;
  specialty: string;
  created_at: string;
};

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const res = await fetch("/registrations");
      if (res.status === 401) {
        setAuthorized(false);
        return;
      }

      const data = await res.json();
      setUsers(data);
      setAuthorized(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Неверный пароль");
        setLoading(false);
        return;
      }

      setPassword("");
      await loadData();
    } catch (err) {
      console.log(err);
      setError("Ошибка входа");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/admin/logout", { method: "POST" });
    setAuthorized(false);
    setUsers([]);
  };

  if (!authorized && !loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
        >
          <h1 className="mb-6 text-2xl font-bold text-[#0A2A3A]">Вход в админку</h1>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Пароль администратора"
            className="mb-4 w-full rounded-xl border border-[#E2E8F0] p-4"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-[#0A2A3A] p-4 text-white transition hover:bg-[#15384A]"
          >
            Войти
          </button>
          {error && <p className="mt-4 text-center text-sm text-[#B8A16A]">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Админ-панель</h1>
          <p className="text-sm text-gray-600">Заявок: {users.length}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-white px-4 py-2 text-sm shadow hover:bg-gray-50"
        >
          Выйти
        </button>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="w-full overflow-x-auto rounded-xl shadow">
          <table className="min-w-[980px] w-full bg-white">
            <thead>
              <tr className="border-b">
                <th className="p-3">ID</th>
                <th className="p-3">Имя</th>
                <th className="p-3">Фамилия</th>
                <th className="p-3">Email</th>
                <th className="p-3">Телефон</th>
                <th className="p-3">Организация</th>
                <th className="p-3">Должность</th>
                <th className="p-3">Город</th>
                <th className="p-3">Специальность</th>
                <th className="p-3">Дата</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b text-center">
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">{u.first_name}</td>
                  <td className="p-3">{u.last_name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phone}</td>
                  <td className="p-3">{u.organization}</td>
                  <td className="p-3">{u.position}</td>
                  <td className="p-3">{u.city}</td>
                  <td className="p-3">{u.specialty}</td>
                  <td className="p-3">{u.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
