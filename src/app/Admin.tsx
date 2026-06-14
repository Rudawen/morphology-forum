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

  const loadData = async () => {
    try {
      const res = await fetch("/registrations");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded-xl">
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
