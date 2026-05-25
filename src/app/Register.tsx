export default function Register() {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-8">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Регистрация участника
          </h1>
  
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Имя"
              className="w-full border p-4 rounded-xl"
            />
  
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-4 rounded-xl"
            />
  
            <input
              type="tel"
              placeholder="Телефон"
              className="w-full border p-4 rounded-xl"
            />
  
            <textarea
              placeholder="Комментарий"
              className="w-full border p-4 rounded-xl h-32"
            />
  
            <button
              type="submit"
              className="w-full bg-black text-white p-4 rounded-xl text-lg"
            >
              Зарегистрироваться
            </button>
          </form>
        </div>
      </div>
    );
  }