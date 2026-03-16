-- Migration: AI-Based Ticket Assignment Schema
-- This script adds vector storage for semantic matching and expertise fields for agents.

-- 1. Enable pgvector Extension (if not already enabled)
create extension if not exists vector;

-- 2. Modify Profiles Table
-- Add expertise text and its embedding
-- Drop if exists to handle dimension changes (1536 -> 768)
alter table profiles drop column if exists expertise;
alter table profiles drop column if exists expertise_embedding;
alter table profiles drop column if exists department cascade;

alter table profiles 
add column expertise text,
add column expertise_embedding vector(768),
add column department text;

-- 3. Modify Tickets Table
-- Add semantic embedding for ticket content
alter table tickets drop column if exists semantic_embedding;
alter table tickets drop column if exists department;

alter table tickets
add column semantic_embedding vector(768),
add column department text,
alter column priority drop not null;

-- 4. Disable Old Round-Robin Trigger
-- We will handle assignment via Edge Function or App Logic now.
drop trigger if exists trigger_auto_assign_ticket on tickets;

-- 5. Helper Function for Vector Search
-- This searches for agents based on semantic similarity to a ticket embedding
create or replace function match_agents (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  target_department text default null
)
returns table (
  id uuid,
  full_name text,
  expertise text,
  similarity float,
  active_ticket_count bigint
)
language plpgsql
as $$
begin
  return query
  select
    p.id,
    p.full_name,
    p.expertise,
    1 - (p.expertise_embedding <=> query_embedding) as similarity,
    count(t.id) filter (where t.status in ('open', 'in-progress')) as active_ticket_count
  from profiles p
  left join tickets t on t.assigned_to = p.id
  where p.role = 'agent'
    and (target_department is null or p.department = target_department)
    and p.expertise_embedding is not null
    and 1 - (p.expertise_embedding <=> query_embedding) > match_threshold
  group by p.id
  order by similarity desc, active_ticket_count asc
  limit match_count;
end;
$$;
