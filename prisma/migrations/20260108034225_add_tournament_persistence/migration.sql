/*
  Warnings:

  - A unique constraint covering the columns `[tournamentId,matchIndex,userId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournamentId,matchIndex,twitchUsername]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_userId_fkey";

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "currentMatchIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentRoundNumber" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stateJson" JSONB,
ADD COLUMN     "tournamentWinnerId" TEXT;

-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "lastActivity" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "matchIndex" INTEGER,
ADD COLUMN     "twitchUsername" TEXT,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "TournamentSession" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT,
    "twitchChannel" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivityAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TournamentSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TournamentSession_tournamentId_idx" ON "TournamentSession"("tournamentId");

-- CreateIndex
CREATE INDEX "TournamentSession_userId_idx" ON "TournamentSession"("userId");

-- CreateIndex
CREATE INDEX "TournamentSession_isActive_idx" ON "TournamentSession"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentSession_tournamentId_userId_key" ON "TournamentSession"("tournamentId", "userId");

-- CreateIndex
CREATE INDEX "Tournament_isActive_idx" ON "Tournament"("isActive");

-- CreateIndex
CREATE INDEX "Tournament_status_idx" ON "Tournament"("status");

-- CreateIndex
CREATE INDEX "Vote_userId_idx" ON "Vote"("userId");

-- CreateIndex
CREATE INDEX "Vote_matchIndex_idx" ON "Vote"("matchIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_tournamentId_matchIndex_userId_key" ON "Vote"("tournamentId", "matchIndex", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_tournamentId_matchIndex_twitchUsername_key" ON "Vote"("tournamentId", "matchIndex", "twitchUsername");

-- AddForeignKey
ALTER TABLE "TournamentSession" ADD CONSTRAINT "TournamentSession_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentSession" ADD CONSTRAINT "TournamentSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
