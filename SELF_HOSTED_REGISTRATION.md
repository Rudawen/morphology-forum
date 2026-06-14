# Self-hosted registration

Supabase has been removed from the registration form. The site now saves registrations through the local Node/Express server into SQLite.

## What changed

1. `src/app/Register.tsx`
   - Removed the Supabase import.
   - Replaced `.from("registrations").insert(...)` with `fetch("/register", ...)`.

2. `server.cjs`
   - Added a `/register` POST endpoint that validates and saves all registration form fields.
   - Added a `/registrations` GET endpoint for the admin page.
   - Uses `database.db` through SQLite.
   - Uses `process.env.PORT || 5000`, so hosting platforms can provide the port automatically.

3. `src/app/Admin.tsx`
   - Replaced `http://localhost:5000/registrations` with `/registrations`.
   - Updated the table fields to match the registration form.

4. `package.json`
   - Removed `@supabase/supabase-js`.

## How to run

```bash
npm install
npm run build
PORT=5050 npm run server
```

Then open:

```text
http://localhost:5050
```

On hosting, deploy it as a Node app, not as a static-only Vite site. The server serves the built `dist` folder and handles registration requests.
