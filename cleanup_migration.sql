-- Delete the failed migration record from Prisma's migration tracking
DELETE FROM "_prisma_migrations" WHERE migration = '20260106024753_update_roles_to_superadmin_vip';
