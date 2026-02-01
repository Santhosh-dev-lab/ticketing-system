-- 1. Create Enum Types for Status and Priority
create type ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');
create type ticket_priority as enum ('low', 'medium', 'high', 'urgent');

-- 2. Create Tickets Table
create table if not exists tickets (
  id bigserial primary key,
  customer_id uuid references auth.users(id) not null,
  title text not null,
  description text not null,
  status ticket_status default 'open'::ticket_status,
  priority ticket_priority default 'medium'::ticket_priority,
  department text not null check (department in ('Technical Support', 'Billing', 'Feature Request', 'General')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Enable Grid/Realtime support (Optional but good for dashboards)
alter publication supabase_realtime add table tickets;

-- 4. Enable Row Level Security (RLS)
alter table tickets enable row level security;

-- 5. Create Security Policies
-- Policy: Users can only view their own tickets
create policy "Users can view own tickets" 
on tickets for select 
using (auth.uid() = customer_id);

-- Policy: Users can insert their own tickets
create policy "Users can create tickets" 
on tickets for insert 
with check (auth.uid() = customer_id);

-- Policy: Users can update their own tickets (e.g., to close them)
create policy "Users can update own tickets" 
on tickets for update 
using (auth.uid() = customer_id);

-- 6. Create Index for faster lookup by customer
create index if not exists tickets_customer_id_idx on tickets(customer_id);
