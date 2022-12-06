-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "vocavive_user" (
    "id" SERIAL NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vocavive_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "vocavive_userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variation" (
    "id" SERIAL NOT NULL,
    "expiration" INTEGER NOT NULL,
    "btd" INTEGER NOT NULL,
    "discount_bdt" INTEGER NOT NULL,
    "usd" INTEGER NOT NULL,
    "discount_usd" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "package_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Variation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vocavive_user_userEmail_key" ON "vocavive_user"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Package_vocavive_userId_key" ON "Package"("vocavive_userId");

-- CreateIndex
CREATE UNIQUE INDEX "Variation_package_id_key" ON "Variation"("package_id");

-- AddForeignKey
ALTER TABLE "vocavive_user" ADD CONSTRAINT "vocavive_user_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_vocavive_userId_fkey" FOREIGN KEY ("vocavive_userId") REFERENCES "vocavive_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variation" ADD CONSTRAINT "Variation_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
