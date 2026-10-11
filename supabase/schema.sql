-- Run this once in Supabase Dashboard > SQL Editor.
-- The anon/publishable key may be used by the browser because these policies
-- limit public access to published rows and admin writes to allowlisted users.

create extension if not exists pgcrypto;

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.portfolio_admins a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Personal project',
  status text not null default 'Published',
  description text not null,
  role text not null default 'Developer',
  technologies text[] not null default '{}',
  github_url text,
  live_url text,
  image_path text,
  image_alt text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  issuer text,
  earned_at date,
  verification_url text,
  image_path text not null,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();
drop trigger if exists certificates_set_updated_at on public.certificates;
create trigger certificates_set_updated_at before update on public.certificates
for each row execute function public.set_updated_at();

alter table public.portfolio_admins enable row level security;
alter table public.projects enable row level security;
alter table public.certificates enable row level security;

revoke all on public.portfolio_admins from anon, authenticated;
grant select, insert, update, delete on public.projects, public.certificates to anon, authenticated;

drop policy if exists "Public read published projects or admin" on public.projects;
create policy "Public read published projects or admin" on public.projects
for select to anon, authenticated
using (is_published or (select public.is_portfolio_admin()));
drop policy if exists "Admins insert projects" on public.projects;
create policy "Admins insert projects" on public.projects
for insert to authenticated with check ((select public.is_portfolio_admin()));
drop policy if exists "Admins update projects" on public.projects;
create policy "Admins update projects" on public.projects
for update to authenticated using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));
drop policy if exists "Admins delete projects" on public.projects;
create policy "Admins delete projects" on public.projects
for delete to authenticated using ((select public.is_portfolio_admin()));

drop policy if exists "Public read published certificates or admin" on public.certificates;
create policy "Public read published certificates or admin" on public.certificates
for select to anon, authenticated
using (is_published or (select public.is_portfolio_admin()));
drop policy if exists "Admins insert certificates" on public.certificates;
create policy "Admins insert certificates" on public.certificates
for insert to authenticated with check ((select public.is_portfolio_admin()));
drop policy if exists "Admins update certificates" on public.certificates;
create policy "Admins update certificates" on public.certificates
for update to authenticated using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));
drop policy if exists "Admins delete certificates" on public.certificates;
create policy "Admins delete certificates" on public.certificates
for delete to authenticated using ((select public.is_portfolio_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public read portfolio media" on storage.objects;
create policy "Public read portfolio media" on storage.objects
for select to anon, authenticated using (bucket_id = 'portfolio-media');
drop policy if exists "Admins upload portfolio media" on storage.objects;
create policy "Admins upload portfolio media" on storage.objects
for insert to authenticated with check (bucket_id = 'portfolio-media' and (select public.is_portfolio_admin()));
drop policy if exists "Admins update portfolio media" on storage.objects;
create policy "Admins update portfolio media" on storage.objects
for update to authenticated using (bucket_id = 'portfolio-media' and (select public.is_portfolio_admin()))
with check (bucket_id = 'portfolio-media' and (select public.is_portfolio_admin()));
drop policy if exists "Admins delete portfolio media" on storage.objects;
create policy "Admins delete portfolio media" on storage.objects
for delete to authenticated using (bucket_id = 'portfolio-media' and (select public.is_portfolio_admin()));

-- Bootstrap one admin manually after creating/inviting that account in Supabase Auth.
-- Replace the email below, then run only this statement in the SQL Editor.
-- Never add a client-side policy that allows users to insert themselves here.
-- insert into public.portfolio_admins (user_id)
-- select id from auth.users where lower(email) = lower('YOUR_ADMIN_EMAIL@example.com')
-- on conflict (user_id) do nothing;

-- Seed current project records to preserve existing portfolio content.
insert into public.projects
  (title, category, status, description, role, technologies, github_url, image_path, image_alt, display_order)
values
  ('Restaurant Website Project', 'Web development', 'Source available', 'A learning project exploring a restaurant website flow with authentication, menu, category, featured-food, and account-related screens.', 'Individual learning project', array['PHP','HTML','CSS','JavaScript','MySQL'], 'https://github.com/jedrick-relshey/Restaurant-website-project', '/IMAGES/restaurant%20website.jpg', 'Restaurant website project screenshot', 1),
  ('BrewPoint Café POS', 'Academic team project', 'Source available', 'A Windows desktop café point-of-sale application with Admin and Cashier sign-in plus local text-file data storage.', 'Team contributor', array['VB.NET','Windows Forms'], 'https://github.com/jedrick-relshey/point-of-sale-system', '/IMAGES/pos.jpg', 'BrewPoint cafe point-of-sale project screenshot', 2),
  ('LRT1 MetroRailway System', 'Programming project', 'Source available', 'A Python linked-list command-line program for listing, adding, and deleting stations and checking intervals between selected stops.', 'Individual developer', array['Python','Linked lists'], 'https://github.com/jedrick-relshey/METRO-RAILWAY-SYSTEM', '/IMAGES/ltr.jpg', 'LRT railway train screenshot for the MetroRailway project', 3),
  ('Student Grading System', 'Academic team project', 'Source available', 'A Windows Forms application for entering student grades, computing final results, validating inputs, and saving grade records.', 'Team developer', array['VB.NET','Windows Forms'], 'https://github.com/jedrick-relshey/Student-Grading-System', '/IMAGES/grading%20system.jpg', 'Student grading system project screenshot', 4),
  ('Student Record Management System', 'Academic team project', 'Source available', 'A Python command-line project for adding, viewing, searching, updating, deleting, and summarizing student records.', 'Team member', array['Python'], 'https://github.com/jedrick-relshey/Student-Management-System', '/IMAGES/student%20record%20system.png', 'Student record management project screenshot', 5),
  ('Pickleball Website', 'Upcoming project', 'Planning / Coming soon', 'An upcoming web project focused on creating a modern digital experience around pickleball. It is currently in the planning stage as part of my continued journey in web development.', 'Concept & development planning', array['To be confirmed'], null, '/IMAGES/pickleball.jpg', 'Pickleball website reference image', 6)
on conflict do nothing;

