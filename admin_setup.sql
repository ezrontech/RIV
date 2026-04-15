-- 1. Correct the role constraint to allow 'creator'
-- We first identify and drop the existing constraint
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check') THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;
    END IF;
END $$;

-- 2. Add the updated constraint including 'creator'
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('creator', 'member', 'visitor'));

-- 3. Update existing 'elder' roles to 'creator' if necessary
UPDATE profiles SET role = 'creator' WHERE role = 'elder';

-- 4. Assign 'creator' role to the primary user
UPDATE profiles 
SET role = 'creator' 
WHERE id = 'dde681e0-518d-4834-8894-f6cb911d5ed1';

-- 5. Update RLS policies for role management
-- Only 'creator' can update the role of any profile
DROP POLICY IF EXISTS "creators manage roles" ON profiles;
CREATE POLICY "creators manage roles" 
ON profiles 
FOR UPDATE 
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()::text) = 'creator'
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()::text) = 'creator'
);


-- Note: Ensure the 'profiles' table has a 'role' column (it should, as per schema.ts)
-- If not available, run: ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member';
