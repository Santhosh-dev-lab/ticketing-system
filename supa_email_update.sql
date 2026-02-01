-- Allow tickets to be created without a logged-in user (for Email Automation)
alter table tickets alter column customer_id drop not null;

-- Add Source column to track where ticket came from
alter table tickets add column if not exists source text default 'web';

-- Optional: Add Sender Email column to tracking
alter table tickets add column if not exists sender_email text;

-- RLS Update: Allow Service Role (Server Actions / API) to bypass typical checks
-- The existing RLS checks "auth.uid() = customer_id".
-- For API inserts (where auth.uid() is null), we need a policy or we rely on 'Service Role' bypassing RLS completely.
-- Since the Next.js API uses 'supabase-js' with ANON key by default, it respects RLS.
-- We must ensure the API Client uses SERVICE_ROLE KEY if we want to bypass RLS, 
-- OR we allow public inserts (dangerous without checking secret).

-- SAFER: Just allowing the table change for now. 
-- In the API code, we should use the Service Role Key ideally.
