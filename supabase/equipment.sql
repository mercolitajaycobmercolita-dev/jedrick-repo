-- Run once in Supabase SQL Editor after schema.sql.
-- Adds equipment records with the same published/admin access model as projects and certificates.

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  category text not null default 'Equipment',
  summary text not null,
  purpose text,
  image_path text,
  image_url text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint equipment_image_required check (image_path is not null or image_url is not null)
);

drop trigger if exists equipment_set_updated_at on public.equipment;
create trigger equipment_set_updated_at before update on public.equipment
for each row execute function public.set_updated_at();

alter table public.equipment enable row level security;
grant select, insert, update, delete on public.equipment to anon, authenticated;

drop policy if exists "Public read published equipment or admin" on public.equipment;
create policy "Public read published equipment or admin" on public.equipment
for select to anon, authenticated
using (is_published or (select public.is_portfolio_admin()));
drop policy if exists "Admins insert equipment" on public.equipment;
create policy "Admins insert equipment" on public.equipment
for insert to authenticated with check ((select public.is_portfolio_admin()));
drop policy if exists "Admins update equipment" on public.equipment;
create policy "Admins update equipment" on public.equipment
for update to authenticated using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));
drop policy if exists "Admins delete equipment" on public.equipment;
create policy "Admins delete equipment" on public.equipment
for delete to authenticated using ((select public.is_portfolio_admin()));

-- Preserve the existing equipment cards; these images remain in the app's public/IMAGES folder.
insert into public.equipment
  (title, category, summary, purpose, image_url, display_order)
values
  ('Monitor', 'Display', 'An external display for workspace tasks.', 'Coding and study', '/IMAGES/monitor.jpg', 1),
  ('Keyboard', 'Input', 'A keyboard for everyday computer work.', 'Typing and development', '/IMAGES/keyboard.jpg', 2),
  ('Mouse', 'Input', 'A mouse for navigation and precise interaction.', 'Everyday computer navigation', '/IMAGES/mouse.jpg', 3),
  ('Desk chair', 'Workspace', 'Seating for study and project sessions.', 'Study and project work', '/IMAGES/chair.jpg', 4),
  ('Table', 'Workspace', 'A surface for my computer and work materials.', 'Organizing the workspace', '/IMAGES/table.jpg', 5),
  ('Monitor desk mount', 'Workspace', 'A mount for positioning a monitor.', 'Workspace arrangement', '/IMAGES/Desk%20Mount%20Bracket%20Computer%20Monitor.jpg', 6),
  ('Speaker', 'Audio', 'Audio equipment for the workspace.', 'Audio playback', '/IMAGES/speaker.jpg', 7),
  ('Web camera', 'Camera', 'A camera for online sessions and calls.', 'Video calls and online sessions', '/IMAGES/camera.jpg', 8)
on conflict (title) do nothing;
