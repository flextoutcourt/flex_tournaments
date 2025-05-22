/*
  Warnings:

  - You are about to drop the column `name` on the `Tournament` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tournament_name_key";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_title_key" ON "Tournament"("title");
