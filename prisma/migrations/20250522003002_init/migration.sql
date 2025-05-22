/*
  Warnings:

  - You are about to drop the column `started` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the `Clip` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfItems` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twitchChannel` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SETUP', 'ACTIVE', 'PAUSED', 'FINISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RoundStatus" AS ENUM ('PENDING', 'ACTIVE', 'FINISHED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Clip" DROP CONSTRAINT "Clip_tournamentId_fkey";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "started",
DROP COLUMN "title",
ADD COLUMN     "currentRoundNo" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "numberOfItems" INTEGER NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'SETUP',
ADD COLUMN     "twitchChannel" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Clip";

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "voteKeywordsJson" TEXT NOT NULL DEFAULT '[]',
    "tournamentId" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "matchNumber" INTEGER,
    "item1Id" TEXT NOT NULL,
    "item1Votes" INTEGER NOT NULL DEFAULT 0,
    "item2Id" TEXT NOT NULL,
    "item2Votes" INTEGER NOT NULL DEFAULT 0,
    "winnerId" TEXT,
    "status" "RoundStatus" NOT NULL DEFAULT 'PENDING',
    "tournamentId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Item_tournamentId_idx" ON "Item"("tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_tournamentId_name_key" ON "Item"("tournamentId", "name");

-- CreateIndex
CREATE INDEX "Round_tournamentId_idx" ON "Round"("tournamentId");

-- CreateIndex
CREATE INDEX "Round_tournamentId_status_idx" ON "Round"("tournamentId", "status");

-- CreateIndex
CREATE INDEX "Round_tournamentId_roundNumber_idx" ON "Round"("tournamentId", "roundNumber");

-- CreateIndex
CREATE INDEX "Round_tournamentId_roundNumber_status_idx" ON "Round"("tournamentId", "roundNumber", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Round_tournamentId_roundNumber_item1Id_item2Id_key" ON "Round"("tournamentId", "roundNumber", "item1Id", "item2Id");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_name_key" ON "Tournament"("name");

-- CreateIndex
CREATE INDEX "Tournament_status_idx" ON "Tournament"("status");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_item1Id_fkey" FOREIGN KEY ("item1Id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_item2Id_fkey" FOREIGN KEY ("item2Id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
