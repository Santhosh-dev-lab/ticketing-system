-- Fix Database Schema for Tickets

-- 1. Add missing 'department' column if it doesn't exist
do $$ 
begin 
    if not exists (select 1 from information_schema.columns where table_name = 'tickets' and column_name = 'department') then
        alter table tickets add column department text check (department in ('Technical Support', 'Billing', 'Feature Request', 'General'));
    end if;
end $$;

-- 2. Update Status Constraint (Drop old check, add new one)
-- first, drop the existing constraint if possible. We need to know its name. 
-- Usually postgres names it tickets_status_check.
alter table tickets drop constraint if exists tickets_status_check;
alter table tickets add constraint tickets_status_check 
    check (status in ('open', 'in_progress', 'resolved', 'closed', 'in-progress')); 
    -- included 'in-progress' (old) just in case existing rows have it.

-- 3. Update Priority Constraint
alter table tickets drop constraint if exists tickets_priority_check;
alter table tickets add constraint tickets_priority_check 
    check (priority in ('low', 'medium', 'high', 'urgent'));

-- 4. Ensure RLS policies are correct (Same as before, just re/applying)
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
