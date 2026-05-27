-- =============================================
-- NOTESDRIVE - COMPLETE SUPABASE SCHEMA
-- =============================================

-- 1. USERS TABLE (Supabase auth ke saath sync)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  is_premium boolean default false,
  premium_activated_at timestamptz,
  premium_expires_at timestamptz, -- null = lifetime
  college text,
  semester int check (semester between 1 and 8),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger security check to avoid duplicates
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================

-- 2. SUBJECTS TABLE
create table if not exists public.subjects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  code text unique, -- e.g., "BP101T"
  semester int not null check (semester between 1 and 8),
  description text,
  thumbnail_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- =============================================

-- 3. NOTES TABLE (main content)
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  subject_id uuid references public.subjects(id) on delete cascade,
  semester int not null check (semester between 1 and 8),
  unit int check (unit between 1 and 5), -- Unit 1-5
  file_url text not null, -- Supabase Storage URL / Google Drive link
  file_size_mb float,
  file_type text default 'pdf', -- pdf, pptx, docx
  thumbnail_url text,
  is_premium boolean default false, -- false = free, true = premium only
  is_active boolean default true,
  download_count int default 0,
  view_count int default 0,
  tags text[], -- e.g., ['pharmacology', 'important', 'handwritten']
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================

-- 4. PAYMENTS TABLE (Cashfree orders)
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  cashfree_order_id text unique not null,
  cashfree_payment_id text unique,
  amount numeric(10,2) not null default 499.00,
  currency text default 'INR',
  status text default 'PENDING' 
    check (status in ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED')),
  plan text default 'LIFETIME_PREMIUM',
  payment_method text, -- UPI, Card, NetBanking
  webhook_verified boolean default false,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- =============================================

-- 5. DOWNLOADS TABLE (track karo)
create table if not exists public.downloads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  note_id uuid references public.notes(id) on delete cascade,
  downloaded_at timestamptz default now(),
  unique(user_id, note_id) -- ek user ek note ek baar count ho
);

-- =============================================

-- 6. BOOKMARKS TABLE
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  note_id uuid references public.notes(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, note_id)
);

-- =============================================

-- 7. ROW LEVEL SECURITY (RLS) - IMPORTANT!
alter table public.profiles enable row level security;
alter table public.notes enable row level security;
alter table public.payments enable row level security;
alter table public.downloads enable row level security;
alter table public.bookmarks enable row level security;
alter table public.subjects enable row level security;

-- Profiles policies
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Notes policies
drop policy if exists "Free notes visible to all" on public.notes;
create policy "Free notes visible to all"
  on public.notes for select
  using (is_premium = false and is_active = true);

drop policy if exists "Premium notes for premium users" on public.notes;
create policy "Premium notes for premium users"
  on public.notes for select
  using (
    is_active = true and (
      is_premium = false or
      exists (
        select 1 from public.profiles
        where id = auth.uid() and is_premium = true
      )
    )
  );

-- Payments policies
drop policy if exists "Users see own payments" on public.payments;
create policy "Users see own payments"
  on public.payments for select using (auth.uid() = user_id);

drop policy if exists "Users insert own payments" on public.payments;
create policy "Users insert own payments"
  on public.payments for insert with check (auth.uid() = user_id);

-- Subjects policies
drop policy if exists "Subjects visible to all" on public.subjects;
create policy "Subjects visible to all"
  on public.subjects for select using (is_active = true);

-- Downloads & Bookmarks policies
drop policy if exists "Users manage own downloads" on public.downloads;
create policy "Users manage own downloads"
  on public.downloads for all using (auth.uid() = user_id);

drop policy if exists "Users manage own bookmarks" on public.bookmarks;
create policy "Users manage own bookmarks"
  on public.bookmarks for all using (auth.uid() = user_id);

-- =============================================

-- 8. SAMPLE DATA INSERT
insert into public.subjects (name, code, semester) values
  ('Human Anatomy & Physiology I', 'BP101T', 1),
  ('Pharmaceutical Analysis I', 'BP102T', 1),
  ('Pharmaceutics I', 'BP103T', 1),
  ('Pharmaceutical Inorganic Chemistry', 'BP104T', 1),
  ('Human Anatomy & Physiology II', 'BP201T', 2),
  ('Pharmaceutical Organic Chemistry I', 'BP202T', 2),
  ('Biochemistry', 'BP203T', 2),
  ('Pharmacology I', 'BP401T', 4),
  ('Medicinal Chemistry I', 'BP402T', 4),
  ('Pharmacognosy I', 'BP403T', 4),
  ('JEE Physics - Class 11', 'PHY11', 1),
  ('JEE Chemistry - Class 11', 'CHEM11', 1),
  ('JEE Mathematics - Class 11', 'MATH11', 1),
  ('NEET Biology - Class 11', 'BIO11', 1),
  ('JEE Physics - Class 12', 'PHY12', 2),
  ('JEE Chemistry - Class 12', 'CHEM12', 2),
  ('JEE Mathematics - Class 12', 'MATH12', 2),
  ('NEET Biology - Class 12', 'BIO12', 2)
on conflict (code) do update 
set name = excluded.name, semester = excluded.semester;

-- =============================================

-- 9. USEFUL VIEWS
drop view if exists public.notes_with_subject;
create view public.notes_with_subject as
  select 
    n.*,
    s.name as subject_name,
    s.code as subject_code
  from public.notes n
  left join public.subjects s on n.subject_id = s.id;

-- Download count update function
create or replace function increment_download_count(note_id uuid)
returns void as $$
  update public.notes 
  set download_count = download_count + 1 
  where id = note_id;
$$ language sql security definer;
