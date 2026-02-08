-- Migration: Auto-Assignment & Agent Setup

-- 1. Add columns to Profiles
alter table profiles 
add column if not exists department text check (department in ('Technical Support', 'Billing', 'Feature Request', 'General')),
add column if not exists last_assigned_at timestamptz;

-- 2. Add assigned_to to Tickets
alter table tickets
add column if not exists assigned_to uuid references profiles(id);

-- 3. Create Auto-Assignment Function (Round Robin)
create or replace function public.auto_assign_ticket()
returns trigger as $$
declare
  selected_agent_id uuid;
begin
  -- Logic: Find an agent in the target department.
  -- Order by 'last_assigned_at' ascending (oldest first) to distribute load.
  -- NULLs first implies agents who haven't been assigned recently (or ever) get priority.
  select id into selected_agent_id
  from profiles
  where role = 'agent' 
  and department = new.department
  order by last_assigned_at asc nulls first
  limit 1;

  -- If an agent is found, assign the ticket to them
  if selected_agent_id is not null then
    new.assigned_to := selected_agent_id;
    
    -- Update the agent's last_assigned_at timestamp
    update profiles 
    set last_assigned_at = now() 
    where id = selected_agent_id;
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- 4. Create Trigger
drop trigger if exists trigger_auto_assign_ticket on tickets;
create trigger trigger_auto_assign_ticket
  before insert on tickets
  for each row
  execute procedure public.auto_assign_ticket();

-- 5. HELPER VIEW (Optional, for easy debugging)
create or replace view agent_workload as
select p.full_name, p.department, count(t.id) as active_tickets
from profiles p
left join tickets t on t.assigned_to = p.id and t.status in ('open', 'in_progress')
where p.role = 'agent'
group by p.id;
