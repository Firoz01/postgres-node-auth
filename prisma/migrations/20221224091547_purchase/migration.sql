/*
  Warnings:

  - You are about to drop the `parchase_info` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "parchase_info" DROP CONSTRAINT "parchase_info_coursebook_id_fkey";

-- DropForeignKey
ALTER TABLE "parchase_info" DROP CONSTRAINT "parchase_info_package_id_fkey";

-- DropForeignKey
ALTER TABLE "parchase_info" DROP CONSTRAINT "parchase_info_variation_id_fkey";

-- DropForeignKey
ALTER TABLE "parchase_info" DROP CONSTRAINT "parchase_info_vocavive_id_fkey";

-- DropTable
DROP TABLE "parchase_info";

-- CreateTable
CREATE TABLE "purchase_info" (
    "id" SERIAL NOT NULL,
    "vocavive_id" INTEGER,
    "coursebook_id" INTEGER,
    "package_id" INTEGER NOT NULL,
    "variation_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_info_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "purchase_info" ADD CONSTRAINT "purchase_info_vocavive_id_fkey" FOREIGN KEY ("vocavive_id") REFERENCES "vocavive_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_info" ADD CONSTRAINT "purchase_info_coursebook_id_fkey" FOREIGN KEY ("coursebook_id") REFERENCES "coursebook_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_info" ADD CONSTRAINT "purchase_info_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_info" ADD CONSTRAINT "purchase_info_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "Variation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
