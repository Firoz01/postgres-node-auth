/*
  Warnings:

  - You are about to drop the column `vocavive_userId` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `btd` on the `Variation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,userEmail]` on the table `vocavive_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bdt` to the `Variation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `vocavive_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `vocavive_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_vocavive_userId_fkey";

-- DropForeignKey
ALTER TABLE "vocavive_user" DROP CONSTRAINT "vocavive_user_userEmail_fkey";

-- DropIndex
DROP INDEX "Package_vocavive_userId_key";

-- DropIndex
DROP INDEX "Variation_package_id_key";

-- DropIndex
DROP INDEX "vocavive_user_userEmail_key";

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "vocavive_userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Variation" DROP COLUMN "btd",
ADD COLUMN     "bdt" INTEGER NOT NULL,
ALTER COLUMN "discount_bdt" SET DEFAULT 0,
ALTER COLUMN "usd" SET DEFAULT 0,
ALTER COLUMN "discount_usd" SET DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT false;

-- AlterTable
ALTER TABLE "vocavive_user" ADD COLUMN     "package_id" INTEGER,
ADD COLUMN     "parchase" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_id_email_key" ON "User"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "vocavive_user_userId_userEmail_key" ON "vocavive_user"("userId", "userEmail");

-- AddForeignKey
ALTER TABLE "vocavive_user" ADD CONSTRAINT "vocavive_user_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocavive_user" ADD CONSTRAINT "vocavive_user_userId_userEmail_fkey" FOREIGN KEY ("userId", "userEmail") REFERENCES "User"("id", "email") ON DELETE RESTRICT ON UPDATE CASCADE;
