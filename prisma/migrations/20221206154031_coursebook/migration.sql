-- DropForeignKey
ALTER TABLE "Variation" DROP CONSTRAINT "Variation_package_id_fkey";

-- AlterTable
ALTER TABLE "Variation" ALTER COLUMN "package_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "coursebook_user" (
    "id" SERIAL NOT NULL,
    "package_id" INTEGER,
    "userId" INTEGER NOT NULL,
    "userEmail" TEXT NOT NULL,
    "parchase" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coursebook_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coursebook_user_userId_userEmail_key" ON "coursebook_user"("userId", "userEmail");

-- AddForeignKey
ALTER TABLE "coursebook_user" ADD CONSTRAINT "coursebook_user_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coursebook_user" ADD CONSTRAINT "coursebook_user_userId_userEmail_fkey" FOREIGN KEY ("userId", "userEmail") REFERENCES "User"("id", "email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variation" ADD CONSTRAINT "Variation_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
