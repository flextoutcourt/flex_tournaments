-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SETUP', 'LIVE');

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'SETUP';
