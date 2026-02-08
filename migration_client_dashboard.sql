-- Migration for Client Dashboard

-- 1. Ensure Enum Types exist
DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- 2. Create Tickets Table (if not exists)
create table if not exists tickets (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references auth.users(id) not null,
  title text not null,
  description text not null,
  status ticket_status default 'open'::ticket_status,
  priority ticket_priority default 'medium'::ticket_priority,
  department text check (department in ('Technical Support', 'Billing', 'Feature Request', 'General')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Enable RLS
alter table tickets enable row level security;

-- 4. Create Policies (Drop existing to recreate or check if exists)
-- Best practice: Drop if exists to ensure correct policy
drop policy if exists "Users can view own tickets" on tickets;
create policy "Users can view own tickets" 
on tickets for select 
using (auth.uid() = customer_id);

drop policy if exists "Users can create tickets" on tickets;
create policy "Users can create tickets" 
on tickets for insert 
with check (auth.uid() = customer_id);

drop policy if exists "Users can update own tickets" on tickets;
create policy "Users can update own tickets" 
on tickets for update 
using (auth.uid() = customer_id);

-- 5. Create Index
create index if not exists tickets_customer_id_idx on tickets(customer_id);

-- 6. Ensure Profiles table exists (from schema.sql)
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  email text,
  role text default 'customer' check (role in ('customer', 'admin', 'agent')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profile policies
alter table profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
