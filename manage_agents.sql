-- Helper Script: Promote Users to Agents
-- Replace 'user_email@example.com' with the actual email of the user you want to promote.

-- Example 1: Promote a user to 'Technical Support' Agent
update profiles 
set role = 'agent', department = 'Technical Support'
where email = 'santhosh@example.com'; -- REPLACE THIS EMAIL

-- Example 2: Promote a user to 'Billing' Agent
-- update profiles 
-- set role = 'agent', department = 'Billing'
-- where email = 'bill@example.com';

-- Verify Agents
select * from profiles where role = 'agent';
