/*
  Warnings:

  - You are about to drop the column `parchase` on the `coursebook_user` table. All the data in the column will be lost.
  - You are about to drop the column `parchase` on the `vocavive_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "coursebook_user" DROP COLUMN "parchase";

-- AlterTable
ALTER TABLE "vocavive_user" DROP COLUMN "parchase";

-- CreateTable
CREATE TABLE "parchase_info" (
    "id" SERIAL NOT NULL,
    "vocavive_id" INTEGER NOT NULL,
    "coursebook_id" INTEGER NOT NULL,
    "package_id" INTEGER NOT NULL,
    "variation_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parchase_info_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parchase_info" ADD CONSTRAINT "parchase_info_vocavive_id_fkey" FOREIGN KEY ("vocavive_id") REFERENCES "vocavive_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parchase_info" ADD CONSTRAINT "parchase_info_coursebook_id_fkey" FOREIGN KEY ("coursebook_id") REFERENCES "coursebook_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parchase_info" ADD CONSTRAINT "parchase_info_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parchase_info" ADD CONSTRAINT "parchase_info_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "Variation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
