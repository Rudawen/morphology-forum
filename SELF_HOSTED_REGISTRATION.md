# Self-hosted registration

Supabase has been removed from the registration form. The site now saves registrations through the local Node/Express server into SQLite.

## What changed

1. `src/app/Register.tsx`
   - Removed the Supabase import.
   - Replaced `.from("registrations").insert(...)` with `fetch("/register", ...)`.

2. `server.cjs`
   - Added a `/register` POST endpoint that validates and saves all registration form fields.
   - Added password-protected admin endpoints for `/admin` and `/registrations`.
   - Uses `database.db` through SQLite.
   - Uses `process.env.PORT || 5000`, so hosting platforms can provide the port automatically.

3. `src/app/Admin.tsx`
   - Replaced `http://localhost:5000/registrations` with `/registrations`.
   - Added an admin login screen.
   - Updated the table fields to match the registration form.

4. `package.json`
   - Removed `@supabase/supabase-js`.
   - Removed unused UI/demo dependencies to make install and build lighter.

5. `src/app/App.tsx`
   - Added the first organizer logo from `src/imports/logo_mirus.png`.
   - Added a clickable forum invitation below "Важные даты".

## How to run

```bash
npm install
npm run build
ADMIN_PASSWORD=change-this-password PORT=5050 npm start
```

Then open:

```text
http://localhost:5050
```

Admin panel:

```text
http://localhost:5050/admin
```

Use the password from `ADMIN_PASSWORD`. If it is not set, the temporary default is `admin2026`; change it on real hosting.

On hosting, deploy it as a Node app, not as a static-only Vite site. The server serves the built `dist` folder and handles registration requests.
