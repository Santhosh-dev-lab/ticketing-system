-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  email text,
  role text default 'customer' check (role in ('customer', 'admin', 'agent')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for tickets
create table tickets (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references profiles(id) not null,
  title text not null,
  description text,
  status text default 'open' check (status in ('open', 'in-progress', 'resolved')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for tickets
alter table tickets enable row level security;

create policy "Individuals can view their own tickets." on tickets
  for select using (auth.uid() = customer_id);

create policy "Individuals can create tickets." on tickets
  for insert with check (auth.uid() = customer_id);

create policy "Individuals can update their own tickets." on tickets
  for update using (auth.uid() = customer_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
