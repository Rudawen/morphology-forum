import { useState } from "react";
import { Link } from "react-router-dom";
import consentDocument from "./assets/personal-data-consent.docx";

const consentText = [
  "Настоящим я даю согласие президиуму форума «Петербургский Морфологический Форум» и их уполномоченным представителям на обработку моих данных, содержащихся в регистрационной форме, а также любых иных данных, относящихся к моей личности (именуемые далее – «персональные данные»), на любое действие (операцию) или совокупность действий (операций), совершаемых с моими персональными данными, включая (без ограничений) сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение персональных данных, а также осуществление любых других действий, предусмотренных действующим законодательством Российской Федерации, с использованием средств автоматизации, в том числе в информационно-телекоммуникационных сетях, или без использования таких средств, если обработка персональных данных без использования таких средств соответствует характеру действий (операций), совершаемых с персональными данными с использованием средств автоматизации, то есть позволяет осуществлять в соответствии с заданным алгоритмом поиск персональных данных, зафиксированных на материальном носителе и содержащихся в картотеках или иных систематизированных собраниях персональных данных, и/или доступ к таким персональным данным, а также на передачу (в том числе трансграничную) этих персональных данных уполномоченным представителям форума и третьим лицам – партнерам форума, в том числе операторам мобильной связи, интернет-провайдерам, консультантам и компаниям, осуществляющим анализ массивов данных из сети Интернет и данных информационных систем партнеров для отнесения пользователя к маркетинговым сегментам.",
  "Настоящим я подтверждаю, что переданные мной персональные данные являются достоверными и могут обрабатываться организаторами, президиум форума и его уполномоченными представителями в рекламно-информационных целях.",
  "Настоящим я даю свое согласие направлять мне электронные письма/информационные сообщения на указанный мной адрес электронной почты и/или номер мобильного телефона и/или сообщения в электронных мессенджерах (включая Telegram), включающие информацию о проводимых представителями форума и их партнерами рекламных акциях и сообщения иного информационного характера, а также использовать указанный мной электронный адрес для показа таргетированных рекламно-информационных сообщений.",
  "Я согласен(на) с тем, что текст данного мной по собственной воле и в моих интересах согласия хранится в электронном виде в базе данных и/или на бумажном носителе и подтверждает факт согласия на обработку и передачу персональных данных в соответствии с вышеизложенными положениями и беру на себя ответственность за достоверность предоставления персональных данных.",
  "Согласие дается на неопределенный срок и может быть в любой момент мной отозвано путем направления письменного уведомления по адресу электронной почты pmf-info@yandex.ru",
];

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

    if (values.some((v) => !String(v).trim())) {
      setMessage("Заполните все поля");
      return;
    }

    if (!validateEmail(form.email)) {
      setMessage("Введите корректный Email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ошибка сохранения");
      setLoading(false);
      return;
    }

    setLoading(false);

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
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-5 md:p-8">
        <Link
          to="/"
          className="mb-6 inline-flex text-sm text-[#2B6C8F] hover:text-[#0A2F44]"
        >
          ← Назад на сайт
        </Link>

        <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center text-[#0A2F44]">
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
            className="w-full min-w-0 border p-4 rounded-xl"
          />

          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Фамилия"
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
            name="organization"
            value={form.organization}
            onChange={handleChange}
            placeholder="Организация"
            className="w-full min-w-0 border p-4 rounded-xl"
          />

          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Должность"
            className="w-full min-w-0 border p-4 rounded-xl"
          />

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Город"
            className="w-full min-w-0 border p-4 rounded-xl"
          />

          <input
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            placeholder="Специальность"
            className="w-full min-w-0 border p-4 rounded-xl"
          />

          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8F9FA] p-4 text-sm leading-relaxed text-[#1A2A36]">
            <p>
              Нажимая на кнопку «Зарегистрироваться», Вы подтверждаете согласие
              на сбор и обработку персональных данных.
            </p>

            <details className="mt-3">
              <summary className="cursor-pointer text-[#2B6C8F] hover:text-[#0A2F44]">
                Ознакомиться с соглашением
              </summary>
              <div className="mt-4 max-h-72 overflow-y-auto rounded-lg bg-white p-4 text-left text-xs leading-relaxed text-[#1A2A36]/80">
                <h2 className="mb-3 text-base font-semibold text-[#0A2F44]">
                  Согласие на обработку персональных данных
                </h2>
                <div className="space-y-3">
                  {consentText.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <a
                  href={consentDocument}
                  download
                  className="mt-4 inline-flex text-[#2B6C8F] hover:text-[#0A2F44] hover:underline"
                >
                  Скачать соглашение в DOCX
                </a>
              </div>
            </details>
          </div>

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
