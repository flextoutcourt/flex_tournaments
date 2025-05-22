/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `voteKeywordsJson` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `currentRoundNo` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfItems` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `twitchChannel` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the `Round` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_item1Id_fkey";

-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_item2Id_fkey";

-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_winnerId_fkey";

-- DropIndex
DROP INDEX "Item_tournamentId_name_key";

-- DropIndex
DROP INDEX "Tournament_status_idx";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "imageUrl",
DROP COLUMN "voteKeywordsJson",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "youtubeUrl" TEXT;

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "currentRoundNo",
DROP COLUMN "numberOfItems",
DROP COLUMN "status",
DROP COLUMN "twitchChannel",
ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "Round";

-- DropEnum
DROP TYPE "RoundStatus";

-- DropEnum
DROP TYPE "Status";
