-- 1. DROP ALL POTENTIAL OLD POLICIES
DROP POLICY IF EXISTS "Individuals can view their own tickets." ON tickets;
DROP POLICY IF EXISTS "Individuals can create tickets." ON tickets;
DROP POLICY IF EXISTS "Individuals can update their own tickets." ON tickets;
DROP POLICY IF EXISTS "Agents can view all tickets." ON tickets;
DROP POLICY IF EXISTS "Admins can view all tickets." ON tickets;
DROP POLICY IF EXISTS "strict_ticket_visibility" ON tickets;
DROP POLICY IF EXISTS "strict_ticket_insert" ON tickets;
DROP POLICY IF EXISTS "strict_ticket_update" ON tickets;
DROP POLICY IF EXISTS "Enable read access for all users" ON tickets;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON tickets;
DROP POLICY IF EXISTS "Enable update for users based on email" ON tickets;

-- 2. CREATE NEW Strict Visibility Policy
CREATE POLICY "strict_ticket_visibility" ON tickets
FOR SELECT USING (
  -- 1. Customer created it (Standard Role)
  auth.uid() = customer_id
  OR 
  -- 2. Admin (Sees Everything - Global Access)
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
  OR
  -- 3. Agent (Restricted Access)
  (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'agent'
    )
    AND
    (
      -- Can see TICKETS ASSIGNED TO SELF
      assigned_to = auth.uid() 
      OR 
      -- Can see TICKETS THAT ARE UNASSIGNED (to pick/claim)
      assigned_to IS NULL
    )
  )
);

-- 3. INSERT Policy (Creation)
CREATE POLICY "strict_ticket_insert" ON tickets
FOR INSERT WITH CHECK (
  auth.uid() = customer_id
  OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('agent', 'admin')
  )
);

-- 4. UPDATE Policy (Only Agents/Admins can modify status/priority)
CREATE POLICY "strict_ticket_update" ON tickets
FOR UPDATE USING (
  -- Customers can update ONLY their own (e.g. close)
  auth.uid() = customer_id
  OR
  -- Agents/Admins update ANY
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('agent', 'admin')
  )
);
