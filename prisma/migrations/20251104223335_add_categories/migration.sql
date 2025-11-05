-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('STANDARD', 'TWO_CATEGORY');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "categoryA" TEXT,
ADD COLUMN     "categoryB" TEXT,
ADD COLUMN     "mode" "Mode" NOT NULL DEFAULT 'STANDARD';
