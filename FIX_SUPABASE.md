# Fix Supabase registration saving

The registration form saves into `public.registrations` with these fields:

- `first_name`
- `last_name`
- `email`
- `phone`
- `organization`
- `position`
- `city`
- `specialty`

## 1. Run the SQL migration

Open Supabase SQL Editor and run:

```sql
-- contents of supabase-registrations.sql
```

Or open `supabase-registrations.sql`, copy the full contents, and run it once.

This creates/migrates the `registrations` table and allows anonymous inserts while keeping public reads closed.

## 2. Check Vercel environment variables

In Vercel project settings, set:

```text
VITE_SUPABASE_URL=https://skwixaoacqfdoagmhrfh.supabase.co
VITE_SUPABASE_ANON_KEY=<your publishable anon key>
```

Important: `VITE_SUPABASE_URL` must not end with `/rest/v1/`.

## 3. Redeploy

Redeploy the Vercel project after updating the files and environment variables.
