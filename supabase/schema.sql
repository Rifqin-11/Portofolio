create extension if not exists pgcrypto;

create table if not exists public.profile_content (
  id text primary key default 'main',
  hero_name text not null,
  hero_prefix text not null,
  hero_subtitle text not null,
  profile_image text not null,
  location text not null,
  email text not null,
  website text not null,
  footer_name text not null,
  brand_name text not null,
  contact_cta text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_roles (
  id text primary key default gen_random_uuid()::text,
  text text not null,
  img_path text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  description text not null default '',
  image text not null,
  link text not null,
  background_color text not null default '#e8f4f6',
  image_layout text not null default 'contained',
  featured boolean not null default false,
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.projects
  add column if not exists image_layout text not null default 'contained';

create table if not exists public.experiences (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  date text not null,
  review text not null,
  img_path text not null default '',
  logo_path text not null default '',
  responsibilities text[] not null default '{}',
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  img_path text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.stats (
  id text primary key default gen_random_uuid()::text,
  label text not null,
  value int not null default 0,
  suffix text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  img_path text not null,
  link text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.profile_content enable row level security;
alter table public.hero_roles enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.skills enable row level security;
alter table public.stats enable row level security;
alter table public.social_links enable row level security;

drop policy if exists "Public can read profile" on public.profile_content;
create policy "Public can read profile" on public.profile_content
  for select using (true);

drop policy if exists "Authenticated can manage profile" on public.profile_content;
create policy "Authenticated can manage profile" on public.profile_content
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Public can read active roles" on public.hero_roles;
create policy "Public can read active roles" on public.hero_roles
  for select using (is_active = true);

drop policy if exists "Authenticated can manage roles" on public.hero_roles;
create policy "Authenticated can manage roles" on public.hero_roles
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Public can read active projects" on public.projects;
create policy "Public can read active projects" on public.projects
  for select using (is_active = true);

drop policy if exists "Authenticated can manage projects" on public.projects;
create policy "Authenticated can manage projects" on public.projects
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Public can read active experiences" on public.experiences;
create policy "Public can read active experiences" on public.experiences
  for select using (is_active = true);

drop policy if exists "Authenticated can manage experiences" on public.experiences;
create policy "Authenticated can manage experiences" on public.experiences
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Public can read active skills" on public.skills;
create policy "Public can read active skills" on public.skills
  for select using (is_active = true);

drop policy if exists "Authenticated can manage skills" on public.skills;
create policy "Authenticated can manage skills" on public.skills
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Public can read active stats" on public.stats;
create policy "Public can read active stats" on public.stats
  for select using (is_active = true);

drop policy if exists "Authenticated can manage stats" on public.stats;
create policy "Authenticated can manage stats" on public.stats
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Public can read active socials" on public.social_links;
create policy "Public can read active socials" on public.social_links
  for select using (is_active = true);

drop policy if exists "Authenticated can manage socials" on public.social_links;
create policy "Authenticated can manage socials" on public.social_links
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read portfolio assets" on storage.objects;
create policy "Public can read portfolio assets" on storage.objects
  for select using (bucket_id = 'portfolio-assets');

drop policy if exists "Authenticated can upload portfolio assets" on storage.objects;
create policy "Authenticated can upload portfolio assets" on storage.objects
  for insert with check (
    bucket_id = 'portfolio-assets' and auth.role() = 'authenticated'
  );

drop policy if exists "Authenticated can update portfolio assets" on storage.objects;
create policy "Authenticated can update portfolio assets" on storage.objects
  for update using (
    bucket_id = 'portfolio-assets' and auth.role() = 'authenticated'
  )
  with check (
    bucket_id = 'portfolio-assets' and auth.role() = 'authenticated'
  );

drop policy if exists "Authenticated can delete portfolio assets" on storage.objects;
create policy "Authenticated can delete portfolio assets" on storage.objects
  for delete using (
    bucket_id = 'portfolio-assets' and auth.role() = 'authenticated'
  );

insert into public.profile_content (
  id,
  hero_name,
  hero_prefix,
  hero_subtitle,
  profile_image,
  location,
  email,
  website,
  footer_name,
  brand_name,
  contact_cta
) values (
  'main',
  'RIFQI NAUFAL',
  'A CREATIVE',
  'Final year Electrical Engineering student with a passion for code.',
  '/images/profile.png',
  'Semarang, Indonesia',
  'rifqinaufal9009@gmail.com',
  'rifqinaufal.tech',
  'RIFQI NAUFAL',
  'Rifqin11',
  'Let''s work together'
) on conflict (id) do nothing;

insert into public.hero_roles (id, text, img_path, sort_order, is_active) values
  ('role-1', 'Software Developer', '/images/code.svg', 1, true),
  ('role-2', 'UI/UX Designer', '/images/designs.svg', 2, true),
  ('role-3', 'Graphic Designer', '/images/ideas.svg', 3, true),
  ('role-4', 'Video Editor', '/images/concepts.svg', 4, true)
on conflict (id) do nothing;

insert into public.projects (
  id,
  title,
  description,
  image,
  link,
  background_color,
  image_layout,
  featured,
  sort_order,
  is_active
) values
  ('split-bill', 'Split Bill Web App', 'Split Bill is a web app that lets users upload a photo of a receipt and automatically splits the bill based on who ordered what. Assign items to each person, get an instant breakdown of costs, and share the payment info with friends. Simple, smart, and perfect for dining out together.', '/images/project6.png', 'https://splitbill.rifqinaufal11.studio/', '#e8f4f6', 'contained', true, 1, true),
  ('siap-undip-schedule', 'Siap Undip Schedule', '', '/images/project3.png', 'https://schedule.rifqinaufal11.studio/', '#e8f4f6', 'full', false, 2, true),
  ('employee-web', 'EmployeeWeb - Visitor Management System', '', '/images/project1.png', 'https://github.com/Rifqin-11/EmployeeWeb', '#e4eefe', 'contained', false, 3, true),
  ('pln-calculator', 'PLN Calculator', '', '/images/project2.png', 'https://github.com/Rifqin-11/PLNCalculator', '#F1EBFF', 'contained', false, 4, true),
  ('sitita', 'Sitita Teknik Elektro', '', '/images/project4.png', 'https://github.com/Rifqin-11/Sitita', '#E6FFF7', 'contained', false, 5, true)
on conflict (id) do nothing;

insert into public.experiences (
  id,
  title,
  date,
  review,
  img_path,
  logo_path,
  responsibilities,
  sort_order,
  is_active
) values
  ('experience-1', 'Web Developer Intern | PT Des Teknologi Informasi', 'Jan 2025 - Feb 2025', 'Developed a secure Visitor Management System web app, replacing an inefficient Google Form to streamline data handling and enhance the professional user experience.', '/images/exp2.png', '/images/logo1.png', ARRAY['Led the end-to-end development lifecycle of the EmployeeWeb system', 'Designed the complete user interface (UI) and user experience (UX), focusing on creating a clean, intuitive, and efficient workflow for all employees.', 'Contributed to back-end logic and database structure, including the implementation of the real-time analytics dashboard.'], 1, true),
  ('experience-2', 'Head of Training Division | BKTI, Diponegoro University', 'Jun 2025 - Present', 'I directed the division responsible for all technical training and IT-focused coaching clinics. My role was to plan and deliver workshops that provided practical, in-demand technology skills to electrical engineering students, managing all aspects from concept to successful execution.', '', '/images/logo3.png', ARRAY['Directed the strategic planning and execution of all technical training programs for students in the IT concentration.', 'Recruited and coordinated with industry professionals, senior students, and faculty to act as trainers and mentors.', 'Managed all event logistics, including technical requirements, promotional campaigns, and participant registration.'], 2, true),
  ('experience-3', 'Documentation Staff | HME, Diponegoro University', 'Apr 2024 - Apr 2025', 'As a member of the Media and Information Division, I handled photo/video documentation for events, designed visuals to boost social media engagement, and produced a farewell video for a major ceremony.', '', '/images/logo2.png', ARRAY['Executed photo and video documentation for all organizational events.', 'Created engaging graphic designs and visual content for social media platforms.', 'Produced and edited a commemorative video presentation for the annual farewell ceremony.'], 3, true)
on conflict (id) do nothing;

insert into public.skills (id, name, img_path, sort_order, is_active) values
  ('skill-1', 'React Developer', '/images/logos/react.png', 1, true),
  ('skill-2', 'Next JS Developer', '/images/logos/Next.png', 2, true),
  ('skill-3', 'Backend Developer', '/images/logos/node.png', 3, true),
  ('skill-4', 'PHP Developer', '/images/logos/PHP.png', 4, true),
  ('skill-5', 'Python Developer', '/images/logos/python.svg', 5, true),
  ('skill-6', 'UI/UX Designer', '/images/logos/figma.svg', 6, true)
on conflict (id) do nothing;

insert into public.stats (id, label, value, suffix, sort_order, is_active) values
  ('stat-1', 'Years of Experience', 5, '+', 1, true),
  ('stat-2', 'Projects Developed', 25, '+', 2, true),
  ('stat-3', 'Technologies Learned', 8, '+', 3, true)
on conflict (id) do nothing;

insert into public.social_links (id, name, img_path, link, sort_order, is_active) values
  ('social-1', 'insta', '/images/insta.png', 'https://www.instagram.com/rifqin11_/', 1, true),
  ('social-2', 'x', '/images/Twitter X Icon.svg', 'https://x.com/rifqin11_', 2, true),
  ('social-3', 'linkedin', '/images/linkedin.png', 'https://www.linkedin.com/in/rifqin11/', 3, true),
  ('social-4', 'github', '/images/github.png', 'https://github.com/Rifqin-11', 4, true)
on conflict (id) do nothing;
