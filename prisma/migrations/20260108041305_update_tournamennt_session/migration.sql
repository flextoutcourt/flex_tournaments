/*
  Warnings:

  - You are about to drop the column `currentMatchIndex` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `currentRoundNumber` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `stateJson` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentWinnerId` on the `Tournament` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Tournament_isActive_idx";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "currentMatchIndex",
DROP COLUMN "currentRoundNumber",
DROP COLUMN "isActive",
DROP COLUMN "stateJson",
DROP COLUMN "tournamentWinnerId";

-- AlterTable
ALTER TABLE "TournamentSession" ADD COLUMN     "currentMatchIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentRoundNumber" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stateJson" JSONB,
ADD COLUMN     "tournamentWinnerId" TEXT;
