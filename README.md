
# Петербургский морфологический форум

Node/Vite сайт с самостоятельной регистрацией без Supabase.

## Запуск локально

```bash
npm install
npm run build
ADMIN_PASSWORD=change-this-password PORT=5050 npm start
```

Сайт:

```text
http://localhost:5050
```

Админка:

```text
http://localhost:5050/admin
```

Обратная связь:

```text
http://localhost:5050/feedback
```

Закрытый просмотр ответов (тот же пароль `ADMIN_PASSWORD`):

```text
http://localhost:5050/admin-feedback
```

Для разработки можно запускать:

```bash
npm run dev
```
