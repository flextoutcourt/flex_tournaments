-- Update all ADMIN users to VIP users
UPDATE "User"
SET role = 'VIP'
WHERE role = 'ADMIN';

-- Verify the update (optional - comment out if not needed)
SELECT id, email, name, role, "createdAt"
FROM "User"
WHERE role = 'VIP'
ORDER BY "createdAt" DESC;
