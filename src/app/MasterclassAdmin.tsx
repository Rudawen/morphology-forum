import { useEffect, useState } from "react";

type MasterclassUser = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  workplace: string;
  created_at: string;
};

export default function MasterclassAdmin() {
  const [users, setUsers] = useState<MasterclassUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const response = await fetch("/masterclass-registrations");

      if (response.status === 401) {
        setAuthorized(false);
        return;
      }

      const data = await response.json();
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
      const response = await fetch("/admin-masterclass/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
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
    await fetch("/admin-masterclass/logout", { method: "POST" });
    setAuthorized(false);
    setUsers([]);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Удалить заявку на мастер-класс?")) {
      return;
    }

    const previousUsers = users;
    setUsers((current) => current.filter((user) => user.id !== id));

    try {
      const response = await fetch(`/masterclass-registrations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }
    } catch (err) {
      console.log(err);
      setUsers(previousUsers);
      setError("Не удалось удалить запись");
    }
  };

  if (!authorized && !loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
        >
          <h1 className="mb-2 text-2xl font-bold text-[#0A2A3A]">
            Мастер-класс
          </h1>
          <p className="mb-6 text-sm text-[#1A2A36]/70">Вход в отдельную админку</p>
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
          <h1 className="text-3xl font-bold">Админ-панель мастер-класса</h1>
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

      {error && <p className="mb-4 text-sm text-[#B8A16A]">{error}</p>}

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="w-full overflow-x-auto rounded-xl shadow">
          <table className="min-w-[900px] w-full bg-white">
            <thead>
              <tr className="border-b">
                <th className="p-3">ID</th>
                <th className="p-3">ФИО</th>
                <th className="p-3">Email</th>
                <th className="p-3">Телефон</th>
                <th className="p-3">Место работы / должность</th>
                <th className="p-3">Дата регистрации</th>
                <th className="p-3">Действия</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b text-center">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.full_name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3">{user.workplace}</td>
                  <td className="p-3">{user.created_at}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(user.id)}
                      className="rounded-lg bg-[#B8A16A]/15 px-3 py-2 text-sm text-[#0A2A3A] transition hover:bg-[#B8A16A]/25"
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
