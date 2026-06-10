# Supabase setup for the /learn platform (one-time, ~10 min)

This wires accounts + progress for `meegrowlabs.com/app`. Free tier is plenty.

## 1. Create the project
1. Go to https://supabase.com → New project (org: Meegrow). Name: `meegrow-learn`. Pick a region near India (e.g. Mumbai/Singapore). Save the DB password somewhere.
2. When it's ready: **Project Settings → API** → copy:
   - **Project URL** → this becomes `VITE_SUPABASE_URL`
   - **anon public** key → this becomes `VITE_SUPABASE_ANON_KEY`
   Paste both back to me (the anon key is safe for the browser).

## 2. Run the schema
Supabase → **SQL Editor** → New query → paste ALL of this → Run:

```sql
-- Profiles: one row per user
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  plan text not null default 'free',
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile read"  on public.profiles for select using (auth.uid() = id);
create policy "own profile write" on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile when a user signs up
create or replace function public.handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email) on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Lesson progress: one row per (user, lesson)
create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users on delete cascade,
  lesson_id text not null,           -- e.g. "L08-01"
  status text not null default 'in_progress',  -- in_progress | complete
  seconds int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
alter table public.lesson_progress enable row level security;
create policy "own progress" on public.lesson_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## 3. Auth settings
Supabase → **Authentication → Providers**:
- **Email**: keep enabled (we use magic links — passwordless).
- **Google** (optional but recommended): toggle on, add OAuth creds (or do later).
Supabase → **Authentication → URL Configuration**:
- **Site URL**: `https://meegrowlabs.com`
- **Redirect URLs**: add `https://meegrowlabs.com/app`, `http://localhost:5173/app` (for local dev).

## 4. Netlify env vars
Netlify site → **Site configuration → Environment variables** → add:
- `VITE_SUPABASE_URL` = your Project URL
- `VITE_SUPABASE_ANON_KEY` = your anon key
(`MAILERLITE_API_TOKEN` is already set — reused on signup.)

## Done → tell me
Once the project exists + SQL run, paste me the **URL + anon key** and I'll set local `.env`, finish wiring, build, and deploy. Then we test sign-up → progress end-to-end.
