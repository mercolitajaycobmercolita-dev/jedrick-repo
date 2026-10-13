# Supabase setup for the portfolio

This project uses Supabase Auth, PostgREST, and Storage through the browser's built-in fetch API. No service-role key belongs in this Vite app.

## 1. Create the Supabase schema

1. Create a Supabase project.
2. Open **SQL Editor** in its dashboard.
3. Run all of `supabase/schema.sql`. It creates the project and certificate tables, policies, public image bucket, and seed rows for the current six projects.
4. Run `supabase/equipment.sql` once. It creates the equipment table and policies, then copies the current eight equipment cards into Supabase without duplicating them if you run it again.
5. Existing project and equipment images remain served from `public/IMAGES`. Newly uploaded project, certificate, and equipment images go to the Supabase `portfolio-media` bucket.

## 2. Create the one administrator account

1. In **Authentication > Users**, invite or create the one account you control.
2. In **Authentication > Settings**, turn off **Allow new users to sign up**. Do not enable public registration.
3. After the account exists, replace the sample email below with the exact administrator email and run it in SQL Editor:

```sql
insert into public.portfolio_admins (user_id)
select id
from auth.users
where lower(email) = lower('YOUR_ADMIN_EMAIL@example.com')
on conflict (user_id) do nothing;
```

If this inserts zero rows, check the email in Authentication > Users. Never create an app screen or policy that lets a user insert their own row in `portfolio_admins`.

## 3. Configure this local app

1. Copy `.env.example` to `.env.local`.
2. In Supabase **Project Settings > API**, copy the Project URL and the anon/publishable key into `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

3. Restart Vite after editing the environment file.
4. Open `http://localhost:5173/admin/login`, sign in with the invited administrator account, and manage projects, certificates, and equipment at `/admin/dashboard`.

The anon/publishable key is designed for browser use. Never use or put a `service_role` / secret key in a `VITE_*` variable, source file, or public repository.

## 4. Deploying

Configure the deployed host to serve the Vite `index.html` for both `/admin/login` and `/admin/dashboard` (SPA history fallback), then set the same two `VITE_SUPABASE_*` build environment variables in the hosting dashboard and rebuild. Keep the admin account allowlist in Supabase; the URL itself is not the security boundary.

## Access model

- Visitors can select published project and certificate rows and read images from the public media bucket.
- Only a signed-in user whose Auth UUID is manually listed in `portfolio_admins` can read drafts, write rows, or upload/delete media.
- Row Level Security and Storage policies enforce those rules even if a visitor calls Supabase endpoints directly.
- The frontend login check improves navigation only; it is not a substitute for the database and Storage policies.

## Verification after connecting a real Supabase project

- Visit `/admin/dashboard` in a signed-out browser: it should redirect to `/admin/login`.
- Sign in with the allowlisted account: dashboard loads and CRUD persists after refresh.
- Sign in with any other Auth account: dashboard must deny access.
- As an unauthenticated visitor, read published rows successfully; attempt an insert/update/delete and confirm Supabase returns an RLS error.
- Upload as the admin, then try uploading/deleting the same bucket object while unauthenticated; confirm Storage rejects it.
- Add a published record in Admin and refresh the public Projects, Achievements, or Equipment page to confirm it appears.

Live Auth, RLS, and Storage checks require the real Supabase URL/key and an account/project configured as above. The SQL and app build can be checked locally without those credentials.

