-- 1. Ensure profiles are viewable so we can check roles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true); -- Or restrict to auth.uid() = id OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('agent', 'admin'))

-- 2. Update Tickets Policies

-- VIEW: 
-- 1. Customers see their own (created by them)
-- 2. Admins see ALL
-- 3. Agents see their own (assigned to them) OR Unassigned (to claim)
DROP POLICY IF EXISTS "Individuals can view their own tickets." ON tickets;
CREATE POLICY "Individuals can view their own tickets." ON tickets
  FOR SELECT USING (
    -- Customer created it
    auth.uid() = customer_id
    OR 
    -- Is Admin (Sees everything)
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
    OR
    -- Is Agent (Sees assigned to self OR unassigned)
    (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'agent'
      )
      AND
      (
        assigned_to = auth.uid() OR assigned_to IS NULL
      )
    )
  );

-- INSERT: Customers can create, Agents/Admins can create
DROP POLICY IF EXISTS "Individuals can create tickets." ON tickets;
CREATE POLICY "Individuals can create tickets." ON tickets
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id
    OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('agent', 'admin')
    )
  );

-- UPDATE: Customers can ONLY update their own (if needed, e.g. close), Agents/Admins can update ANY
DROP POLICY IF EXISTS "Individuals can update their own tickets." ON tickets;
CREATE POLICY "Individuals can update their own tickets." ON tickets
  FOR UPDATE USING (
    auth.uid() = customer_id
    OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('agent', 'admin')
    )
  );

-- 3. Create a helper to quickly set a user as admin/agent (For manual setup)
-- Usage: select set_user_role('user-uuid-here', 'agent');
CREATE OR REPLACE FUNCTION set_user_role(target_user_id uuid, new_role text)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET role = new_role
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
